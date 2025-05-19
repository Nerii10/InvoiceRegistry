import { useEffect, useState } from "react";
import "../styles/Tree.css";
import { motion } from "framer-motion";
import { ChevronDown, UserRound, ShieldUser, Crown, Plus } from "lucide-react";

function RenderTreeNodes({
  node,
  level = 0,
  usersData = [],
  onDropUser,
  setNewUnitData,
  setSelectedAction,
}) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const hasUsers = usersData.some((u) => u.unit_id === node.id);
  const [overflowVisible, setOverflowVisible] = useState(level === 0);

  useEffect(() => {
    if (node) {
      if (!hasUsers) {
        setIsOpen(false);
      }
    }
  }, [node]);

  const variants = {
    closed: {
      width: "100%",
      height: 0,
      overflow: "hidden",
      transition: {
        type: "tween",
        duration: 0.25,
        ease: "easeOut",
      },
    },
    open: {
      width: "100%",
      height: "auto",
      transition: { type: "tween", duration: 0.25, ease: "easeOut" },
      transitionEnd: {
        overflow: "visible",
      },
    },
  };

  return (
    <div
      className={level === 0 ? "tree-header-input" : "tree-input"}
      style={{ marginLeft: level === 0 ? "0px" : "20px" }}
      data-unit-id={node.id}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Nagłówek */}
      <div
        className={level === 0 ? "tree-input-name-header" : "tree-input-name"}
      >
        {(node.children?.length || hasUsers) > 0 && (
          <ChevronDown
            onClick={() => {
              if ((node.children?.length || hasUsers) > 0) {
                setIsOpen((o) => !o);
              }
            }}
            style={{
              rotate: isOpen ? "0deg" : "-90deg",
              transition: "0.25s ease",
            }}
          />
        )}{" "}
        {node.name}{" "}
        <Plus
          size={20}
          onClick={() => {
            setSelectedAction("New");
            setNewUnitData({ parent: node.id });
          }}
        />
      </div>

      {/* Dzieci */}
      <motion.div
        className={
          isOpen ? "tree-input-children-open" : "tree-input-children-closed"
        }
        variants={variants}
        initial={level === 0 ? "open" : "closed"}
        animate={isOpen ? "open" : "closed"}
        style={{ overflow: overflowVisible ? "visible" : "hidden" }}
        onAnimationStart={() => {
          setOverflowVisible(false);
        }}
        onAnimationComplete={() => {
          if (isOpen) {
            setOverflowVisible(true);
          }
        }}
      >
        {(usersData ?? [])
          .filter((u) => u.unit_id === node.id)
          .map((user) => (
            <motion.a
              key={user.user_id}
              className="tree-input-children-user"
              drag={overflowVisible}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={1}
              onDragEnd={(_, info) => {
                const { x, y } = info.point;
                const elems = document.elementsFromPoint(x, y);
                const dropEl = elems.find((el) =>
                  el.hasAttribute("data-unit-id")
                );
                if (dropEl) {
                  const targetUnitId = Number(dropEl.dataset.unitId);
                  onDropUser(user.user_id, targetUnitId);
                }
              }}
            >
              {user.type === "admin" ? (
                <ShieldUser />
              ) : user.type === "owner" ? (
                <Crown />
              ) : (
                <UserRound />
              )}
              {user.name}
            </motion.a>
          ))}

        {(node.children ?? []).map((child) => (
          <RenderTreeNodes
            key={child.id}
            node={child}
            setNewUnitData={setNewUnitData}
            setSelectedAction={setSelectedAction}
            level={level + 1}
            usersData={usersData}
            onDropUser={onDropUser}
          />
        ))}
      </motion.div>
    </div>
  );
}

function buildTree(unitsData = []) {
  const map = {};
  unitsData.forEach((u) => {
    map[u.id] = { ...u, children: [] };
  });
  const tree = [];
  unitsData.forEach((u) => {
    if (u.parent_id == null) tree.push(map[u.id]);
    else if (map[u.parent_id]) map[u.parent_id].children.push(map[u.id]);
  });
  return tree;
}

export default function Tree({
  unitsData = [],
  usersData = [],
  moveUnit,
  setSelectedAction,
  setNewUnitData,
}) {
  // map user → jego bieżący unit
  const userToUnit = Object.fromEntries(
    (usersData ?? []).map((u) => [u.id, u.unit_id])
  );

  const handleDropUser = (userId, targetUnitId) => {
    const currentUnit = userToUnit[userId];
    if (currentUnit === targetUnitId) {
      console.log(`user ${userId} już w unit ${targetUnitId}, pomijam.`);
      return;
    }
    moveUnit({ unit: targetUnitId, user: userId });
    console.log(`user ${userId} → unit ${targetUnitId}`);
  };

  const treeRoots = buildTree(unitsData);

  if (!treeRoots.length) {
    return <p>Brak jednostek do wyświetlenia.</p>;
  }

  return (
    <section className="tree-wrapper">
      {treeRoots.map((root) => (
        <RenderTreeNodes
          setSelectedAction={setSelectedAction}
          setNewUnitData={setNewUnitData}
          key={root.id}
          node={root}
          usersData={usersData}
          onDropUser={handleDropUser}
        />
      ))}
    </section>
  );
}

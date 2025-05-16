import { useState } from "react";
import "../styles/Tree.css";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  UserRound,
  ShieldUser,
  Crown,
} from "lucide-react";

function RenderTreeNodes({ node, level = 0, usersData }) {
  const [isOpen, setIsOpen] = useState(level == 0 ? true : false);
  return (
    <div
      className={level == 0 ? "tree-header-input" : "tree-input"}
      style={{ marginLeft: level == 0 ? "0px" : "20px" }}
    >
      {/* Name */}
      <div
        onClick={() => {
          if (
            node?.children?.length > 0 ||
            usersData.some((u) => u.unit_id == node.id)
          ) {
            setIsOpen((o) => !o);
          }
        }}
        className={level == 0 ? "tree-input-name-header" : "tree-input-name"}
      >
        {node?.children?.length > 0 ||
        usersData.some((u) => u.unit_id == node.id) ? (
          <ChevronDown style={{ rotate: isOpen ? "0deg" : "-90deg", transition:"0.25s ease"}} />
        ) : (
          ""
        )}{" "}
        {node?.name}
      </div>

      {/* Children */}
      <motion.div
        className={
          isOpen ? "tree-input-children-open" : "tree-input-children-closed"
        }
        animate={
          isOpen
            ? { width: "100%", height: "fit-content" }
            : { width: "100%", height: "0px" }
        }
        initial={
          level == 0
            ? { width: "100%", height: "fit-content" }
            : { width: "100%", height: "0px" }
        }
        transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
      >
        {usersData
          .filter((u) => u.unit_id === node.id)
          .map((user) => {
            return (
              <a className="tree-input-children-user">
                {user.type == "admin" ? (
                  <ShieldUser />
                ) : user.type == "owner" ? (
                  <Crown />
                ) : (
                  <UserRound />
                )}
                {user.name}
              </a>
            );
          })}
        {node?.children?.map((child) => (
          <RenderTreeNodes
            node={child}
            level={level + 1}
            usersData={usersData}
          />
        ))}
      </motion.div>
    </div>
  );
}

function buildTree(unitsData) {
  const map = {};
  unitsData.forEach((u) => {
    map[u.id] = { ...u, children: [] };
  });

  const tree = [];

  unitsData.forEach((u) => {
    if (u.parent_id == null) {
      tree.push(map[u.id]);
    } else if (map[u.parent_id]) {
      map[u.parent_id].children.push(map[u.id]);
    }
  });

  return tree;
}

export default function Tree({ unitsData, usersData }) {
  return (
    <section className="tree-wrapper">
      {unitsData &&
        buildTree(unitsData).map((root) => (
          <RenderTreeNodes node={root} usersData={usersData} />
        ))}
    </section>
  );
}

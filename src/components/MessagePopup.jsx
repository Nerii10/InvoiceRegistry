import { useState, useEffect } from "react";
import "../styles/ErrorPopup.css";
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";
import { CircleX, X } from "lucide-react";

export function Notification({
  content,
  type,
  index,
  isExpanded,
  setIsExpanded,
  setAllNotifications,
  id,
  allNotifications,
}) {
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function handleRemoveNotification(notificationId) {
    setAllNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  }

  return (
    <>
      <motion.div
        className={
          type
            ? type === "error"
              ? "notification-error"
              : "notification-message"
            : "notification-error"
        }
        initial={{
          position: "absolute",
          opacity: 1 - index * 0.3,
          scale: clamp(1 - index * 0.1, 0, 1),
          marginBottom: (index + 1) * 10 + "px",
          filter: "blur(2px)",
          zIndex: allNotifications?.length - index + 2,
        }}
        animate={
          !isExpanded
            ? {
                opacity: 1,
                scale: 1,
                position: "absolute",
                filter: "blur(0px)",
                height: "100px",
                flexShrink: 0,
                marginBottom: index * 120 + 55 + "px",
              }
            : {
                position: "absolute",
                opacity: 1 - index * 0.3,
                height: "100px",
                filter: `blur(${index * 2}px)`,
                flexShrink: 0,
                scale: clamp(1 - index * 0.1, 0, 1),
                marginBottom: (index + 1) * 10 + "px",
                zIndex: allNotifications?.length - index,
              }
        }
        exit={{
          position: "absolute",
          opacity: 0,
          filter: "blur(2px)",
          scale: clamp(1 - index * 0.1, 0, 1),
          marginBottom: (index + 1) * 10 + "px",
          zIndex: -10,
        }}
        transition={{ type: "spring", damping: 20 }}
      >
        {content}
        <div
          onClick={() => handleRemoveNotification(id)}
          className={
            type
              ? type === "error"
                ? "close-button-error"
                : "close-button-success"
              : "close-button-error"
          }
        >
          <X size={15} stroke="white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ height: "0px" }}
        exit={{ height: "0px" }}
        animate={{ height: isExpanded ? "0px" : "120px" }}
        style={{
          position: "static",
          width: "50%",
          flexShrink: 0,
        }}
        transition={{ type: "spring", damping: 20 }}
      />
    </>
  );
}

export default function MessagePopup({ message, loading }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [allNotifications, setAllNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    if (isExpanded) {
      setVisibleNotifications(allNotifications.slice(0, 4));
    } else {
      setVisibleNotifications(allNotifications);
    }
  }, [isExpanded, allNotifications]);

  useEffect(() => {
    if (message?.message) {
      setAllNotifications((prev) => [
        { id: nanoid(), content: message.message, type: message?.type },
        ...prev,
      ]);
    }
  }, [message]);

  return (
    <motion.div className="notification-wrapper">
      <motion.div
        className="notification-container"
        onMouseEnter={() => setIsExpanded(false)}
        onMouseLeave={() => setIsExpanded(true)}
      >
        <motion.div className={allNotifications.length == 0 ? "notification-clear-button-container-empty"  : "notification-clear-button-container"}
        initial={{opacity:0}}
        animate={isExpanded ? {opacity:0} : {opacity:1}}
        transition={{type:'spring', damping:23}}
        >
          <button className="notification-clear-button">
            <CircleX stroke="black"  onClick={()=>{setAllNotifications([])}}/>
          </button>
        </motion.div>
        <AnimatePresence initial={false}>
          {visibleNotifications?.map(({ id, content, type }, index) => (
            <Notification
              id={id}
              key={id}
              content={content}
              type={type}
              setAllNotifications={setAllNotifications}
              index={index}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              allNotifications={allNotifications}
            />
          ))}
        </AnimatePresence>
        <motion.div
          initial={{ height: "140px" }}
          exit={{ height: "140px" }}
          animate={{
            height: isExpanded
              ? allNotifications.length != 0
                ? "140px"
                : "0px"
              : "0px",
          }}
          style={{
            position: "static",
            width: "50%",
            flexShrink: 0,
          }}
          transition={{ type: "spring", damping: 20 }}
        />
      </motion.div>
    </motion.div>
  );
}

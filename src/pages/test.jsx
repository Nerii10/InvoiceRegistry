import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const notificationStyle = {
  backgroundColor: "wheat",
  padding: "20px 10px",
  boxSizing: "border-box",
  borderRadius: "50px",
};

const buttonStyle = {
  backgroundColor: "black",
  padding: "20px 10px",
  fontSize: "20px",
  borderRadius: "50px",
  color: "white",
};

export function Notification({
  id,
  text,
  index,
  expanded,
  notifications,
  onClose,
}) {
  return (
    <motion.div
      layout
      key={id}
      style={{
        ...notificationStyle,
        zIndex: notifications.length - index,
        width: "90%",
        whiteSpace: "nowrap",
        overflow: "auto",
        position: "absolute",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      initial={{
        opacity: 1 - index * 0.3,
        scale: 1 - index * 0.1,
        marginTop: (index + 1) * -10 + "px",
      }}
      animate={
        !expanded
          ? { marginTop: (index + 1) * -150 + "px", opacity: 1, scale: 1 }
          : {
              marginTop: (index + 1) * -10 + "px",
              opacity: 1 - index * 0.3,
              scale: 1 - index * 0.1,
            }
      }
      exit={{
        opacity: 1 - index * 0.3,
        scale: 1 - index * 0.1,
        marginTop: (index + 1) * -10 + "px",
      }}
      transition={{ type: "spring", damping: 11 + index * 1 }}
    >
      <span>{text}</span>
      <button onClick={() => onClose(id)} style={{ marginLeft: "20px" }}>
        ❌
      </button>
    </motion.div>
  );
}

export default function TEST() {
  const [notifications, setNotifications] = useState([
    "Nowa wiadomość od Karolina: 'Hej, co robisz dziś wieczorem?'",
    "Twoje zamówienie #48293 zostało wysłane",
    "Przypomnienie: Wizyta u dentysty jutro o 14:00",
    "Nowe logowanie na Twoje konto z urządzenia iPhone 15 Pro",
    "Aktualizacja dostępna: Zainstaluj najnowszą wersję systemu",
    "Spotkanie 'Projekt Zespół' rozpoczyna się za 15 minut",
    "Spotify: Nowy album 'The Weeknd' już dostępny",
    "Bateria jest na poziomie 15%. Podłącz ładowarkę",
    "Alert pogodowy: Silny wiatr w Twoim rejonie",
    "Zdjęcie zostało pomyślnie przesłane do iCloud",
  ]);

  const [expanded, setExpanded] = useState(false);
  const [displayed, setDisplayed] = useState([]);

  useEffect(() => {
    if (expanded) {
      setDisplayed(notifications.slice(0, 4));
    } else {
      setDisplayed(notifications);
    }
  }, [expanded, notifications]);

  const handleClose = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const notifiContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    width: "100%",
    zIndex: 1,
  };

  return (
    <div style={notifiContainer}>
      <button
        style={buttonStyle}
        onClick={() => {
          setExpanded((prev) => !prev);
        }}
      >
        {expanded ? "Pokaż wszystkie" : "Zwiń"}
      </button>

      <div style={{position:"fixed",width:"400px",bottom:"50px", right:"10px"}}>
        <AnimatePresence mode="popLayout">
          {displayed.map((notifi, index) => (
            <Notification
              key={notifi}
              id={notifi}
              text={notifi}
              index={index}
              expanded={expanded}
              notifications={notifications}
              onClose={handleClose}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

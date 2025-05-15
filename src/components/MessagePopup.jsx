import { useState, useEffect } from "react";
import "../styles/ErrorPopup.css";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function MessagePopup({ message, loading }) {
  const [showMessage, setShowMessage] = useState(false);
  const location = useLocation();
  const closePopup = () => {
    setShowMessage(false);
  };

  useEffect(() => {
    setShowMessage(true);
  }, [message]);

  useEffect(() => {
    setShowMessage(false);
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      {showMessage && !loading && message && (
        <motion.div
          className="error-popup-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={message && { scale: 1, opacity: 1 }}
          transition={{ type: "tween", ease: "circInOut", duration: 0.5 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <div className="error-popup">
            <p className="error-message">{message?.message || "no message"}</p>
            <button
              onClick={closePopup}
              className={
                message?.type == "error"
                  ? "close-button-error"
                  : "close-button-success"
              }
            >
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

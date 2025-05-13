import { useState, useEffect } from "react";
import "../styles/ErrorPopup.css";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ErrorPopup({ error }) {
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");

  const closePopup = () => {
    setShowError(false);
  };

  useEffect(() => {
    if (error) {
      setShowError(true);
      setMessage(getErrorText());
    } else {
      setShowError(false);
    }
  }, [error]);

  const getErrorText = () => {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (error.message) return error.message;
    return JSON.stringify(error); // fallback
  };

  return (
    <AnimatePresence mode="wait">
      {showError && (
        <motion.div
          className="error-popup-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={error && { scale: 1, opacity: 1 }}
          transition={{ type: "tween", ease: "circInOut", duration: 0.5 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <div className="error-popup">
            <p className="error-message">{message}</p>
            <button onClick={closePopup} className="close-button">
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

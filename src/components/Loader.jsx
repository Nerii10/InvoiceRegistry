// Motion
import { motion, AnimatePresence } from "framer-motion";
// Icons
import { Loader as LoadingCircle, Check, X } from "lucide-react";
// Styles
import "../styles/Loader.css";
import { useEffect, useState } from "react";

export default function Loader({
  loading,
  error,
  size,
  color,
  onlyLoader,
  position,
}) {
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (loading) {
      setStatus("loading");
    } else if (status === "loading") {
      setStatus("success");
      const t = setTimeout(() => setStatus("idle"), 1000);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const variants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  };

  const style = {
    "--position": position || "start",
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {!onlyLoader && (status == "loading" || status == "success") && (
          <motion.section
            className="loader-wrapper"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            style={style}
            transition={{ type: "tween", duration: 0.5, ease: "circInOut" }}
          >
            {status === "loading" && (
              <LoadingCircle
                size={size || 20}
                stroke={color || "black"}
                className="loader-icon"
              />
            )}

            {error
              ? status === "success" && (
                  <motion.div
                    key={loading}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{
                      type: "tween",
                      duration: 0.25,
                      ease: "circInOut",
                    }}
                  >
                    <X size={size || 20} className="loader-error" />
                  </motion.div>
                )
              : status === "success" && (
                  <motion.div
                    key={loading}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{
                      type: "tween",
                      duration: 0.25,
                      ease: "circInOut",
                    }}
                  >
                    <Check size={size || 20} className="loader-success" />
                  </motion.div>
                )}
          </motion.section>
        )}

        {onlyLoader && status == "loading" && (
          <motion.section
            className="loader-wrapper-only-loader"
            initial="initial"
            style={style}
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0 }}
          >
            {status === "loading" && (
              <LoadingCircle
                size={size || 20}
                stroke={color || "black"}
                className="loader-icon"
              />
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

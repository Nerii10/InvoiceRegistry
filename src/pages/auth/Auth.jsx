//Styles
import "../../styles/Auth.css";

//Components
import Login from "./Login";
import Register from "./Register";

//React
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const [action, setAction] = useState("login");

  return (
    <motion.section className="auth-wrapper">
      <AnimatePresence>
        <motion.div
          key={action}
          style={{ position: "absolute" }}
          initial={{ scale: 0.5, opacity: 0, filter: "blur(5px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          exit={{ scale: 0.5, opacity: 0, filter: "blur(5px)" }}
          transition={{ type: "spring", damping: 15 }}
        >
          {action == "login" ? (
            <Login setAction={setAction} />
          ) : (
            <Register setAction={setAction} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function SlidingText({ inputs }) {
  const max = inputs.length;
  const [current, setCurrent] = useState(0);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(0);
  const spanRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1 >= max ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [max]);

  useEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth);
      setHeight(spanRef.current.offsetHeight);
      console.log(spanRef.current.offsetWidth);
    }
  }, [current]);

  return (
    <>
      {/* Text */}
      <motion.div
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          perspective: "300px",
          width: width,
          transition: "width 0.5s ease",
        }}
        initial={{ height: "0px" }}
        animate={{ height: height }}
        transition={{ type: "spring", damping: 23 }}
      >
        <AnimatePresence mode="sync">
          <motion.span
            key={inputs[current]}
            initial={{
              filter: "blur(10px)",
              opacity: 0,
              y: -15,
              scale: 0.8,
              rotateX: "90deg",
            }}
            animate={{
              filter: "blur(0px)",
              position: "absolute",
              opacity: 1,
              scale: 1,
              rotateX: "0deg",
              y: 0,
            }}
            exit={{
              filter: "blur(10px)",
              opacity: -25,
              y: 15,
              rotateX: "-90deg",
              scale: 0.8,
            }}
            transition={{ type: "spring", damping: 22 }}
            style={{
              padding: 0,
              height: "fit-content",
              left: 0,
              margin: 0,
              display: "inline-block",
              background:
                "linear-gradient(to right, rgb(131, 25, 244), rgb(43, 156, 255))",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {inputs[current]}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Ref */}
      <span
        ref={spanRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {inputs[current]}
      </span>
    </>
  );
}

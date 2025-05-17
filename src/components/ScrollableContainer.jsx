//Motion
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

//React
import { useEffect, useRef } from "react";

export default function ScrollableContainer({
  isMobile,
  containerRef,
  children,
  style,
  initialRotateX = "15deg",
  initialopacity = 0,
  initialscale = 0.7,
  initialY = 300,
}) {
  const contentRef = useRef();

  const { scrollYProgress } = useScroll({
    container: isMobile ? containerRef : undefined,
    target: contentRef,
    offset: ["start end", "start center"],
  });
  const smoothProgress = useSpring(scrollYProgress, { damping: 30 });
  const opacity = useTransform(smoothProgress, [0, 1], [initialopacity, 1]);
  const scale = useTransform(smoothProgress, [0, 1], [initialscale, 1]);
  const rotateX = useTransform(
    smoothProgress,
    [0, 1],
    [initialRotateX, "0deg"]
  );
  const y = useTransform(smoothProgress, [0, 1], [initialY, 0]);

  // LOG
  // useEffect(() => {
  //   const unsub = scrollYProgress.on("change", (v) => {
  //     console.log(v);
  //   });
  //   return () => unsub();
  // }, [scrollYProgress]);

  return (
    <motion.div
      style={{ ...style, perspective: "500px", position: "relative" }}
      ref={contentRef}
    >
      <motion.div
        style={{ height:"100%", width:"100%", flexShrink: 0, ...style, scale, rotateX, y, opacity }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

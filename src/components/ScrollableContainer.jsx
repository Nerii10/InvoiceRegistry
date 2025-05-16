import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export default function ScrollableContainer({
  isMobile,
  containerRef,
  children,
  style,
}) {
  const contentRef = useRef();

  const { scrollYProgress } = useScroll({
    container: isMobile ? containerRef : undefined,
    target: contentRef,
    offset: ["start end", "start center"],
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 30 });

  const opacity = useTransform(smoothProgress, [0, 1], [0, 1]);
  const scale = useTransform(smoothProgress, [0, 1], [0.7, 1]);
  const rotateX = useTransform(smoothProgress, [0, 1], ["15deg", "0deg"]);
  const y = useTransform(smoothProgress, [0, 1], [300, 0]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      console.log(v);
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <motion.div style={{ perspective: "500px", position:"relative" }} ref={contentRef}>
      <motion.div style={{...style, scale, rotateX, y, opacity }}>{children}</motion.div>
    </motion.div>
  );
}

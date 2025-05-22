// import React, { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// function RollingDigit({ prevDigit, digit, speed }) {
//   const [sequence, setSequence] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const motionValue = useMotionValue(prevDigit);
//   const direction = (digit - prevDigit + 10) % 10 <= 5 ? 1 : -1;

//   useEffect(() => {
//     const newSequence = [];
//     let current = prevDigit;
//     while (current !== digit) {
//       newSequence.push(current);
//       current = (current + direction + 10) % 10;
//     }
//     newSequence.push(digit);
//     setSequence(newSequence);
//     setCurrentIndex(0);
//     motionValue.set(prevDigit);

//     newSequence.forEach((num, index) => {
//       setTimeout(() => {
//         motionValue.set(num);
//       }, index * speed);
//     });

//     const interval = setInterval(() => {
//       setCurrentIndex((i) => {
//         if (i + 1 < newSequence.length) {
//           return i + 1;
//         } else {
//           clearInterval(interval);
//           return i;
//         }
//       });
//     }, speed);

//     return () => clearInterval(interval);
//   }, [prevDigit, digit, motionValue, direction, speed]);

//   return (
//     <div style={{ position: "relative", width: "35px", height: "1em", display: "inline-block", textAlign: "center" }}>
//       <AnimatePresence mode="sync" initial={false}>
//         <motion.span
//           key={sequence[currentIndex]}
//           initial={{ y: direction * 50 + "%", opacity: 0 }}
//           animate={{ y: "0%", opacity: 1 }}
//           exit={{ y: -direction * 50 + "%", opacity: 0 }}
//           transition={{ type: "tween", duration: speed / 500 }}
//           style={{ position: "absolute", width: "100%", left: 0 }}
//         >
//           {sequence[currentIndex]}
//         </motion.span>
//       </AnimatePresence>
//     </div>
//   );
// }

// function AnimatedNumber({ value }) {
//   const digits = value.toString().split("");
//   const prevDigitsRef = useRef(digits);
//   const lastChangeTimeRef = useRef(Date.now());
//   const [speed, setSpeed] = useState(150);

//   const maxLen = Math.max(prevDigitsRef.current.length, digits.length);
//   const prevDigits = [...prevDigitsRef.current];
//   while (prevDigits.length < maxLen) prevDigits.unshift("0");
//   while (digits.length < maxLen) digits.unshift("0");

//   useEffect(() => {
//     const now = Date.now();
//     const delta = now - lastChangeTimeRef.current;
//     lastChangeTimeRef.current = now;

//     const newSpeed = Math.min(300, Math.max(50, delta / 2));
//     setSpeed(newSpeed);

//     prevDigitsRef.current = digits;
//   }, [digits]);

//   return (
//     <div style={{ display: "flex", justifyContent: "center", gap: "0.1em", fontSize: "72px", fontFamily: "monospace" }}>
//       {digits.map((digit, i) => (
//         <RollingDigit key={i} prevDigit={parseInt(prevDigits[i])} digit={parseInt(digit)} speed={speed} />
//       ))}
//     </div>
//   );
// }

// export default function TEST() {
//   const [number, setNumber] = useState(0);

//   return (
//     <div style={{ padding: "50px", textAlign: "center" }}>
//       <input
//         type="range"
//         min={0}
//         max={100}
//         value={number}
//         onChange={(e) => setNumber(parseInt(e.target.value))}
//         style={{ width: "300px", marginBottom: "40px" }}
//       />
//       <AnimatedNumber value={number} />
//     </div>
//   );
// }

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export default function TEST() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: imageRef,
    offset: ["start end", "start center"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      console.log("scrollYProgress:", v.toFixed(2));
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

const smooth = useSpring(scrollYProgress, {damping:23})
  const opacity = useTransform(smooth, [0, 1], [0, 1]);
  const width = useTransform(smooth, [0, 1], [250, 500]);
  const rotateX = useTransform(smooth, [0, 1], [100, 0]);
  const y = useTransform(smooth, [0, 1], [300, 0]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "scroll",
        position: "relative", // wymóg framer-motion
        backgroundColor: "black",
      }}
    >
      <div
        style={{
          height: "300vh", // żeby było co scrollować
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
        }}
      >
        <img
          style={{ width: "500px", opacity: 0 }}
          src="/InvoiceRegistry/placeholder.png"
        />
        <img
          style={{ width: "500px", opacity: 0 }}
          src="/InvoiceRegistry/placeholder.png"
        />
        <div style={{ perspective: "500px" }}>
          <motion.img
            ref={imageRef}
            style={{ width, rotateX, opacity, translateY:y }}
            src="/InvoiceRegistry/placeholder.png"
          />
        </div>

        <img
          style={{ width: "500px", opacity: 0 }}
          src="/InvoiceRegistry/placeholder.png"
        />
      </div>
    </div>
  );
}

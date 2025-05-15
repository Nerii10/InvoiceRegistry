import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

function RollingDigit({ prevDigit, digit, speed }) {
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const motionValue = useMotionValue(prevDigit);
  const direction = (digit - prevDigit + 10) % 10 <= 5 ? 1 : -1;

  useEffect(() => {
    const newSequence = [];
    let current = prevDigit;
    while (current !== digit) {
      newSequence.push(current);
      current = (current + direction + 10) % 10;
    }
    newSequence.push(digit);
    setSequence(newSequence);
    setCurrentIndex(0);
    motionValue.set(prevDigit);

    newSequence.forEach((num, index) => {
      setTimeout(() => {
        motionValue.set(num);
      }, index * speed);
    });

    const interval = setInterval(() => {
      setCurrentIndex((i) => {
        if (i + 1 < newSequence.length) {
          return i + 1;
        } else {
          clearInterval(interval);
          return i;
        }
      });
    }, speed);

    return () => clearInterval(interval);
  }, [prevDigit, digit, motionValue, direction, speed]);

  return (
    <div style={{ position: "relative", width: "35px", height: "1em", display: "inline-block", textAlign: "center" }}>
      <AnimatePresence mode="sync" initial={false}>
        <motion.span
          key={sequence[currentIndex]}
          initial={{ y: direction * 50 + "%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: -direction * 50 + "%", opacity: 0 }}
          transition={{ type: "tween", duration: speed / 500 }}
          style={{ position: "absolute", width: "100%", left: 0 }}
        >
          {sequence[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function AnimatedNumber({ value }) {
  const digits = value.toString().split("");
  const prevDigitsRef = useRef(digits);
  const lastChangeTimeRef = useRef(Date.now());
  const [speed, setSpeed] = useState(150);

  const maxLen = Math.max(prevDigitsRef.current.length, digits.length);
  const prevDigits = [...prevDigitsRef.current];
  while (prevDigits.length < maxLen) prevDigits.unshift("0");
  while (digits.length < maxLen) digits.unshift("0");

  useEffect(() => {
    const now = Date.now();
    const delta = now - lastChangeTimeRef.current;
    lastChangeTimeRef.current = now;

    const newSpeed = Math.min(300, Math.max(50, delta / 2));
    setSpeed(newSpeed);

    prevDigitsRef.current = digits;
  }, [digits]);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "0.1em", fontSize: "72px", fontFamily: "monospace" }}>
      {digits.map((digit, i) => (
        <RollingDigit key={i} prevDigit={parseInt(prevDigits[i])} digit={parseInt(digit)} speed={speed} />
      ))}
    </div>
  );
}

export default function TEST() {
  const [number, setNumber] = useState(0);

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <input
        type="range"
        min={0}
        max={100}
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value))}
        style={{ width: "300px", marginBottom: "40px" }}
      />
      <AnimatedNumber value={number} />
    </div>
  );
}

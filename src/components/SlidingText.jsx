import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function SlidingText({ inputs }) {
  const max = inputs.length;
  const [current, setCurrent] = useState(0);
  const [width, setWidth] = useState(0);
    const spanRef = useRef(null)
    
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1 >= max ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [max]);

  useEffect(()=>{
    if(spanRef.current) {
        setWidth(spanRef.current.offsetWidth)
        console.log(spanRef.current.offsetWidth)
    }
  },[current])

  return (
    <AnimatePresence mode="wait" >
      <motion.span
        key={inputs[current]}
        initial={{ filter:"blur(2px)", opacity: 0, y: 25, width:width}}
        animate={{ filter:"blur(0px)",opacity: 1, y: 0,width:'fit-content'}}
        exit={{ filter:"blur(2px)", opacity: 0, y: -25}}
        transition={{ type:"spring", damping:10 }}
        ref={spanRef}
        style={{
          display: "inline-block",
          background:"linear-gradient(to right, rgb(131, 25, 244), rgb(43, 156, 255))",
          backgroundClip:"text",
          color:"transparent"
        }}
      >
        {inputs[current]}
      </motion.span>
    </AnimatePresence>
  );
}

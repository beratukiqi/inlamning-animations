import { useEffect, useRef, useState } from "react";
import { cubicBezier, motion } from "framer-motion";

const easing = cubicBezier(0.04, 0.19, 0.18, 1.05);

interface CTAButtonProps {
  onClick: () => void; // Define the onClick prop function type
  title: string;
}

const CTAButton = ({ onClick, title }: CTAButtonProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement>(null);
  const [cursorVariant, setCursorVariant] = useState("default");

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    let animationFrameId: number;

    const mouseMove = (e: any) => {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      });
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      transition: { duration: 0.6, ease: easing },
    },
    text: {
      height: 100,
      width: 100,
      x: mousePosition.x - 50,
      y: mousePosition.y - 50,
      backgroundColor: "#15304b",
      transition: { duration: 0.4, ease: easing },
    },
  };

  const textEnter = () => setCursorVariant("text");
  const textLeave = () => setCursorVariant("default");

  const mouseLeave = () => {
    setPosition({ x: 0, y: 0 }); // Reset position to center when the mouse leaves 'inner'
    textLeave(); // Also reset the cursor variant when leaving 'inner'
  };

  const mouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (ref.current) {
      const boundingRect = ref.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Calculate the mouse position relative to the inner element
      const x = mouseX - boundingRect.left - boundingRect.width / 2;
      const y = mouseY - boundingRect.top - boundingRect.height / 2;

      // Update the label position
      setPosition({ x, y });

      // Check if the mouse is outside the inner element
      const isOutside =
        mouseX < boundingRect.left ||
        mouseX > boundingRect.right ||
        mouseY < boundingRect.top ||
        mouseY > boundingRect.bottom;

      if (isOutside) {
        // If outside, reset the label position and cursor variant
        setPosition({ x: 0, y: 0 });
        setCursorVariant("default");
      } else {
        // If inside, update the cursor variant to 'text'
        setCursorVariant("text");
      }
    }
  };

  const { x, y } = position;

  return (
    <motion.span className="outer">
      <motion.div
        variants={variants}
        animate={cursorVariant}
        transition={{ duration: 0.4, ease: easing }}
        className="cursor"
      ></motion.div>
      <motion.span className="wrapper">
        <motion.span
          className="inner"
          ref={ref}
          onMouseLeave={mouseLeave}
          whileHover={{
            border: "1px solid rgba(255, 255, 255, 0)",
            transition: { duration: 0.15, ease: easing },
            cursor: "pointer",
          }}
        >
          <motion.span
            className="inner-label"
            animate={{ x: position.x, y: position.y }}
            onMouseMove={mouseMove}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 15,
              duration: 0.3,
            }}
            whileHover={{
              color: "#fff",
              transition: { duration: 0.05 },
            }}
            onClick={onClick}
          >
            {title}
          </motion.span>
        </motion.span>
      </motion.span>
    </motion.span>
  );
};

export default CTAButton;

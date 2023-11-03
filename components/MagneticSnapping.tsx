import { motion } from "framer-motion";
import { ReactNode, useRef, useState } from "react";

interface MagneticSnappingProps {
  children: ReactNode;
  style?: any;
  className?: string;
}

const MagneticSnapping: React.FC<MagneticSnappingProps> = ({
  children,
  style,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const mouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const { clientX, clientY } = e;
      const { width, height, left, top } = ref.current.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      setPosition({ x, y });
    }
  };

  const mouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.span
      className={className ? className : ""}
      style={style}
      onMouseMove={mouseMove}
      onMouseLeave={mouseLeave}
      animate={{ x, y }}
      ref={ref}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.span>
  );
};

export default MagneticSnapping;

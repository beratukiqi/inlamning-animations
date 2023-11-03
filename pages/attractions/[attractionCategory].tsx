import {
  AnimatePresence,
  animate,
  cubicBezier,
  m,
  motion,
} from "framer-motion";
import { useRouter } from "next/router";
import { sidebarItems } from "@/helpers/sidebarItems";
import CategorySidebar from "@/components/categorySidebar";
import AttractionCard from "@/components/attractionCard";
import MagneticSnapping from "@/components/MagneticSnapping";
import { useEffect, useRef, useState } from "react";
import CTAButton from "@/components/CTAButton";

const AttractionCategory = () => {
  const router = useRouter();
  const { attractionCategory } = router.query;
  const [modalOpen, setModalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement>(null);
  const [cursorVariant, setCursorVariant] = useState("default");
  const easing = cubicBezier(0.04, 0.19, 0.18, 1.05);

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

  const attractionTitle = attractionCategory?.toString().replaceAll("-", " ");

  const categoryIcon = sidebarItems.find(
    (item) => item.name === attractionTitle
  )?.icon;

  const chosenAttraction = sidebarItems.find(
    (item) => item.name === attractionTitle
  );

  const pageTransition = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: easing,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.4,
        ease: easing,
      },
    },
  };

  return (
    <main>
      <motion.div
        variants={variants}
        animate={cursorVariant}
        transition={{ duration: 0.4, ease: easing }}
        className="cursor"
      ></motion.div>
      <div className="article-wrapper">
        <CategorySidebar />
        <AnimatePresence mode="wait">
          <motion.section
            key={attractionTitle}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
            className="article-container"
          >
            <section className="hero-small">
              <article>
                <motion.div initial="hidden" animate="visible">
                  <div
                    className="category-hero-icon"
                    dangerouslySetInnerHTML={{ __html: categoryIcon || "" }}
                  ></div>

                  <div>
                    <h1>
                      {attractionTitle === "Alla"
                        ? "Upptäck alla våra attraktioner"
                        : `Upplev ${attractionTitle}`}
                    </h1>

                    <p>
                      Här hittar du allt om vår attraktion {attractionTitle} och
                      hur du kan maximera din upplevelse.
                    </p>
                  </div>
                </motion.div>
              </article>
            </section>

            <section className="grid">
              {attractionTitle === "Alla" ? (
                sidebarItems.slice(1).map((category: any, i) => (
                  <AttractionCard
                    chosenAttraction={category}
                    key={category.name + i}
                    variant={{
                      initial: { opacity: 0, x: -10 },
                      animate: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.2, delay: i * 0.1 },
                      },
                      exit: { opacity: 0, x: -10 },
                    }}
                  />
                ))
              ) : (
                <>
                  {chosenAttraction && (
                    <AttractionCard noBg chosenAttraction={chosenAttraction} />
                  )}
                </>
              )}
            </section>
            <AnimatePresence>
              {modalOpen && (
                <motion.section
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  className="modal"
                  onClick={() => setModalOpen(false)}
                >
                  <motion.article
                    animate={{ y: 0 }}
                    initial={{ y: 100 }}
                    exit={{ y: 30, opacity: 0, transition: { duration: 0.2 } }}
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <header className="modal-header">
                      <h2>Boka {chosenAttraction?.name} nu!</h2>
                    </header>
                    <section className="modal-body">
                      <p>Kostnad 59:- / åktur</p>
                      <button>Boka</button>
                    </section>
                  </motion.article>
                </motion.section>
              )}
            </AnimatePresence>
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default AttractionCategory;

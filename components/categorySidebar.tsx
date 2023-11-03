import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { sidebarItems } from "@/helpers/sidebarItems";
import MagneticSnapping from "./MagneticSnapping";

const CategorySidebar = ({ isOpen }: { isOpen?: boolean }) => {
  const router = useRouter();
  const { attractionCategory } = router.query;
  const [categories, setCategories] = useState<any[]>([]);
  const attractionTitle = attractionCategory?.toString().replaceAll("-", " ");
  const [toggleSidebar, setToggleSidebar] = useState(isOpen || false);
  const MotionLink = motion(Link);

  const itemVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };

  return (
    <>
      {sidebarItems && (
        <motion.div
          className="category-sidebar"
          animate={{
            width: toggleSidebar ? "15rem" : "5rem",
          }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
          <motion.div className="toggle">
            <motion.svg
              onClick={() => setToggleSidebar(!toggleSidebar)}
              animate={{
                transform: toggleSidebar ? "rotate(90deg)" : "rotate(-90deg)",
              }}
              transition={{ duration: 0.27, ease: "easeInOut" }}
              width="313"
              height="250"
              viewBox="0 0 313 250"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M167.649 244.367C160.1 251.878 147.84 251.878 140.291 244.367L43.6619 148.224C36.1127 140.713 36.1127 128.515 43.6619 121.004C51.211 113.493 63.4708 113.493 71.0199 121.004L154 203.566L236.98 121.064C244.529 113.553 256.789 113.553 264.338 121.064C271.887 128.575 271.887 140.773 264.338 148.284L167.709 244.427L167.649 244.367ZM264.278 32.8536L167.649 128.996C160.1 136.507 147.84 136.507 140.291 128.996L43.6619 32.8536C36.1127 25.3425 36.1127 13.1445 43.6619 5.63334C51.211 -1.87778 63.4708 -1.87778 71.0199 5.63334L154 88.1955L236.98 5.69343C244.529 -1.81769 256.789 -1.81769 264.338 5.69343C271.887 13.2045 271.887 25.4026 264.338 32.9137L264.278 32.8536Z"
                fill="#15304B"
              />
            </motion.svg>
          </motion.div>

          <motion.ul>
            {sidebarItems.map((category: any, i) => (
              <motion.li key={category.name + i}>
                <MotionLink
                  className={attractionTitle === category.name ? "active" : ""}
                  href={`/attractions/${category.name}`}
                >
                  <MagneticSnapping>
                    <div
                      dangerouslySetInnerHTML={{ __html: category.icon }}
                    ></div>
                  </MagneticSnapping>

                  <AnimatePresence initial={false}>
                    {toggleSidebar && (
                      <motion.p key={category.name}>{category.name}</motion.p>
                    )}
                  </AnimatePresence>
                </MotionLink>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </>
  );
};

export default CategorySidebar;

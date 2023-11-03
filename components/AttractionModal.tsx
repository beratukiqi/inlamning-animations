import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CTAButton from "./CTAButton";

interface AttractionModalProps {
  isOpen: boolean;
  closeModal: () => void;
  attraction: {
    name?: string;
  };
}

const AttractionModal = ({
  isOpen,
  closeModal,
  attraction,
}: AttractionModalProps) => {
  const containerVariants = {
    hidden: {
      y: 100,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          animate={{ opacity: 1, transition: { duration: 0.2 } }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="modal"
          onClick={closeModal}
        >
          <motion.article
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.header className="modal-header" variants={childVariants}>
              <h2>Boka {attraction.name} nu!</h2>
            </motion.header>
            <motion.section className="modal-body" variants={childVariants}>
              <p>Kostnad 59:- / åktur</p>
            </motion.section>
            <CTAButton title="Köp" onClick={closeModal} />
          </motion.article>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default AttractionModal;

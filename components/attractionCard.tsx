// AttractionCard.tsx (modified to use AttractionModal)
import React, { useState } from "react";
import { motion } from "framer-motion";
import AttractionModal from "./AttractionModal";

interface Attraction {
  image?: string;
  name?: string;
  description?: string;
  icon?: string;
}

interface AttractionCardProps {
  chosenAttraction: Attraction;
  noBg?: boolean;
  variant?: any;
}

const AttractionCard = ({
  chosenAttraction,
  noBg,
  variant,
}: AttractionCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {chosenAttraction && (
        <motion.section
          variants={variant}
          animate="animate"
          initial="initial"
          className="article-card"
          style={noBg ? { maxWidth: "400px" } : undefined}
        >
          <img src={chosenAttraction.image} alt={chosenAttraction.name} />
          <h2>{chosenAttraction.name}</h2>
          <p>{chosenAttraction.description}</p>
          <button onClick={() => setModalOpen(true)} className="button">
            <span className="button-content">Köp biljett</span>
          </button>
        </motion.section>
      )}

      <AttractionModal
        isOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        attraction={chosenAttraction}
      />
    </>
  );
};

export default AttractionCard;

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const TooltipButton = ({inputBTN , Data}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="cursor-pointer w-fit flex items-end"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onClick={() => setIsTooltipVisible(!isTooltipVisible)}
      >
        {inputBTN}
      </button>

      <AnimatePresence>
        {isTooltipVisible && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-10 px-3 py-2 text-sm font-medium text-black bg-[#E8E4D9] rounded-lg shadow-sm whitespace-nowrap"
            style={{
              top: "100%",
              right: 3,
              marginTop: "0.5rem",
            }}
          >
            <div className="flex flex-col justify-center items-center gap-2 font-semibold">
                <span>{new Date(Data.startDate).toLocaleDateString()}</span>
                to
                <span>{new Date(Data.endDate).toLocaleDateString()}</span>
                <span className="bg-[#776b4b] w-full h-[1px] my-1"></span>
                <span>Guests: {Data.guests}</span>
            </div>
            <motion.div
              className="absolute w-2 h-2 bg-[#E8E4D9] transform rotate-45 -top-1 right-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TooltipButton;
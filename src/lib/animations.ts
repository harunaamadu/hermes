import { Variants } from "framer-motion";

export const containerVariants:Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut", staggerChildren: 0.14 },
  },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2, ease: "easeIn" } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};
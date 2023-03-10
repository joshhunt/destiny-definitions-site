import React from "react";
import s from "./styles.module.scss";

interface SectionHeadingProps {
  children: React.ReactNode;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ children }) => {
  return <h2 className={s.sectionHeading}>{children}</h2>;
};

export default SectionHeading;

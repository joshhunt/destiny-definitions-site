import React from "react";
import s from "./styles.module.scss";
import { upperFirst } from "lodash";

interface WeaponHeadingProps {
  children: React.ReactNode;
}

const WeaponHeading: React.FC<WeaponHeadingProps> = ({ children }) => {
  let heading = children;

  if (typeof heading === "string") {
    heading = upperFirst(heading.toLowerCase());
  }

  return <h5 className={s.heading}>{heading}</h5>;
};

export default WeaponHeading;

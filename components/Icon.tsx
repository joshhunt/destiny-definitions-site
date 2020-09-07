import React from "react";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  solid?: boolean;
  regular?: boolean;
  light?: boolean;
  duotone?: boolean;
  brand?: boolean;
  spin?: boolean;
}

const Icon: React.FC<IconProps> = ({
  name,
  solid,
  regular,
  light,
  duotone,
  brand,
  spin,
  className,
  ...rest
}) => {
  const prefix =
    {
      [solid ? "true" : "false"]: "fas",
      [regular ? "true" : "false"]: "far",
      [light ? "true" : "false"]: "fal",
      [duotone ? "true" : "false"]: "fad",
      [brand ? "true" : "false"]: "fab",
    }["true"] || "far";

  return (
    <span>
      <span
        className={`${prefix} fa-${name} ${className || ""} ${
          spin ? "fa-spin" : ""
        }`}
        {...rest}
      ></span>
    </span>
  );
};

export default Icon;

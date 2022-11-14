import React from "react";

export interface InterposeProps {
  node: React.ReactNode;
}

const Interpose: React.FC<InterposeProps> = (props) => {
  const { children, node } = props;

  const filtered: React.ReactNode[] = React.Children.toArray(
    children
  ).filter((c) => React.isValidElement(c));

  return (
    <>
      {filtered.map((child, i, arr) => {
        const key = `Interpose_${i}`;

        if (i === arr.length - 1) {
          return <React.Fragment key={key}>{child}</React.Fragment>;
        }

        return (
          <React.Fragment key={key}>
            {child}
            {node}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default Interpose;

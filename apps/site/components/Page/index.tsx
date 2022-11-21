import React from "react";
import SiteHeader from "../SiteHeader";

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
};

export default Page;

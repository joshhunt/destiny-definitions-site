import SiteHeader from "../SiteHeader";

const Page: React.FC = ({ children }) => {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
};

export default Page;

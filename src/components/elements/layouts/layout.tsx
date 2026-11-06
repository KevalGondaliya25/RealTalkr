import navigation from "@/config/navigation.json";

// Components
import Header12 from "@/components/elements/header/header12";
import Footer1 from "@/components/elements/footer/footer1";
import ScrollSmootherComponent from "@/components/tools/scroll-smoother";
import ToolsComponent from "@/components/tools";
import ScrollTop from "@/components/tools/scroll-top";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="colasta-bold root-layout" theme-setting="style-12">
      <ScrollSmootherComponent />
      <ToolsComponent />
      <div className="hidden md:block">
        <ScrollTop />
      </div>
      <Header12 headerNav={navigation.header} />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="bg-[#FCFBF7]">{children}</div>
          <Footer1 footerNav={navigation.footer1} />
        </div>
      </div>
    </div>
  );
};

export default Layout;

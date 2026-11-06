import navigation from "@/config/navigation.json";

// Components
import Header1 from "@/components/elements/header/header1";
import Footer1 from "@/components/elements/footer/footer1";
import ScrollSmootherComponent from "@/components/tools/scroll-smoother";
import ToolsComponent from "@/components/tools";
import ScrollTop from "@/components/tools/scroll-top";
import Header12 from "@/components/elements/header/header12";

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="bg-white colasta-bold">
            <ScrollSmootherComponent />
            <ToolsComponent />
            <div className="hidden md:block">
                <ScrollTop />
            </div>
            <Header12 headerNav={navigation.header} className="!bg-white" />
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <div className="absolute w-full h-[1100px] top-0 start-0 -z-[1]" />
                    <div className="pt-[94px]">{children}</div>
                    <Footer1 footerNav={navigation.footer1} />
                </div>
            </div>
        </div>
    );
};

export default Layout;

import MainContact from "@/components/elements/contact/main-contact";

// Components
import SeoData from "@/components/tools/seo-data";

export default function Page() {
  return (
    <main>
      <SeoData
        title="Contact page"
        meta_title="Contact page"
        description="Contact page description"
      />
      <MainContact />
    </main>
  );
}

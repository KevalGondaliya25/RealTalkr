import { getMainPage } from "@/lib/helper/contentConverter";

// Components
import MainFAQ from "@/components/elements/faq/main-faq";
import SeoData from "@/components/tools/seo-data";

export default function Page() {
  const faq = getMainPage("/faqs/faq1.mdx");

  const { meta_title, meta_description } = faq.data.meta || {};

  return (
    <main>
      <SeoData
        title={faq.data.title || "FAQ page"}
        meta_title={meta_title || "FAQ page"}
        description={meta_description || "FAQ page description"}
      />
      <MainFAQ faq={faq} />
    </main>
  );
}

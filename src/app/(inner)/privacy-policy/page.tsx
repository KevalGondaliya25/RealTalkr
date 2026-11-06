import { getMainPage } from "@/lib/helper/contentConverter";

// Components
import SeoData from "@/components/tools/seo-data";
import PrivacyPolicy1 from "@/components/elements/privacy-policy/privacy-policy1";

export default function Page() {
  const privacy = getMainPage("/privacy-policies/privacy-policy1.mdx");

  const { meta_title, meta_description } = privacy.data.meta || {};
  return (
    <main>
      <SeoData
        title={privacy.data.title || "Privacy & Policy page"}
        meta_title={meta_title || "Privacy & Policy page"}
        description={meta_description || "Privacy & Policy page description"}
      />
      <PrivacyPolicy1 privacy={privacy} />
    </main>
  );
}

import { getAllPages, getMainPage } from "@/lib/helper/contentConverter";

// Components
import SeoData from "@/components/tools/seo-data";
import CTA3 from "@/components/elements/cta/cta3";
import FAQ1 from "@/components/elements/faq/faq1";
import IntegrationHero from "@/components/elements/integration/integration-hero";
import MainIntegration from "@/components/elements/integration/main-integration";

export default function Page() {
  const hero = getMainPage("/integrations/hero-integration.mdx");
  const integration = getMainPage("/integrations/main/_index.mdx");
  const integrations = getAllPages("/integrations/main");
  const faq = getMainPage("/faqs/faq1.mdx");
  const cta = getMainPage("/ctas/cta3.mdx");

  const { meta_title, meta_description } = hero.data.meta || {};

  return (
    <main>
      <SeoData
        title={hero.data.title || "Integration page"}
        meta_title={meta_title || "Integration page"}
        description={meta_description || "Integration page description"}
      />
      <IntegrationHero hero={hero} />
      <MainIntegration integration={integration} integrations={integrations} />
      <FAQ1 faq={faq} />
      <CTA3 cta={cta} />
    </main>
  );
}

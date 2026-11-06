import { getMainPage } from "@/lib/helper/contentConverter";

// Components
import SeoData from "@/components/tools/seo-data";
import MarketingAbout from "@/components/elements/about/marketing-about";
import MarketingCounter from "@/components/elements/counter/marketing-counter";
import MarketingFAQ from "@/components/elements/faq/marketing-faq";
import MarketingFeature from "@/components/elements/feature/marketing-feature";
import MarketingFeature2 from "@/components/elements/feature/marketing-feature2";
import MarketingHero from "@/components/elements/hero/marketing-hero";
import MarketingIntegration from "@/components/elements/integration/marketing-integration";
import MarketingPricing from "@/components/elements/pricing/marketing-pricing";
import MarketingTestimonial from "@/components/elements/testimonial/marketing-testimonial";
import Layout from "@/components/elements/layouts/layout";
import { VapiProvider } from "@/components/component/Button/VapiButtonContext";

export default function page() {
  const hero = getMainPage("/heros/marketing-hero.mdx");
  const about = getMainPage("/abouts/marketing-about.mdx");
  const counter = getMainPage("/counters/marketing-counter.mdx");
  const feature = getMainPage("/features/marketing-feature.mdx");
  const faq = getMainPage("/faqs/marketing-faq.mdx");
  const testimonial = getMainPage("/testimonials/marketing-testimonial.mdx");
  const feature2 = getMainPage("/features/marketing-feature2.mdx");
  const integration = getMainPage("/integrations/marketing-integration.mdx");
  const pricing = getMainPage("/pricings/marketing-pricing.mdx");

  return (
    <Layout>
      <main className="bg-btn-bg-hover">
        <VapiProvider>
          <SeoData />
          <MarketingHero hero={hero} />
          <MarketingAbout about={about} />
          <MarketingCounter counter={counter} />
          <MarketingFeature feature={feature} />
          <MarketingFAQ faq={faq} />
          {/* <MarketingTestimonial testimonial={testimonial} /> */}
          <MarketingFeature2 feature={feature2} />
          {/* <MarketingIntegration integration={integration} /> */}
          {/* <MarketingPricing pricing={pricing} /> */}
        </VapiProvider>
      </main>
    </Layout>
  );
}

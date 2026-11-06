import { getMainPage } from "@/lib/helper/contentConverter";

// Components
import SeoData from "@/components/tools/seo-data";
import FAQ1 from "@/components/elements/faq/faq1";
import NewsLetter1 from "@/components/elements/newsletter/newsletter1";
import BookingPricing from "@/components/elements/pricing/booking-pricing";

export default function Page() {
  const pricing = getMainPage("/pricings/booking-pricing.mdx");
  const faq = getMainPage("/faqs/faq1.mdx");

  const { meta_title, meta_description } = pricing.data.meta || {};

  return (
    <main>
      <SeoData
        title={pricing.data.title || "Pricing page"}
        meta_title={meta_title || "Pricing page"}
        description={meta_description || "Pricing page description"}
      />
      <BookingPricing
        pricing={pricing}
        inner
        className="relative pt-[5px] md:pt-[35px] xl:pt-[65px] 2xl:pt-[135px] sec_space_bottom1"
      />
      <FAQ1 faq={faq} />
      <NewsLetter1 />
    </main>
  );
}

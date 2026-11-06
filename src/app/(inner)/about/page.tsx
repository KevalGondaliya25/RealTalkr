import { getAllPages, getMainPage } from "@/lib/helper/contentConverter";

// Components
import SeoData from "@/components/tools/seo-data";
import MainAbout from "@/components/elements/about/main-about";
import AllTeam from "@/components/elements/all-team";
import Award1 from "@/components/elements/award/award1";
import Brand1 from "@/components/elements/brand/brand1";
import Counter1 from "@/components/elements/counter/counter1";
import CTA2 from "@/components/elements/cta/cta2";
import BookingService from "@/components/elements/service/booking-service";
import BookingTestimonial from "@/components/elements/testimonial/booking-testimonial";

export default function Page() {
  const about = getMainPage("/abouts/main-about.mdx");
  const award = getMainPage("/awards/award1.mdx");
  const counter = getMainPage("/counters/counter1.mdx");
  const testimonial = getMainPage("/testimonials/booking-testimonial.mdx");
  const service = getMainPage("/services/booking/_index.mdx");
  const services = getAllPages("/services/booking");
  const team = getMainPage("/teams/team.mdx");
  const brand = getMainPage("/brands/brand1.mdx");
  const cta = getMainPage("/ctas/cta2.mdx");

  const { meta_title, meta_description } = about.data.meta || {};
  return (
    <main>
      <SeoData
        title={about.data.title || "About page"}
        meta_title={meta_title || "About page"}
        description={meta_description || "About page description"}
      />
      <MainAbout about={about} />
      <Award1 award={award} />
      <Counter1 counter={counter} />
      <BookingTestimonial testimonial={testimonial} />
      <BookingService
        service={service}
        services={services}
        className="sec_space_bottom"
      />
      <AllTeam team={team} sliceItem={4} />
      <Brand1 brand={brand} />
      <CTA2 cta={cta} />
    </main>
  );
}

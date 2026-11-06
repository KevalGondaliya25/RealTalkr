import { notFound } from "next/navigation";
import { getAllPages, getMainPage } from "@/lib/helper/contentConverter";

// Components
import SeoData from "@/components/tools/seo-data";
import FAQ1 from "@/components/elements/faq/faq1";
import IntegrationDetails from "@/components/elements/integration/integration-details";
import MainIntegration from "@/components/elements/integration/main-integration";
import NewsLetter1 from "@/components/elements/newsletter/newsletter1";
import MDXContent from "@/components/tools/mdx-content";

type Props = {
  params: {
    title: string;
  };
};

export const generateStaticParams = () => {
  const integrations = getAllPages("/integrations/main");
  const paths = integrations.map((program) => ({
    title: program.slug,
  }));

  return paths;
};

export default function Page({ params }: Props) {
  const integrations = getAllPages("/integrations/main");
  const integrationContent = getMainPage("/integrations/main/_index.mdx");
  const faq = getMainPage("/faqs/faq1.mdx");

  if (!(integrations && integrations.length)) {
    notFound();
  }
  const integration = integrations.find((item) => item.slug === params.title);
  const related = integrations
    .filter((item) => item.slug !== params.title)
    .slice(0, 5);

  if (!(integration && integration.data)) {
    notFound();
  }

  const { meta_title, meta_description } = integration.data.meta || {};

  return (
    <main>
      <SeoData
        title={integration.data.title || "Integration page"}
        meta_title={meta_title || "Integration page"}
        description={meta_description || "Integration page description"}
      />
      <IntegrationDetails integration={integration}>
        <div className="mt-[29px]">
          <MDXContent content={integration.content} />
        </div>
      </IntegrationDetails>
      <MainIntegration
        integration={integrationContent}
        integrations={related}
        detailsPage
        btnText="Add Integration"
      />
      <FAQ1 faq={faq} />
      <NewsLetter1 />
    </main>
  );
}

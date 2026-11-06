import { getMainPage } from "@/lib/helper/contentConverter";

// Components
import SeoData from "@/components/tools/seo-data";
import AllProject from "@/components/elements/project/all-project";

export default function Page() {
  const project = getMainPage("/projects/booking-project.mdx");

  const { meta_title, meta_description } = project.data.meta || {};

  return (
    <main>
      <SeoData
        title={project.data.title || "Project page"}
        meta_title={meta_title || "Project page"}
        description={meta_description || "Project page description"}
      />
      <AllProject project={project} />
    </main>
  );
}

import { getMainPage } from "@/lib/helper/contentConverter";

// Components
import SeoData from "@/components/tools/seo-data";
import AllTeam from "@/components/elements/all-team";

export default function Page() {
  const team = getMainPage("/teams/team.mdx");

  const { meta_title, meta_description } = team.data.meta || {};

  return (
    <main>
      <SeoData
        title={team.data.title || "Team page"}
        meta_title={meta_title || "Team page"}
        description={meta_description || "Team page description"}
      />
      <AllTeam
        team={team}
        className="pt-[5px] xl:pt-[75px] 2xl:pt-[135px] relative z-[1]"
      />
    </main>
  );
}

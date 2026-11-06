import { getAllPages, getMainPage } from "@/lib/helper/contentConverter";

// Components
import SeoData from "@/components/tools/seo-data";
import MainBlog from "@/components/elements/blog/main-blog";

export default function Page() {
  const blog = getMainPage("/blogs/main/_index.mdx");
  const blogs = getAllPages("/blogs/main");

  const { meta_title, meta_description } = blog.data.meta || {};

  return (
    <main>
      <SeoData
        title={blog.data.title || "Blog page"}
        meta_title={meta_title || "Blog page"}
        description={meta_description || "Blog page description"}
      />
      <MainBlog blog={blog} blogs={blogs} />
    </main>
  );
}

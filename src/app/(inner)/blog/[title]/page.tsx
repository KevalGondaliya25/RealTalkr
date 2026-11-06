import { getAllPages } from "@/lib/helper/contentConverter";
import { notFound } from "next/navigation";

// Components
import BlogDetails from "@/components/elements/blog/blog-details";
import MDXContent from "@/components/tools/mdx-content";
import SeoData from "@/components/tools/seo-data";

type Props = {
  params: {
    title: string;
  };
};

export const generateStaticParams = () => {
  const blogs = getAllPages("/blogs/main");
  const paths = blogs.map((program) => ({
    title: program.slug,
  }));

  return paths;
};

export default function Page({ params }: Props) {
  const blogs = getAllPages("/blogs/main");

  if (!(blogs && blogs.length)) {
    notFound();
  }
  const blog = blogs.find((item) => item.slug === params.title);

  if (!(blog && blog.data)) {
    notFound();
  }

  const { meta_title, meta_description } = blog.data.meta || {};
  return (
    <main>
      <SeoData
        title={blog.data.title || "Integration page"}
        meta_title={meta_title || "Integration page"}
        description={meta_description || "Integration page description"}
      />
      <BlogDetails blog={blog}>
        <div className="blog_details">
          <MDXContent content={blog.content} />
        </div>
      </BlogDetails>
    </main>
  );
}

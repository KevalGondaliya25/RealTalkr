import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import mdx from "./mdx";

const MDXContent = ({ content }: { content: any }) => {
  interface IMdxOptions {
    remarkPlugins?: any[];
    rehypePlugins?: any[];
  }
  const mdxOptions: IMdxOptions = {
    remarkPlugins: [remarkGfm],
  };

  return (
    <>
      {/* @ts-ignore */}
      <MDXRemote source={content} components={mdx} options={{ mdxOptions }} />
    </>
  );
};

export default MDXContent;

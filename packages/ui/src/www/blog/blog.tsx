"use client"
import React, { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { useMDXComponents } from "./mdx-components";
import { MDXRemote } from "next-mdx-remote";
import { getPostData } from "@allyson/lib/posts";

interface MetadataParams {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: MetadataParams) {
  const postData = await getPostData(params.slug);
  const { title, description, keywords, image } = postData;
  
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      siteName: "Allyson",
      description: description,
      url: `https://allyson.ai/blog/${params.slug}`,
      images: [`https://allyson.ai${image}`],
    },
    keywords: keywords,
  };
}

interface BlogProps {
  params: {
    slug: string;
  };
}

export default function Blog({ params }: BlogProps) {
  const components = useMDXComponents({});
  const [mdxSource, setMdxSource] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      const postData = await getPostData(params.slug);
      setMdxSource(postData.mdxSource);
    };

    fetchPostData();
  }, [params.slug]);

  return (
    <>
      <div className="mt-20">
        <MDXProvider components={components}>
          {mdxSource && <MDXRemote {...mdxSource} />}
        </MDXProvider>
      </div>
    </>
  );
}

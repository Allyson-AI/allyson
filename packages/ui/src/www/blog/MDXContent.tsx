import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import components from '@allyson/ui/web/blog/mdx-components';

export default function MDXContent({ source }) {
  return <MDXRemote {...source} components={components} />;
}
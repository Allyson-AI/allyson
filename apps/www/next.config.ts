import withMDX from '@next/mdx';

const config = withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
});

export default config;
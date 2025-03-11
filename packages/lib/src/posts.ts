import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/posts');

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map(fileName => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      ...data,
    };
  });
}

export async function getPostData(slug) {
  if (!slug) {
    throw new Error('Slug is undefined');
  }

  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Remove import statements
  const contentWithoutImports = content.replace(/^import\s+.*from\s+.*;$/gm, '').trim();

  return {
    slug,
    content: contentWithoutImports,
    ...data,
  };
}

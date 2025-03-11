"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

interface BlogListProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
}

export default function BlogList({ posts, currentPage, totalPages }: BlogListProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/blog?page=${newPage}`);
  };
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {posts.map(({ slug, title, image }, i) => (
          <Link key={i} href={`/blog/${slug}`} passHref>
            <div
              className={`border rounded-lg overflow-hidden shadow-lg cursor-pointer animate-fade-in opacity-0 [--animation-delay:600ms]`}
            >
              <img
                src={`https://allyson-blog.nyc3.cdn.digitaloceanspaces.com${image}`}
                alt={title}
                className="w-full h-full object-cover"
              />
              {/* <div className="p-4">
                <h4 className="text-xl md:text-2xl font-semibold tracking-tighter text-transparent leading-none bg-gradient-to-br from-white from-30% to-white/60 bg-clip-text">
                  {title}
                </h4>
                <p className="text-zinc-300/70 text-sm mt-1">{date}</p>
                <p className=" text-zinc-300/70  mt-2 max-w-md md:max-w-xl truncate">
                  {description}{" "}
                </p>
              </div> */}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 border rounded-lg text-zinc-600/70 font-medium"
          >
            Previous
          </button>
        )}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="ml-4 px-4 py-2 border rounded-lg text-zinc-600/70 font-medium"
          >
            Next
          </button>
        )}
      </div>
    </>
  );
}

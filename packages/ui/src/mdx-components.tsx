// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";

const components = {
  h1: ({ children }) => (
    <h1 className="text-2xl md:text-3xl mt-20 mb-20 font-bold leading-none text-zinc-200 text-center">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl md:text-2xl font-semibold text-zinc-200 mb-4 mt-10">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-medium text-zinc-200 mb-4">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-md font-medium text-zinc-200 mb-4">{children}</h4>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-sm font-semibold text-zinc-400 mb-4">
      {children}
    </a>
  ),
  p: ({ children }) => (
    <p className="text-sm text-zinc-200 mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="text-sm text-zinc-200 mb-4">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-sm text-zinc-200 mb-4">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-200">{children}</strong>
  ),
  img: ({ src, alt }) => (
    <Image
      src={src}
      alt={alt}
      className="w-full h-auto rounded-lg"
      height={1563}
      width={943}
    />
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-sm  text-zinc-200 mb-4">
      {children}
    </ol>
  ),
};

export default components;

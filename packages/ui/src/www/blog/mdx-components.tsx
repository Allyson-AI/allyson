import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';

const components = {
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-5xl mt-20 mb-20 font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#fff] via-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,0.3)] text-center">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-semibold text-zinc-50 mb-4 mt-10">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg md:text-xl font-medium text-zinc-50 mb-4 mt-10">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-medium text-zinc-50 mb-4">{children}</h4>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-base font-semibold text-zinc-300 mb-4">
      {children}
    </a>
  ),
  p: ({ children }) => (
    <p className="text-base text-zinc-400 mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="text-base text-zinc-400 mb-4">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-base text-zinc-400 mb-4">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-400">{children}</strong>
  ),
  img: ({ src, alt }) => (
    <Image src={src} alt={alt} className="w-full h-auto rounded-lg" height={1563} width={943} />
  ),
  DownloadCTA: dynamic(() => import('@allyson/ui/www/download-cta')),
  SignupCTA: dynamic(() => import('@allyson/ui/www/signup-cta')),
};

export default components;

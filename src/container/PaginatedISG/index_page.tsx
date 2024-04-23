'use client';

import React, { useState, useEffect } from "react";

interface PaginatedISGProps {
  initialBlogs: Array<{[key: string]: any}>;
  hasMore: boolean;
}

const URL =
  "https://veme-beta.vercel.app/api/trpc/veme.getHomeVemes?batch=3&input=%7B%220%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%7D";

export async function getStaticProps() {
  const initialBlogs = await fetch(URL).then((res) => res.json());
  console.log(`initialBlogs - `, initialBlogs);
  return {
    props: {
      initialBlogs,
      hasMore: false,
    },
  };
}

const PaginatedISG = ({ initialBlogs, hasMore }: PaginatedISGProps) => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMoreBlogs = async () => {
      setIsLoading(true);
      const newBlogs = await fetch(URL).then((res) => res.json());
      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
      setIsLoading(false);
      hasMore = false;
    };

    const handleScroll = (event: any) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      if (hasMore && !isLoading && scrollTop + clientHeight >= scrollHeight) {
        fetchMoreBlogs();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [blogs, isLoading, hasMore]);

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
        </div>
      ))}
      {isLoading && <p>Loading more blogs...</p>}
      {hasMore && !isLoading && <p>Scroll down to see more!</p>}
    </div>
  );
};

export default PaginatedISG;

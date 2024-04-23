"use client";

import { fetchBlogs } from "@/actions/blogs";
import React, { useState, useEffect } from "react";

const PaginatedISG = () => {
  const [blogs, setBlogs] = useState<Array<{ [ky: string]: any }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchBlogs().then((resp) => {
      setBlogs(() => resp.blogs);
    });

    const fetchMoreBlogs = async () => {
      setIsLoading(true);
      const { blogs, hasMore } = await fetchBlogs();
      setBlogs((prevBlogs) => [...prevBlogs, ...blogs]);
      setIsLoading(false);
      setHasMore(hasMore);
    };

    const handleScroll = (event: any) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      if (hasMore && !isLoading && scrollTop + clientHeight >= scrollHeight) {
        fetchMoreBlogs();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

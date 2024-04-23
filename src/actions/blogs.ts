'use server';

const URL =
  "https://veme-beta.vercel.app/api/trpc/veme.getHomeVemes?batch=3&input=%7B%220%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%7D";

export async function fetchBlogs() {
  const blogs = await fetch(URL, {
    next: { revalidate: 3600, tags: ["blogs"] },
  }).then((res) => res.json());
  return {
    blogs,
    hasMore: blogs[0]?.result?.data?.json?.next_count > 0,
  };
}
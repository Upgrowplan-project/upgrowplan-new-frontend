import { NextResponse } from "next/server";
import { getBlogPosts } from "@/app/blog/getBlogPosts";

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json(posts);
}

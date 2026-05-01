
import Post from "@/models/Post";

export const getAllPosts = async () => {
  try {
    const posts = await Post.find({});
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

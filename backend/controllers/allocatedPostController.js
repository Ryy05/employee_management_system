
import AllocatedPosts from "../models/AllocatedPosts.js";
import Office from "../models/Office.js";
import Post from "../models/Posts.js";

export const getAllocatedPosts = async (req, res) => {
  try {
    const allocations = await AllocatedPosts.find()
      .populate("office", "officeId")  
      .populate("post", "postName");      
    res.json({ allocations });
  } catch (error) {
    res.status(500).json({ message: "Error fetching allocated posts", error: error.message });
  }
};


export const createAllocatedPost = async (req, res) => {
  try {
    const { office, post, totalAllocated, filledPosts } = req.body;

    const officeExists = await Office.findById(office);
    const postExists = await Post.findById(post);

    if (!officeExists) {
      return res.status(400).json({ message: "Invalid office ID provided" });
    }
    if (!postExists) {
      return res.status(400).json({ message: "Invalid post ID provided" });
    }

    if (filledPosts > totalAllocated) {
      return res.status(400).json({ message: "Filled posts cannot exceed total allocated posts" });
    }

    const vacantPosts = totalAllocated - filledPosts;

    const allocation = await AllocatedPosts.create({
      office,
      post,
      totalAllocated,
      filledPosts,
      vacantPosts
    });

    res.status(201).json({ message: "Allocated post created successfully", allocation });
  } catch (error) {
    res.status(500).json({ message: "Error creating allocated post", error: error.message });
  }
};

export const updateAllocatedPost = async (req, res) => {
  try {
    const { totalAllocated, filledPosts } = req.body;

    if (filledPosts > totalAllocated) {
      return res.status(400).json({ message: "Filled posts cannot exceed total allocated posts" });
    }

    const vacantPosts = totalAllocated - filledPosts;

    const updatedAllocation = await AllocatedPosts.findByIdAndUpdate(
      req.params.id,
      { ...req.body, vacantPosts },
      { new: true }
    ).populate("office post");

    if (!updatedAllocation) {
      return res.status(404).json({ message: "Allocated post not found" });
    }

    res.json({ message: "Allocated post updated successfully", updatedAllocation });
  } catch (error) {
    res.status(500).json({ message: "Error updating allocated post", error: error.message });
  }
};

export const deleteAllocatedPost = async (req, res) => {
  try {
    const deletedAllocation = await AllocatedPosts.findByIdAndDelete(req.params.id);

    if (!deletedAllocation) {
      return res.status(404).json({ message: "Allocated post not found" });
    }

    res.json({ message: "Allocated post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting allocated post", error: error.message });
  }
};

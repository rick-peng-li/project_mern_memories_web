import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const IMAGE_SIZE_LIMIT = 2 * 1024 * 1024;
const DISCOVER_LIMIT = 12;
const TIMELINE_POSTS_PER_GROUP = 4;

const getErrorMessage = (error) => error?.message || 'Unexpected server error.';
const toPlainPost = (post) => (typeof post?.toObject === 'function' ? post.toObject() : post);
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeTags = (value) => {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const validatePayload = ({ creator, title, message, selectedFile }) => {
  if (!creator || !title || !message) {
    return 'Creator, title and message are required.';
  }

  if (selectedFile && selectedFile.length > IMAGE_SIZE_LIMIT) {
    return 'Please upload an image smaller than 2MB.';
  }

  return null;
};

const buildPostPayload = (body) => ({
  creator: String(body.creator || '').trim(),
  title: String(body.title || '').trim(),
  message: String(body.message || '').trim(),
  tags: normalizeTags(body.tags),
  selectedFile: String(body.selectedFile || '').trim(),
  bookmarked: Boolean(body.bookmarked),
});

const buildTimeline = (posts) => {
  const groups = posts.reduce((result, post) => {
    const date = new Date(post.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;

    if (!result[key]) {
      result[key] = {
        count: 0,
        key,
        label: date.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        posts: [],
        totalLikes: 0,
      };
    }

    result[key].count += 1;
    result[key].totalLikes += post.likeCount || 0;

    if (result[key].posts.length < TIMELINE_POSTS_PER_GROUP) {
      result[key].posts.push(post);
    }

    return result;
  }, {});

  return Object.values(groups);
};

const buildTagSummary = (posts) => {
  const tagMap = new Map();

  posts.forEach((post) => {
    (post.tags || []).forEach((tag) => {
      const current = tagMap.get(tag) || {
        count: 0,
        latestPostTitle: post.title,
        latestPostId: post._id,
      };

      current.count += 1;
      current.latestPostTitle = post.title;
      current.latestPostId = post._id;
      tagMap.set(tag, current);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, meta]) => ({
      name,
      ...meta,
    }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
};

const buildCreatorSummary = (posts) => {
  const creatorMap = new Map();

  posts.forEach((post) => {
    const key = post.creator;
    const current = creatorMap.get(key) || {
      creator: key,
      latestPostId: post._id,
      latestPostTitle: post.title,
      postCount: 0,
      totalLikes: 0,
    };

    current.postCount += 1;
    current.totalLikes += post.likeCount || 0;
    current.latestPostId = post._id;
    current.latestPostTitle = post.title;
    creatorMap.set(key, current);
  });

  return Array.from(creatorMap.values())
    .sort((left, right) => right.totalLikes - left.totalLikes || right.postCount - left.postCount);
};

export const getPosts = async (req, res) => {
  const { search = '', tag = '' } = req.query;

  try {
    const query = {};

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { message: searchRegex },
        { creator: searchRegex },
      ];
    }

    if (tag.trim()) {
      query.tags = tag.trim();
    }

    const posts = await PostMessage.find(query).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const getDiscoverPosts = async (req, res) => {
  try {
    const posts = await PostMessage.find().sort({ createdAt: -1 }).limit(DISCOVER_LIMIT);
    const normalizedPosts = posts.map(toPlainPost);
    const featured = [...normalizedPosts]
      .sort((left, right) => {
        if ((right.bookmarked ? 1 : 0) !== (left.bookmarked ? 1 : 0)) {
          return (right.bookmarked ? 1 : 0) - (left.bookmarked ? 1 : 0);
        }

        return (right.likeCount || 0) - (left.likeCount || 0);
      })
      .slice(0, 4);
    const trending = [...normalizedPosts]
      .sort((left, right) => (right.likeCount || 0) - (left.likeCount || 0))
      .slice(0, 6);
    const recent = normalizedPosts.slice(0, 6);

    res.status(200).json({
      featured,
      recent,
      trending,
    });
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const getBookmarkedPosts = async (req, res) => {
  try {
    const posts = await PostMessage.find({ bookmarked: true }).sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const getTagsOverview = async (req, res) => {
  try {
    const posts = await PostMessage.find().sort({ createdAt: -1 });
    const normalizedPosts = posts.map(toPlainPost);
    const tags = buildTagSummary(normalizedPosts);

    res.status(200).json({
      tags,
      totalTags: tags.length,
    });
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const getCreatorsOverview = async (req, res) => {
  try {
    const posts = await PostMessage.find().sort({ createdAt: -1 });
    const normalizedPosts = posts.map(toPlainPost);
    const creators = buildCreatorSummary(normalizedPosts);

    res.status(200).json({
      creators,
      totalCreators: creators.length,
    });
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const getTimelineOverview = async (req, res) => {
  try {
    const posts = await PostMessage.find().sort({ createdAt: -1 });
    const normalizedPosts = posts.map(toPlainPost);
    const groups = buildTimeline(normalizedPosts);

    res.status(200).json({
      groups,
      totalGroups: groups.length,
    });
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid post id.' });
  }

  try {
    const post = await PostMessage.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const createPost = async (req, res) => {
  const payload = buildPostPayload(req.body);
  const validationMessage = validatePayload(payload);

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  try {
    const newPost = await PostMessage.create(payload);
    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(409).json({ message: getErrorMessage(error) });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid post id.' });
  }

  const payload = buildPostPayload(req.body);
  const validationMessage = validatePayload(payload);

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(409).json({ message: getErrorMessage(error) });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid post id.' });
  }

  try {
    const deletedPost = await PostMessage.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    return res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid post id.' });
  }

  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(
      id,
      { $inc: { likeCount: 1 } },
      { new: true },
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(409).json({ message: getErrorMessage(error) });
  }
};

export const toggleBookmarkPost = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid post id.' });
  }

  try {
    const post = await PostMessage.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    post.bookmarked = !post.bookmarked;
    await post.save();

    return res.status(200).json(post);
  } catch (error) {
    return res.status(409).json({ message: getErrorMessage(error) });
  }
};

import express from 'express';

import {
  createPost,
  deletePost,
  getBookmarkedPosts,
  getCreatorsOverview,
  getDiscoverPosts,
  getPost,
  getPosts,
  getTagsOverview,
  getTimelineOverview,
  likePost,
  toggleBookmarkPost,
  updatePost,
} from '../controllers/posts.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/discover', getDiscoverPosts);
router.get('/bookmarks', getBookmarkedPosts);
router.get('/tags', getTagsOverview);
router.get('/creators', getCreatorsOverview);
router.get('/timeline', getTimelineOverview);
router.post('/', createPost);
router.patch('/:id/bookmark', toggleBookmarkPost);
router.patch('/:id/like', likePost);
router.get('/:id', getPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;

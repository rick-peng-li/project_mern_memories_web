import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    selectedFile: {
      type: String,
      default: '',
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    bookmarked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;

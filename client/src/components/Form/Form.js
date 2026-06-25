import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';

import { createPost, updatePost } from '../../actions/posts';

const emptyPost = {
  creator: '',
  message: '',
  selectedFile: '',
  tags: [],
  title: '',
};

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState(emptyPost);
  const [tagsInput, setTagsInput] = useState('');
  const [submitError, setSubmitError] = useState('');
  const post = useSelector((state) => state.posts.items.find((item) => item._id === currentId));
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) {
      setPostData(post);
      setTagsInput((post.tags || []).join(', '));
    }
  }, [post]);

  const clear = () => {
    setCurrentId('');
    setPostData(emptyPost);
    setTagsInput('');
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    try {
      const payload = {
        ...postData,
        tags: tagsInput
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (currentId) {
        await dispatch(updatePost(currentId, payload));
      } else {
        await dispatch(createPost(payload));
      }

      clear();
    } catch (error) {
      setSubmitError(error?.response?.data?.message || error.message || 'Unable to save the memory.');
    }
  };

  return (
    <section className="panel panel-form">
      <form autoComplete="off" className="memory-form" noValidate onSubmit={handleSubmit}>
        <div className="panel-heading">
          <h2>{currentId ? 'Edit Memory' : 'Create a Memory'}</h2>
        </div>
        <label className="field">
          <span>Creator</span>
          <input
            name="creator"
            onChange={(event) => setPostData({ ...postData, creator: event.target.value })}
            required
            type="text"
            value={postData.creator}
          />
        </label>
        <label className="field">
          <span>Title</span>
          <input
            name="title"
            onChange={(event) => setPostData({ ...postData, title: event.target.value })}
            required
            type="text"
            value={postData.title}
          />
        </label>
        <label className="field">
          <span>Message</span>
          <textarea
            name="message"
            onChange={(event) => setPostData({ ...postData, message: event.target.value })}
            required
            rows="5"
            value={postData.message}
          />
        </label>
        <label className="field">
          <span>Tags</span>
          <input
            name="tags"
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="travel, life, coding"
            type="text"
            value={tagsInput}
          />
          <small>Use commas to separate tags.</small>
        </label>
        <div className="field">
          <span>Image</span>
          <FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} />
          <small>
            For better performance, use compressed images smaller than 2MB.
          </small>
        </div>
        {submitError ? (
          <p className="form-error">{submitError}</p>
        ) : null}
        <div className="form-actions">
          <button className="button button-primary" type="submit">
            {currentId ? 'Update' : 'Submit'}
          </button>
          <button className="button button-secondary" onClick={clear} type="button">
            Clear
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;

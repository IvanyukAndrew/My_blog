import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, fetchSortPosts, fetchTags } from "../redux/slices/posts";

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  console.log('posts', posts)
  const userData = useSelector(state => state.auth.data)
  const [tabValue, setTabValue] = useState(0)

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  useEffect(() => {
    if (tabValue === 0) {
      dispatch(fetchPosts());
    }
    if (tabValue === 1) {
      dispatch(fetchSortPosts());
    }
    dispatch(fetchTags());
  }, [tabValue]);

  console.log(posts.items.data);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={tabValue}
        aria-label="basic tabs example"
      >
        <Tab onClick={() => setTabValue(0)} label="Нові" />
        <Tab onClick={() => setTabValue(1)} label="Популярні" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items.data).map(
            (obj, index) =>
              isPostsLoading ? (
                <Post key={index} isLoading={true} />
              ) : (
                <Post
                  key={obj._id}
                  id={obj._id}
                  title={obj.title}
                  imageUrl={obj.imageUrl ? `http://localhost:7777${obj.imageUrl}` : ''}
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewCount}
                  commentsCount={3}
                  tags={obj.tags}
                  isEditable={userData?._id === obj.user._id}
                />
              )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock
            items={tags.items.data}
            isLoading={isTagsLoading}
          />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Вася Пупкин",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Это тестовый комментарий",
              },
              {
                user: {
                  fullName: "Иван Иванов",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};

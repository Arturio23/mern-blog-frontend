import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import {
  fetchPosts,
  fetchPostsPopular,
  fetchTags,
} from "../resux/slices/posts";

export const Home = () => {
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  const [activeTab, setActiveTab] = useState(0);

  // Використовуємо об'єкт стану для обох значень
  const [tabInfo, setTabInfo] = useState({
    activeTab: 0,
    sortEnabled: true,
  });
  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  // Викликаємо useEffect, щоб завантажити пости та теги при монтуванні компонента
  useEffect(() => {
    if (tabInfo.sortEnabled) {
      setActiveTab(0);
      dispatch(fetchPosts());
    }
  }, [dispatch, tabInfo.sortEnabled]);

  // Викликаємо useEffect, щоб завантажити популярні пости та теги, коли сортування вимкнене
  useEffect(() => {
    if (!tabInfo.sortEnabled) {
      setActiveTab(1);
      dispatch(fetchPostsPopular());
    }
  }, [dispatch, tabInfo.sortEnabled]);

  const handleTabChange = (event, newValue) => {
    // Оновлюємо стан через функцію setTabInfo
    setTabInfo((prevTabInfo) => ({
      ...prevTabInfo,
      activeTab: newValue,
      sortEnabled: newValue === 0, // Включити сортування для таба "Нові", виключити для "Популярні"
    }));
  };

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={activeTab}
        onChange={handleTabChange}
        aria-label="basic tabs example"
      >
        <Tab label="Нові" />
        <Tab label="Популярні" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {posts.items.map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                _id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl
                    ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}`
                    : ``
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?.userData._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
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

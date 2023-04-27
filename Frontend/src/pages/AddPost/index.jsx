import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import axios from "../../axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectorIsAuth } from "../../redux/slices/auth";

export const AddPost = () => {
  const isAuth = useSelector(selectorIsAuth);
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const inputFileRef = useRef(null);
  const isEditing = Boolean(id);
console.log(tags)
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      formData.append("image", event.target.files[0]);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert("Помилка при загрузці файла");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setText(data.text);
          setTitle(data.title);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(","));
          console.log("tags", data.tags);
        })
        .catch((err) => {
          console.warn(err);
          alert("Не вдалося загрузити ствтью");
        });
    }
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(false);

      const fields = {
        title,
        text,
        tags,
        imageUrl,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert("Невдалося створити стятью");
    }
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введіть текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузити превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />

      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалити
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:7777${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />

      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статі..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Теги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранити" : "Опублікувати"}
        </Button>
        <a href="/">
          <Button size="large">Відміна</Button>
        </a>
      </div>
    </Paper>
  );
};

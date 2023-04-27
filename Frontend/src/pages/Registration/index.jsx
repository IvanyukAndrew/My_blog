import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, selectorIsAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";

export const Registration = () => {
  const isAuth = useSelector(selectorIsAuth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert("Не вдалося зареєструватися!");
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          label="Повне імя"
          {...register("fullName", { required: "Укажіть Фамілію і Ім'я" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          label="E-Mail"
          {...register("email", { required: "Укажіть email" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          label="Пароль"
          {...register("password", { required: "Створіть пароль" })}
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};

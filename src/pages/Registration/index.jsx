import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { fetchRegister, selectIsAuth } from "../../resux/slices/auth";
import { Navigate } from "react-router-dom";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "Vasya Chopey",
      email: "vasya@gmail.com",
      password: "12345678",
    },
    mode: "all",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      alert("Не вдалося зареєструватися");
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    } else {
      alert("Не вдалося зареєструватися");
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
          fullWidth
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "Вкажіть Повне ім'я" })}
          className={styles.field}
          label="Полное имя"
        />
        <TextField
          error={Boolean(errors.email?.message)}
          {...register("email", { required: "Вкажіть пошту" })}
          helperText={errors.email?.message}
          type="email"
          fullWidth
          className={styles.field}
          label="E-Mail"
        />
        <TextField
          fullWidth
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...register("password", { required: "Вкажіть пароль" })}
          className={styles.field}
          label="Пароль"
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

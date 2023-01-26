import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Copyright from "../../components/Copyright.jsx";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useRouter } from "next/router";

const theme = createTheme();

export default function NewUser() {
  const [preview, setPreview] = useState();
  const [file, setFile] = useState();
  const [error, setError] = useState();

  const { data: session, status } = useSession();
  const router = useRouter();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      username: "",
      avatar: "",
    },
  });
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("email", session.user.email);
    formData.append("username", data.username);
    formData.append("avatar", file);

    axios({
      url: "http://localhost:3001/api/v1/account/create",
      method: "post",
      data: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then(() => {
        router.replace("/");
      })
      .catch((error) => {
        console.error(error);
        if (!error.response) setError(`不明なエラーが発生しました`);
        else if (
          error.response.data === "The specified email account already exists"
        )
          setError("すでにアカウントを作成済みです");
      });
  };

  const validationRules = {
    name: {
      required: "ユーザー名を入力してください",
      minLength: { value: 2, message: "2文字以上で入力してください。" },
    },
  };

  //ファイルhandleChange関数
  const handleChangeFile = (newFile) => {
    const { files } = newFile.target;
    const preview = URL.createObjectURL(files[0]);
    setFile(files[0]);
    setPreview(preview);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            サインアップ
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <Typography color="error" sx={{ m: 3 }}>
              {error}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="username"
                control={control}
                rules={validationRules.name}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="ユーザー名"
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="avatar"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ mt: 3, ml: 13 }}
                    >
                      アバターをアップロード
                      <input
                        {...field}
                        type="file"
                        hidden
                        onChange={handleChangeFile}
                        accept="image/*"
                      />
                    </Button>
                  </>
                )}
              />
              <>
                {preview && (
                  <>
                    <Box
                      component="img"
                      sx={{
                        height: 256,
                        width: 256,
                        ml: 9,
                        mt: 3,
                      }}
                      src={preview}
                      alt="preview"
                    />
                  </>
                )}
              </>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                サインアップ
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/" variant="body2">
                    すでにアカウントをお持ちの場合
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

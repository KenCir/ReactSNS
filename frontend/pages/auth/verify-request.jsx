import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Copyright from "../../components/Copyright.jsx";

const theme = createTheme();

export default function VerifyRequest() {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {/* START MAIN */}
        <main>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              認証メールを送信しました
            </Typography>
          </Box>
        </main>
        {/* END MAIN */}
        {/* START FOOTER */}
        <footer>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </footer>
        {/* END FOOTER */}
      </Container>
    </ThemeProvider>
  );
}

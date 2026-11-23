import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login as loginUser, logoutSession, restoreSession } from "./store/authSlice";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { error, status } = useSelector((state) => state.auth);

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await dispatch(loginUser({ username, password }));

    if (loginUser.fulfilled.match(result)) {
      navigate("/home", { replace: true });
    }
  }

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8, display: "grid", gap: 2 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Sign in
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          fullWidth
        />
        <Button type="submit" variant="contained" disabled={status === "loading"}>
          {status === "loading" ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
        </Button>
      </Box>
    </Container>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);

  if (status === "loading") {
    return <CircularProgress sx={{ m: 4 }} />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    dispatch(logoutSession());
    navigate("/login", { replace: true });
  }

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", py: 6 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Welcome, {user.username}
      </Typography>
      <Button onClick={handleLogout} variant="outlined">
        Sign out
      </Button>
    </Container>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

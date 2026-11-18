import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error?.message || "Unable to sign in");
      }

      sessionStorage.setItem("username", body.username);
      navigate("/home", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{ width: "100%", p: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Sign in
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          MEC-SS Assignment 2
        </Typography>
        <Box sx={{ display: "grid", gap: 2 }}>
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
          <Button type="submit" variant="contained" disabled={isSubmitting} size="large">
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");

  if (!username) {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    sessionStorage.removeItem("username");
    navigate("/login", { replace: true });
  }

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", py: 6 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Welcome, {username}
      </Typography>
      <Button onClick={handleLogout} variant="outlined">
        Sign out
      </Button>
    </Container>
  );
}

function App() {
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

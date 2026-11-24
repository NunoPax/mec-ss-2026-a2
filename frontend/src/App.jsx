import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login as loginUser, logoutSession, restoreSession } from "./store/authSlice";
import { createMessage, fetchMessages } from "./store/messagesSlice";

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
      <Button onClick={() => navigate("/messages")} variant="contained" sx={{ mr: 2 }}>
        Messages
      </Button>
      <Button onClick={handleLogout} variant="outlined">
        Sign out
      </Button>
    </Container>
  );
}

function MessagesPage() {
  const dispatch = useDispatch();
  const { user, status: authStatus } = useSelector((state) => state.auth);
  const { items, status, submitStatus, error } = useSelector((state) => state.messages);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(fetchMessages());
    }
  }, [dispatch, user]);

  if (authStatus === "loading") {
    return <CircularProgress sx={{ m: 4 }} />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await dispatch(createMessage(message));

    if (createMessage.fulfilled.match(result)) {
      setMessage("");
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Messages
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2, mb: 4 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          inputProps={{ maxLength: 256 }}
          helperText={`${message.length}/256`}
          multiline
          rows={4}
          required
        />
        <Button type="submit" variant="contained" disabled={submitStatus === "loading"}>
          {submitStatus === "loading" ? <CircularProgress size={24} color="inherit" /> : "Post message"}
        </Button>
      </Box>
      {status === "loading" ? (
        <CircularProgress />
      ) : (
        <List>
          {items.map((item) => (
            <Box key={item.message_id}>
              <ListItem alignItems="flex-start">
                <ListItemText primary={item.message} secondary={item.author} />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      )}
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
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

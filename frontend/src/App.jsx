import { useEffect, useState } from "react";
import {
  Link as RouterLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Alert,
  AppBar,
  Autocomplete,
  Box,
  Button,
  Breadcrumbs,
  CircularProgress,
  Container,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login as loginUser, logoutSession, restoreSession } from "./store/authSlice";
import { fetchBookOptions, searchBooks } from "./store/booksSlice";
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

function AppHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = {
    "/messages": "Messages",
    "/books": "Books",
  }[location.pathname];

  async function handleLogout() {
    await dispatch(logoutSession());
    navigate("/login", { replace: true });
  }

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: "#0b1f3a", color: "#ffffff" }}>
        <Toolbar>
          <Typography component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Magnifique App
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ px: 2, py: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} underline="hover" color="inherit" to="/home">
            Home
          </Link>
          {currentPage && <Typography color="text.primary">{currentPage}</Typography>}
        </Breadcrumbs>
      </Box>
    </>
  );
}

function ProtectedLayout() {
  const { user, status } = useSelector((state) => state.auth);

  if (status === "loading") {
    return <CircularProgress sx={{ m: 4 }} />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", py: 6 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Welcome, {user.username}
      </Typography>
      <Button onClick={() => navigate("/messages")} variant="contained" sx={{ mr: 2 }}>
        Messages
      </Button>
      <Button onClick={() => navigate("/books")} variant="contained" sx={{ mr: 2 }}>
        Books
      </Button>
    </Container>
  );
}

function MessagesPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, status, submitStatus, error } = useSelector((state) => state.messages);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(fetchMessages());
    }
  }, [dispatch, user]);

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

function BooksPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, total, options, status, error } = useSelector((state) => state.books);
  const [filters, setFilters] = useState({
    title: "",
    authors: "",
    category: "",
    keywords: "",
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchBookOptions());
      dispatch(searchBooks({}));
    }
  }, [dispatch, user]);

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(searchBooks(filters));
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Book search
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2, mb: 4 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <Autocomplete
          freeSolo
          options={options.titles}
          inputValue={filters.title}
          onInputChange={(_event, value) => setFilters((current) => ({ ...current, title: value }))}
          renderInput={(params) => <TextField {...params} label="Title" />}
        />
        <Autocomplete
          freeSolo
          options={options.authors}
          inputValue={filters.authors}
          onInputChange={(_event, value) => setFilters((current) => ({ ...current, authors: value }))}
          renderInput={(params) => <TextField {...params} label="Author" />}
        />
        <Autocomplete
          freeSolo
          options={options.categories}
          inputValue={filters.category}
          onInputChange={(_event, value) => setFilters((current) => ({ ...current, category: value }))}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />
        <Autocomplete
          freeSolo
          options={options.keywords}
          inputValue={filters.keywords}
          onInputChange={(_event, value) => setFilters((current) => ({ ...current, keywords: value }))}
          renderInput={(params) => <TextField {...params} label="Keywords" />}
        />
        <Button type="submit" variant="contained" disabled={status === "loading"}>
          {status === "loading" ? <CircularProgress size={24} color="inherit" /> : "Search"}
        </Button>
      </Box>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {total} result{total === 1 ? "" : "s"}
      </Typography>
      {status === "loading" ? (
        <CircularProgress />
      ) : (
        <List>
          {items.map((book) => (
            <Box key={book.book_id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={book.title}
                  secondary={`${book.authors} · ${book.category} · €${book.price}`}
                />
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
      <Route element={<ProtectedLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/books" element={<BooksPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

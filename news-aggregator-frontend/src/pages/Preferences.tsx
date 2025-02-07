import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  OutlinedInput,
  SelectChangeEvent,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Preferences: React.FC = () => {
  const [source, setSource] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSourceChange = (event: SelectChangeEvent) => {
    setSource(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          sources: source ? [source] : [],
          categories: category ? [category] : [],
          authors: author.trim() ? [author.trim()] : [],
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        // Navigate to dashboard with articles
        navigate("/dashboard", {
          state: { articles: result.data.articles },
        });
      } else {
        setError(result.message || "Failed to save preferences");
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
      setError("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Typography variant="h5" gutterBottom>
        News Preferences
      </Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "flex-start",
          mt: 2,
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Source (Optional)</InputLabel>
          <Select
            value={source}
            onChange={handleSourceChange}
            input={<OutlinedInput label="Source (Optional)" />}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="BBC News">BBC News</MenuItem>
            <MenuItem value="CNN">CNN</MenuItem>
            <MenuItem value="ABC News">ABC News</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category (Optional)</InputLabel>
          <Select
            value={category}
            onChange={handleCategoryChange}
            input={<OutlinedInput label="Category (Optional)" />}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="business">Business</MenuItem>
            <MenuItem value="sports">Sports</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Preferred Author (Optional)"
          placeholder="Enter author name (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          sx={{ minWidth: 200 }}
        />

        <Button variant="contained" onClick={handleSave} sx={{ height: 56 }}>
          Save Preferences
        </Button>
      </Box>
    </Paper>
  );
};

export default Preferences;

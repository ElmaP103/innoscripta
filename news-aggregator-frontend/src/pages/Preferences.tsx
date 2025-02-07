import React, { useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Preferences = () => {
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();

  const handleSavePreferences = async () => {
    try {
      localStorage.removeItem("filteredArticles");
      navigate("/dashboard", {
        state: { articles: [], isPreferenceResult: true },
      });

      const preferencesData = {
        sources: source ? [source] : [],
        categories: category ? [category] : [],
        authors: author.trim() ? [author.trim()] : [],
      };

      const response = await fetch(
        "http://localhost:8000/api/user-preferences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(preferencesData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        if (!result.data.articles || result.data.articles.length === 0) {
          navigate("/dashboard", {
            state: {
              articles: [],
              isPreferenceResult: true,
              showNoResults: true,
              message: "No articles found matching your preferences.",
            },
          });
        } else {
          localStorage.setItem(
            "filteredArticles",
            JSON.stringify(result.data.articles)
          );
          navigate("/dashboard", {
            state: { articles: result.data.articles, isPreferenceResult: true },
          });
        }
      } else {
        console.error("Failed to save preferences:", result.message);
        navigate("/dashboard", {
          state: {
            articles: [],
            isPreferenceResult: true,
            showNoResults: true,
            message: "Failed to save preferences",
          },
        });
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
      navigate("/dashboard", {
        state: {
          articles: [],
          isPreferenceResult: true,
          showNoResults: true,
          message: "Failed to save preferences",
        },
      });
    }
  };

  return (
    <Box
      component="form"
      sx={{
        width: "100%",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Source</InputLabel>
          <Select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            label="Source"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="BBC News">BBC News</MenuItem>
            <MenuItem value="CNN">CNN</MenuItem>
            <MenuItem value="ABC News">ABC News</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="business">Business</MenuItem>
            <MenuItem value="sports">Sports</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          sx={{ minWidth: 120 }}
        />

        <Button
          variant="contained"
          size="small"
          onClick={handleSavePreferences}
          sx={{
            textTransform: "none",
            height: 40,
          }}
        >
          Save Preferences
        </Button>
      </Box>
    </Box>
  );
};

export default Preferences;

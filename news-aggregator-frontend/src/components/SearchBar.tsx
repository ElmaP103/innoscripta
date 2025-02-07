import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArticleList from "./ArticleList";

interface SearchBarProps {
  onSearch: (searchParams: {
    term: string;
    category: string;
    source: string;
    date: string;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [articles, setArticles] = useState<{
    current_page: number;
    data: any[];
    total: number;
  }>({
    current_page: 1,
    data: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchArticles = async (pageNumber: number = 1) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(category && { category }),
        ...(source && { source }),
        ...(date && { date }),
        page: pageNumber.toString(),
      });

      const response = await fetch(
        `http://localhost:8000/api/articles/search?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.data) {
          setArticles(data.data);
        } else {
          setError("No results found");
        }
      } else {
        setError("Failed to fetch articles");
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to perform search");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchArticles(newPage);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 2, bgcolor: "background.paper" }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="business">Business</MenuItem>
            <MenuItem value="sports">Sports</MenuItem>
          </TextField>
          <TextField
            select
            label="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All Sources</MenuItem>
            <MenuItem value="BBC News">BBC News</MenuItem>
            <MenuItem value="CNN">CNN</MenuItem>
            <MenuItem value="ABC News">ABC News</MenuItem>
          </TextField>
          <TextField
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ height: 56 }}
          >
            {loading ? <CircularProgress size={24} /> : "Search"}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {articles?.data && articles.data.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <ArticleList articles={articles} onPageChange={handlePageChange} />
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;

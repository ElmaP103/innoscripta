import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Container, Paper } from "@mui/material";
import ArticleList from "../components/ArticleList";
import { PaginatedArticles } from "../types/article";

interface LocationState {
  articles?: PaginatedArticles;
}

const Dashboard = () => {
  const location = useLocation();
  const [articles, setArticles] = useState<PaginatedArticles>({
    current_page: 1,
    data: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchAllArticles = async () => {
    try {
      const response = await fetch(
        "http://localhost:8001/api/articles/filtered",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setArticles(data);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch articles immediately on component mount
  useEffect(() => {
    fetchAllArticles();
  }, []); // Empty dependency array means this runs once on mount

  // Handle articles from preferences or search
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.articles) {
      setArticles(state.articles);
    }
  }, [location]);

  const handlePageChange = (page: number) => {
    // Handle page change if needed
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          {articles.data && articles.data.length > 0 ? (
            <ArticleList articles={articles} onPageChange={handlePageChange} />
          ) : (
            <Box sx={{ textAlign: "center", py: 2 }}>
              {loading ? "Loading articles..." : "No articles found"}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;

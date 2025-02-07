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
      console.log("Fetching articles..."); // Debug log
      const response = await fetch("http://localhost:8000/api/articles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log("Articles response:", data); // Debug log

      if (response.ok) {
        setArticles(data);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Always fetch articles when Dashboard mounts
  useEffect(() => {
    console.log("Dashboard mounted, fetching articles..."); // Debug log
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
          {loading ? (
            <Box sx={{ textAlign: "center", py: 2 }}>Loading articles...</Box>
          ) : articles.data && articles.data.length > 0 ? (
            <ArticleList
              articles={articles}
              onPageChange={(page) => {
                // Handle pagination if needed
              }}
            />
          ) : (
            <Box sx={{ textAlign: "center", py: 2 }}>No articles found</Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;

import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Pagination,
  CardActionArea,
} from "@mui/material";
import { Article, PaginatedArticles } from "../types/article";
import ArticleDetail from "./ArticleDetail";

interface ArticleListProps {
  articles: PaginatedArticles;
  onPageChange: (page: number) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  onPageChange,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    onPageChange(value);
  };

  const handleArticleClick = async (article: Article) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/articles/${article.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setSelectedArticle(result.data.article);
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching article details:", error);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {articles.data.map((article) => (
          <Grid item xs={12} md={6} lg={4} key={article.id}>
            <Card>
              <CardActionArea onClick={() => handleArticleClick(article)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {article.description}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip label={article.source} size="small" color="primary" />
                    <Chip label={article.category} size="small" />
                    {article.author && (
                      <Chip
                        label={article.author}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {new Date(article.published_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography sx={{ mt: 2, textAlign: "right" }}>
        Showing {articles.data.length} of {articles.total} articles
      </Typography>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(articles.total / 10)}
          page={articles.current_page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <ArticleDetail
        article={selectedArticle}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedArticle(null);
        }}
      />
    </>
  );
};

export default ArticleList;

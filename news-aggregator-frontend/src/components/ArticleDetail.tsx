import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Link,
} from "@mui/material";
import { Article } from "../types/article";

interface ArticleDetailProps {
  article: Article | null;
  open: boolean;
  onClose: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  open,
  onClose,
}) => {
  if (!article) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          {article.title}
        </Typography>
        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip label={article.source} size="small" color="primary" />
          <Chip label={article.category} size="small" />
          <Typography variant="caption" color="text.secondary">
            {new Date(article.published_at).toLocaleDateString()}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {article.image_url && (
          <Box sx={{ mb: 2 }}>
            <img
              src={article.image_url}
              alt={article.title}
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />
          </Box>
        )}
        <Typography variant="body1" paragraph>
          {article.description}
        </Typography>
        <Typography variant="body1" paragraph>
          {article.content}
        </Typography>
        {article.author && (
          <Typography variant="subtitle2" color="text.secondary">
            Author: {article.author}
          </Typography>
        )}
        {article.url && (
          <Link href={article.url} target="_blank" rel="noopener noreferrer">
            Read full article
          </Link>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArticleDetail;

import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password is too long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateField = (field: keyof LoginFormData, value: string) => {
    try {
      loginSchema.shape[field].parse(value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError;
        const errorMessage = zodError.errors[0]?.message || `Invalid ${field}`;
        setErrors((prev) => ({
          ...prev,
          [String(field)]: errorMessage,
        }));
      }
    }
  };

  const isFormValid = () => {
    return (
      Object.keys(errors).length === 0 &&
      formData.email.trim() !== "" &&
      formData.password.trim() !== ""
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof LoginFormData;

    setFormData((prev: LoginFormData) => ({
      ...prev,
      [String(field)]: value.trim(),
    }));

    validateField(field, value.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    try {
      const validatedData = loginSchema.parse(formData);
      setLoading(true);

      const response = await fetch("http://localhost:8001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...validatedData,
          remember: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        login(data.token, data.user);
        navigate("/dashboard", { replace: true });
      } else {
        setSubmitError(data.message || "Login failed");
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError;
        const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
        zodError.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LoginFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Login error:", error);
        setSubmitError("Failed to login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper sx={{ p: 4, maxWidth: 400 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;

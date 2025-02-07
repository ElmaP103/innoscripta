import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Define validation schema with custom error messages
const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .refine((val) => val.trim().length > 0, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password is too long"),
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const validateField = (field: keyof SignupFormData, value: string) => {
    try {
      signupSchema.shape[field].parse(value);
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
          [field]: errorMessage,
        }));
      }
    }
  };

  const isFormValid = () => {
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof SignupFormData;

    setFormData((prev: SignupFormData) => ({
      ...prev,
      [String(field)]: value,
    }));

    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    try {
      const validatedData = signupSchema.parse(formData);
      setLoading(true);

      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login", {
          state: { message: "Registration successful. Please login." },
        });
      } else {
        if (data.errors) {
          const serverErrors: Partial<Record<keyof SignupFormData, string>> =
            {};
          Object.entries(data.errors).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              serverErrors[key as keyof SignupFormData] = value[0] as string;
            }
          });
          setErrors(serverErrors);
        } else {
          setSubmitError(data.message || "Registration failed");
        }
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError;
        const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
        zodError.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof SignupFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Signup error:", error);
        setSubmitError("Failed to register");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper sx={{ p: 4, maxWidth: 400 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Sign Up
        </Typography>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
            required
          />
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
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Signup;

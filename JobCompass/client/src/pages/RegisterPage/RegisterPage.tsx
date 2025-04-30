import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { validateForm } from "./validateForm";

type RegisterPageProps = {
  showNotification?: (
    message: string,
    type: "success" | "error" | "info"
  ) => void;
};

function RegisterPage({ showNotification }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    server: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear any error for this field when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(
      "🚀 ~ handleSubmit ~ formData:",
      formData,
      validateForm(formData, setErrors)
    );
    if (!validateForm(formData, setErrors)) {
      return;
    }

    setLoading(true);

    try {
      // Send registration request to server
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/register`, {
        username: formData.username.toLowerCase(),
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      // Show success notification if the function is available
      if (showNotification) {
        showNotification(
          "Registration successful! You can now log in.",
          "success"
        );
      }

      // Redirect to login page on success
      setLoading(false);
      navigate("/signIn");
    } catch (error: any) {
      setLoading(false);

      // Handle server errors
      if (error.response) {
        const { status, data } = error.response;

        if (status === 409) {
          // User already exists
          if (data.field === "username") {
            setErrors({ ...errors, username: "Username already taken" });
          } else if (data.field === "email") {
            setErrors({ ...errors, email: "Email already registered" });
          } else {
            setErrors({
              ...errors,
              server: data.message || "Registration failed",
            });
          }
        } else {
          setErrors({
            ...errors,
            server: "An error occurred during registration",
          });
        }
      } else {
        setErrors({ ...errors, server: "Network error - please try again" });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="page-content">
      <div className="auth-container">
        <h2 className="auth-title">Create an Account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label htmlFor="username" className="auth-form__label">
              Username
            </label>
            <input
              className="auth-form__input"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
            {errors.username && (
              <p className="auth-form__error">{errors.username}</p>
            )}
          </div>

          <div className="auth-form__field">
            <label htmlFor="email" className="auth-form__label">
              Email
            </label>
            <input
              className="auth-form__input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
            {errors.email && <p className="auth-form__error">{errors.email}</p>}
          </div>

          <div className="auth-form__field">
            <label htmlFor="password" className="auth-form__label">
              Password
            </label>
            <div className="auth-form__password-container">
              <input
                className="auth-form__input auth-form__input--with-toggle"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-form__password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="auth-form__error">{errors.password}</p>
            )}
          </div>

          <div className="auth-form__field">
            <label htmlFor="confirmPassword" className="auth-form__label">
              Confirm Password
            </label>
            <div className="auth-form__password-container">
              <input
                className="auth-form__input auth-form__input--with-toggle"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-form__password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="auth-form__error">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.server && <p className="auth-form__error">{errors.server}</p>}

          <button
            className="auth-form__button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="auth-form__link-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-form__link">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

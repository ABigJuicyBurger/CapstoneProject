import { useState } from "react";
import { Link } from "react-router-dom";

type loginUtility = {
  loggedIn: boolean;
  handleLogin: (event: any) => any;
  error: string;
};

function LoginPage({ loggedIn, handleLogin, error }: loginUtility) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="page-content">
      {!loggedIn && (
        <div className="auth-container">
          <h2 className="auth-title">Login to JobCompass</h2>
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-form__field">
              <label htmlFor="username" className="auth-form__label">
                Username
              </label>
              <input
                className="auth-form__input"
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
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
                  name="password_hash"
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
            </div>
            <button className="auth-form__button" type="submit">
              Login
            </button>
            {error && <p className="auth-form__error">{error}</p>}
            <p className="auth-form__link-text">
              Don't have an account?{" "}
              <Link className="auth-form__link" to="/register">
                Register here
              </Link>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

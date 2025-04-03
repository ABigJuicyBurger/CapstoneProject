type loginUtility = {
  loggedIn: boolean;
  handleLogin: (event: any) => any;
  error: string;
};

function LoginPage({ loggedIn, handleLogin, error }: loginUtility) {
  return (
    <div className="page-content">
      {!loggedIn && (
        <div>
          <h3>Login</h3>
          <form className="form" onSubmit={handleLogin}>
            <input
              className="form__input"
              type="text"
              name="username"
              placeholder="username"
              autoComplete="username"
            />
            <input
              className="form__input"
              type="password"
              name="password_hash"
              placeholder="password"
              autoComplete="current-password"
            />
            <button className="form__btn" type="submit">
              Login
            </button>
            {error && <p>{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

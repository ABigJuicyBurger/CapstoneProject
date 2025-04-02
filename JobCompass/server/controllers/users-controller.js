import initKnex from "knex";
import configuration from "../knexfile.js";
import bcrypt from "bcrypt";
const knex = initKnex(configuration);

const login = async (req, res) => {
  const { username, password_hash } = req.body;

  try {
    const user = await knex("users")
      .where({ username: username.toLowerCase() })
      .first();
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Failed to authenticate" });
    }

    // compare hashed w/ provided password
    const match = await bcrypt.compare(password_hash, user.password_hash);
    if (match) {
      // generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          userName: user.username,
          avatar: `http://localhost${PORT}/${user.avatar}`,
        },
        JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.json({ token });
    } else {
      return res.status(401).json({ message: "Failed to authenticate" });
    }
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

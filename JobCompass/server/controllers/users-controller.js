import db from "../db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, unlinkSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const login = async (req, res) => {
  const { username, password_hash } = req.body;
  const { PORT, JWT_SECRET_KEY } = process.env;

  try {
    console.log("Login attempt:", { username, password_hash });

    const user = await db("users")
      .where({ username: username.toLowerCase() })
      .first();
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Failed to authenticate" });
    }

    console.log("Found user:", user);

    // compare hashed w/ provided password
    const match = await bcrypt.compare(password_hash, user.password_hash);
    console.log("Password match result:", match);

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

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log("Registration attempt:", { username, email });

    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if username already exists
    const existingUsername = await db("users")
      .where({ username: username.toLowerCase() })
      .first();

    if (existingUsername) {
      return res.status(409).json({
        message: "Username already taken",
        field: "username",
      });
    }

    // Check if email already exists
    const existingEmail = await db("users")
      .where({ email: email.toLowerCase() })
      .first();

    if (existingEmail) {
      return res.status(409).json({
        message: "Email already registered",
        field: "email",
      });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const [userId] = await db("users").insert({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password_hash,
      avatar: "default-avatar.png", // Default avatar path
      // created_at and updated_at are handled automatically by timestamps(true, true) in the schema
    });

    // Create user meta entry - only using fields that exist in the schema
    await db("user_meta").insert({
      user_id: userId,
      bio: "",
      resume: "",
      savedjobs: JSON.stringify([]),
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMetaInfo = async (req, res) => {
  try {
    const userMeta = await db("user_meta")
      .where({ user_id: req.user.userId })
      .first();

    if (!userMeta) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userMeta);
  } catch (error) {
    console.error("Get user meta error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateMetaInfo = async (req, res) => {
  try {
    const { bio, resume, savedjobs } = req.body;
    const userId = req.user.userId;

    // Get current user meta to check existing resume
    const userMeta = await db("user_meta")
      .where('user_id', userId)
      .first();
    if (!userMeta) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};

    // Handle resume updates
    if (req.file) {
      // If there's an existing resume, delete it
      if (userMeta.resume) {
        const oldFilePath = join(__dirname, '..', 'uploads', userMeta.resume);
        if (existsSync(oldFilePath)) {
          unlinkSync(oldFilePath);
        }
      }
      updates.resume = `/uploads/${req.file.filename}`;
    } else if (resume === "") {
      // Handle resume deletion
      if (userMeta.resume) {
        const filePath = join(__dirname, '..', 'uploads', userMeta.resume);
        if (existsSync(filePath)) {
          unlinkSync(filePath);
        }
      }
      updates.resume = null;
    }

    // Handle other updates
    if (bio !== undefined) updates.bio = bio;
    if (savedjobs !== undefined) {
      try {
        if (typeof savedjobs === "string") {
          JSON.parse(savedjobs);
          updates.savedjobs = savedjobs;
        } else {
          updates.savedjobs = JSON.stringify(savedjobs);
        }
      } catch (jsonError) {
        console.error("Invalid savedjobs JSON format:", jsonError);
        return res.status(400).json({ message: "Invalid saved jobs format" });
      }
    }

    // Only update if there are changes
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Perform update
    await db("user_meta").where({ user_id: userId }).update(updates);

    // Return updated data
    const updatedUserMeta = await db("user_meta")
      .where({ user_id: userId })
      .first();

    return res.json(updatedUserMeta);
  } catch (error) {
    console.error("Update user meta error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  res.json({ user: req.user });
};

export { login, register, getMetaInfo, updateMetaInfo, getUser };

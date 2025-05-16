import db from "../db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, unlinkSync } from 'fs';

export const checkUserMeta = async (userId) => {
  try {
    const userMeta = await db("user_meta")
      .where('user_id', userId)
      .first();
    console.log('Checking user meta:', userMeta);
    return userMeta;
  } catch (error) {
    console.error('Error checking user meta:', error);
    throw error;
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const login = async (req, res) => {
  const { username, password_hash } = req.body;
  console.log('Login attempt:', { username });

  const { PORT, JWT_SECRET_KEY } = process.env;

  try {
    console.log("Login attempt:", { username, password_hash });

    const user = await db("users")
      .where({ username: username.toLowerCase() })
      .first();
    console.log(user);

    const userMeta = await checkUserMeta(user.id);
    if (!userMeta) {
      console.log('Creating user meta for new user');
      await db("user_meta").insert({
        user_id: user.id,
        bio: "",
        resume: "",
        savedjobs: "[]"
      });
    }

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
    const userId = req.user.userId;
    console.log('Getting meta for user:', userId);

    const userMeta = await db("user_meta")
      .where('user_id', userId)
      .first();
      
    console.log('Found user meta:', userMeta);

    if (!userMeta) {
      console.log('No user meta found, creating...');
      try {
        // Create a new meta record
        const newMeta = {
          user_id: userId,
          bio: "",
          resume: "",
          savedjobs: "[]"
        };
        await db("user_meta").insert(newMeta);
        console.log('User meta created');
        
        // Get the newly created record
        const createdMeta = await db("user_meta")
          .where('user_id', userId)
          .first();
        res.json(createdMeta);
      } catch (error) {
        console.error('Error creating user meta:', error);
        // If creation fails, try to get the record again
        const existingMeta = await db("user_meta")
          .where('user_id', userId)
          .first();
        if (existingMeta) {
          console.log('Found existing meta record after error');
          res.json(existingMeta);
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    } else {
      res.json(userMeta);
    }
  } catch (error) {
    console.error("Get user meta error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateMetaInfo = async (req, res) => {
  try {
    console.log('Updating meta for user:', req.user.userId);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const userId = req.user.userId;
    const userMeta = await db("user_meta")
      .where('user_id', userId)
      .first();
      
    console.log('Found user meta:', userMeta);

    if (!userMeta) {
      console.log('No user meta found, creating...');
      try {
        await db("user_meta").insert({
          user_id: userId,
          bio: req.body.bio || "",
          resume: req.file ? `/uploads/resumes/${req.file.filename}` : "",
          savedjobs: "[]"
        });
        console.log('User meta created');
      } catch (insertError) {
        console.error('Error creating user meta:', insertError);
        // If insert fails, try to get the existing record
        const existingMeta = await db("user_meta")
          .where('user_id', userId)
          .first();
        if (existingMeta) {
          console.log('Found existing meta record');
          userMeta = existingMeta;
        } else {
          throw insertError;
        }
      }
    }

    if (userMeta) {
      // Update existing meta
      const updates = {
        bio: req.body.bio || userMeta.bio,
        savedjobs: req.body.savedjobs || userMeta.savedjobs
      };
      
      if (req.file) {
        // Handle resume update
        updates.resume = `/uploads/resumes/${req.file.filename}`;
        if (userMeta.resume) {
          const oldFilePath = join(__dirname, '..', 'uploads', userMeta.resume);
          if (existsSync(oldFilePath)) {
            unlinkSync(oldFilePath);
          }
        }
      }
      
      await db("user_meta")
        .where('user_id', userId)
        .update(updates);
      console.log('User meta updated');
    }

    res.json({ message: "Meta info updated successfully" });
  } catch (error) {
    console.error('Error updating meta:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUser = async (req, res) => {
  res.json({ user: req.user });
};

export { login, register, getMetaInfo, updateMetaInfo, getUser };

// ✅ MUST be first line in the file
import dotenv from "dotenv";
dotenv.config();

import express, { json, Request, Response } from "express";
import mongoose from "mongoose";
import { ContentModel, LinkModel, RefreshTokenModel, UserModel } from "./db";
import { signInValidation, signUpValidation } from "./validations";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userMiddleware } from "./middleware";
import { randomString } from "./utils";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createAccessToken, createRefreshToken } from "./utils";

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

const app = express();
app.use(json());
app.use(cookieParser());
app.use(cors());

// ✅ SIGN UP
app.post("/api/v1/signup", async (req: Request, res: Response) => {
  const validation = signUpValidation.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      ok: false,
      message: "Invalid input format",
      error: validation.error.errors.map((e) => e.message),
    });
    return;
  }

  const { userName, password } = validation.data;

  try {
    const existing = await UserModel.findOne({ userName });
    if (existing) {
      res.status(409).json({
        ok: false,
        message: "User already exists. Please sign in.",
      });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ userName, password: hashed });

    const accessToken = createAccessToken(user._id.toString());
    const refreshToken = createRefreshToken(user._id.toString());
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshTokenModel.findOneAndUpdate(
      { userId: user._id },
      { token: refreshToken, createdAt: new Date(), expiresAt },
      { upsert: true }
    );

    res.status(201).json({
      ok: true,
      message: "Sign up successful!",
      accessToken,
      refreshToken,
      userName: user.userName,
    });
    return;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected signup error.";
    res.status(500).json({ ok: false, message });
    return;
  }
});

// ✅ SIGN IN
app.post("/api/v1/signin", async (req: Request, res: Response) => {
  const validation = signInValidation.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      ok: false,
      message: "Invalid input format",
      error: validation.error.errors.map((e) => e.message),
    });
    return;
  }

  const { userName, password } = validation.data;

  try {
    const user = await UserModel.findOne({ userName });
    if (!user) {
      res.status(403).json({ ok: false, message: "Invalid credentials." });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(403).json({ ok: false, message: "Invalid credentials." });
      return;
    }

    const accessToken = createAccessToken(user._id.toString());
    const refreshToken = createRefreshToken(user._id.toString());
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshTokenModel.findOneAndUpdate(
      { userId: user._id },
      { token: refreshToken, createdAt: new Date(), expiresAt },
      { upsert: true }
    );

    res.status(200).json({
      ok: true,
      message: "Signed in successfully",
      accessToken,
      refreshToken,
      userName: user.userName,
    });
    return;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected sign-in error.";
    res.status(500).json({ ok: false, message });
    return;
  }
});

// ✅ REFRESH TOKEN
app.post("/api/v1/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (!refreshToken) {
    res.status(401).json({ ok: false, message: "No refresh token provided" });
    return;
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as jwt.JwtPayload;

    const stored = await RefreshTokenModel.findOne({
      userId: payload.userId,
      token: refreshToken,
    });

    if (!stored) {
      res.status(403).json({
        ok: false,
        message: "Refresh token invalid or expired",
      });
      return;
    }

    const newAccessToken = createAccessToken(payload.userId);
    const newRefreshToken = createRefreshToken(payload.userId);

    stored.token = newRefreshToken;
    stored.updatedAt = new Date();
    stored.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await stored.save();

    res.status(200).json({
      ok: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
    return;
  } catch {
    res.status(403).json({
      ok: false,
      message: "Invalid or expired refresh token",
    });
    return;
  }
});

// ✅ LOGOUT
app.post("/api/v1/logout", async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (!refreshToken) {
    res.status(400).json({ ok: false, message: "No refresh token provided" });
    return;
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as jwt.JwtPayload;

    await RefreshTokenModel.deleteOne({
      userId: payload.userId,
      token: refreshToken,
    });

    res.status(200).json({
      ok: true,
      message: "Logged out successfully",
    });
    return;
  } catch {
    res.status(403).json({
      ok: false,
      message: "Invalid refresh token",
    });
    return;
  }
});

// ✅ CONTENT ROUTES
app.post(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response) => {
    const { title, link, contentType } = req.body;
    try {
      await ContentModel.create({
        title,
        link,
        contentType,
        userId: req.userId,
      });
      res.status(200).json({ ok: true, message: "Content created" });
      return;
    } catch {
      res.status(500).json({ ok: false, message: "Failed to create content" });
      return;
    }
  }
);

app.post(
  "/api/v1/get/content",
  userMiddleware,
  async (req: Request, res: Response) => {
    const { userId } = req;
    const { contentType } = req.body as { contentType: string };

    try {
      const content =
        contentType === "all"
          ? await ContentModel.find({ userId }).populate("userId", "userName")
          : await ContentModel.find({ userId, contentType }).populate(
              "userId",
              "userName"
            );

      res
        .status(200)
        .json({ ok: true, message: "Fetched successfully", data: content });
      return;
    } catch {
      res.status(500).json({ ok: false, message: "Failed to fetch content" });
      return;
    }
  }
);

app.delete(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response) => {
    const { userId } = req;
    const { contentId } = req.body as { contentId: string };

    try {
      await ContentModel.deleteOne({ userId, _id: contentId });
      res
        .status(200)
        .json({ ok: true, message: "Content deleted successfully" });
      return;
    } catch {
      res.status(500).json({ ok: false, message: "Failed to delete content" });
      return;
    }
  }
);

// ✅ SHARE LINK
app.post(
  "/api/v1/brain/share",
  userMiddleware,
  async (req: Request, res: Response) => {
    const { share } = req.body as { share: boolean };
    const { userId } = req;

    try {
      if (!share) {
        await LinkModel.deleteOne({ userId });
        res.status(200).json({ ok: true, message: "Share link deleted" });
        return;
      }

      const existing = await LinkModel.findOne({ userId });
      if (existing) {
        res.status(200).json({ ok: true, sharableLink: existing.hashLink });
        return;
      }

      const createLink = randomString(10);
      await LinkModel.create({ hashLink: createLink, userId });
      res.status(200).json({ ok: true, sharableLink: createLink });
      return;
    } catch {
      res
        .status(500)
        .json({ ok: false, message: "Failed to manage share link" });
      return;
    }
  }
);

// ✅ PUBLIC SHARED BRAIN VIEW
app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response) => {
  const { shareLink } = req.params;

  try {
    const linkRes = await LinkModel.findOne({ hashLink: shareLink });
    if (!linkRes) {
      res.status(400).json({ ok: false, message: "Invalid share link" });
      return;
    }

    const user = await UserModel.findById(linkRes.userId);
    if (!user) {
      res.status(404).json({ ok: false, message: "User not found" });
      return;
    }

    const contents = await ContentModel.find({ userId: user._id });
    res.status(200).json({
      ok: true,
      message: "Shared content fetched",
      data: {
        user: { _id: user._id, userName: user.userName },
        content: contents,
      },
    });
    return;
  } catch {
    res
      .status(500)
      .json({ ok: false, message: "Failed to fetch shared brain" });
    return;
  }
});

// ✅ START SERVER
async function main(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    return;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "MongoDB connection failed.";
    console.error("❌", message);
    process.exit(1);
    return;
  }
}

main();

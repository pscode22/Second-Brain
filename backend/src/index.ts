import express, { json } from 'express';
import mongoose from 'mongoose';
import { ContentModel, LinkModel, RefreshTokenModel, UserModel } from './db';
import { signInValidation, signUpValidation } from './validations';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } from './config';
import { userMiddleware } from './middleware';
import { randomString } from './utils';
import cookieParser from 'cookie-parser';
import cors from 'cors';

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
// const corsOptions = {
//   // @ts-ignore
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);

//     // List all allowed origins
//     const allowedOrigins = ['http://localhost:5173', 'http://localhost:4000'];
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // This is CRITICAL for cookies
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

app.use(cors());

const { log } = console;

// Token lifetimes
const ACCESS_TOKEN_LIFETIME = '15m'; // Access tokens live 15 minutes
const IDLE_LIFETIME_S = 15 * 24 * 60 * 60; // Idle expiry: 15 days in seconds
const ABSOLUTE_LIFETIME_S = 30 * 24 * 60 * 60; // Absolute expiry: 30 days in seconds

app.post('/api/v1/signup', async (req, res) => {
  // zod validation
  const zodValidation = signUpValidation.safeParse(req.body);

  if (!zodValidation.success) {
    res
      .status(400)
      .json({ message: 'Invalid format.', error: zodValidation.error });
  }

  const { userName, password } = req.body;

  try {
    const userFound = await UserModel.findOne({ userName });
    // check if email already exist in db.
    if (userFound) {
      res.status(409).json({
        message: 'user already exist.',
      });
    }

    // hash password with bcrypt.
    const hashedPassword = await bcrypt.hash(password, 5);

    await UserModel.create({ userName, password: hashedPassword });
    res.status(200).json({ message: 'sign up successful!' });
  } catch (error) {
    res.json({
      message: 'Something went wrong, try again.',
    });
  }
});

app.post('/api/v1/signin', async (req, res) => {
  try {
    // Validate input
    const parse = signInValidation.safeParse(req.body);
    if (!parse.success) {
      res
        .status(400)
        .json({ message: 'Invalid input format.', error: parse.error });
      return;
    }

    const { userName, password } = parse.data;

    // Find user
    const user = await UserModel.findOne({ userName });
    if (!user) {
      res.status(403).json({ message: 'Invalid credentials.' });
      return;
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password!);
    if (!match) {
      res.status(403).json({ message: 'Invalid credentials.' });
      return;
    }

    // Issue access token (short-lived)
    const accessToken = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_LIFETIME,
    });

    const tokenExist = await RefreshTokenModel.findOne({ userId: user.id });

    if (tokenExist) {
      res.status(200).json({
        message: 'Signed in',
        accessToken,
        refreshToken: tokenExist.token,
        ok: true,
        userName : user.userName
      });
      return;
    }

    // Generate new JTI using mongoose ObjectId
    const jti = new mongoose.Types.ObjectId().toHexString();

    // Issue refresh token (long-lived) embedding jti
    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: `${ABSOLUTE_LIFETIME_S}s`, // Absolute TTL in seconds
      jwtid: jti, // embed jti for one-time use
    });

    // Persist refresh token record (store jti)
    const now = new Date();
    await RefreshTokenModel.create({
      token: jti,
      userId: user._id,
      createdAt: now,
      lastUsedAt: now, // initial idle timestamp
      expiresAt: new Date(now.getTime() + ABSOLUTE_LIFETIME_S * 1000), // maxAge in ms
    });

    // Respond with access token
    res.status(200).json({
      message: 'Signed in',
      accessToken,
      refreshToken,
      ok: true,
      userName: user.userName,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/v1/refresh', async (req, res) => {
  try {
    const oldToken = req.body.refreshToken;
    console.log(oldToken);
    if (!oldToken) {
      res.status(401).json({ message: 'No refresh token provided' });
      return;
    }

    // Verify the old refresh token
    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(oldToken, JWT_REFRESH_SECRET) as jwt.JwtPayload;
    } catch {
      res.status(403).json({ message: 'Invalid refresh token' });
      return;
    }

    const now = new Date();

    // Find the existing refresh token record
    const existingToken = await RefreshTokenModel.findOne({
      token: payload.jti,
      userId: payload.userId,
    });
    if (!existingToken) {
      res.status(403).json({ message: 'Refresh token not found' });
      return;
    }

    // Check for absolute expiration
    if (existingToken.expiresAt.getTime() <= now.getTime()) {
      res.status(403).json({ message: 'Refresh token has expired' });
      return;
    }

    const newJti = new mongoose.Types.ObjectId().toHexString();

    // Atomically find and update the refresh token
    const updatedToken = await RefreshTokenModel.findOneAndUpdate(
      {
        token: payload.jti,
        userId: payload.userId,
        expiresAt: { $gt: now },
        lastUsedAt: { $gt: new Date(now.getTime() - IDLE_LIFETIME_S * 1000) },
      },
      {
        $set: {
          token: newJti,
          lastUsedAt: now,
        },
      },
      { new: true }
    );

    if (!updatedToken) {
      res
        .status(403)
        .json({ message: 'Refresh token expired or already used' });
      return;
    }

    // Calculate remaining time until absolute expiration
    const remainingTimeMs = updatedToken.expiresAt.getTime() - now.getTime();
    const remainingTimeSec = Math.floor(remainingTimeMs / 1000);

    // Issue new refresh token with the same expiration as the original
    const newRefreshToken = jwt.sign(
      { userId: payload.userId },
      JWT_REFRESH_SECRET,
      {
        expiresIn: remainingTimeSec,
        jwtid: newJti,
      }
    );

    // Issue new access token
    const accessToken = jwt.sign(
      { userId: payload.userId },
      JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_LIFETIME }
    );

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    return;
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
});

// logout
app.post('/api/v1/logout', async (req, res) => {
  const { refreshToken } = req.body;

  // Verify the old refresh token
  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as jwt.JwtPayload;
  } catch {
    res.status(403).json({ message: 'Invalid refresh token' });
    return;
  }

  try {
    await RefreshTokenModel.deleteOne({
      token: payload.jti,
      userId: payload.userId,
    });
  } catch (error) {
    res.status(403).json({ message: 'token or user not found' });
    return;
  }
  res.status(200).json({ message: 'Logged out' });
});

app.post('/api/v1/content', userMiddleware, async (req, res) => {
  const { title, link, tags } = req.body;

  try {
    await ContentModel.create({ title, link, tags: [], userId: req.userId });
    res.status(200).json({ message: 'Content created' });
  } catch (error) {
    res.json({
      message: 'Something went wrong, try again.',
    });
  }
});

app.get('/api/v1/content', userMiddleware, async (req, res) => {
  const { userId } = req;
  try {
    const content = await ContentModel.find({ userId }).populate(
      'userId',
      'userName'
    );
    res.status(200).json({ data: content });
  } catch (error) {
    res.json({
      message: 'Something went wrong, try again.',
    });
  }
});

app.delete('/api/v1/content', userMiddleware, async (req, res) => {
  const { userId } = req;
  const { contentId } = req.body;
  try {
    await ContentModel.deleteOne({ userId, _id: contentId });
    res.status(200).json({ message: 'Content deleted.' });
  } catch (error) {
    log(error);
    res.json({
      error,
      message: 'Something went wrong, try again.',
    });
  }
});

app.post('/api/v1/brain/share', userMiddleware, async (req, res) => {
  const { share } = req.body;
  const { userId } = req;

  if (!share) {
    await LinkModel.deleteOne({ userId });
    res.status(200).json({ message: 'sharedLink is deleted.' });
  } else {
    const isLink = await LinkModel.findOne({ userId });

    if (isLink) {
      res.status(200).json({ sharableLink: isLink.hashLink });
    } else {
      const createLink = randomString(10);
      await LinkModel.create({ hashLink: createLink, userId });
      res.status(200).json({ sharableLink: createLink });
    }
  }
});

app.get('/api/v1/brain/:shareLink', async (req, res) => {
  const { shareLink } = req.params;

  if (shareLink) {
    try {
      const linkRes = await LinkModel.findOne({ hashLink: shareLink });
      if (linkRes) {
        const user = await UserModel.findOne({ _id: linkRes.userId });

        if (!user) {
          res.status(404).json({ message: 'User not found.' });
          return;
        }

        const userContents = await ContentModel.find({
          userId: user._id,
        });

        if (userContents) {
          res.status(200).json({
            user: { _id: user._id, userName: user.userName },
            content: userContents,
          });
        } else {
          res.status(204).json({ message: 'No Contents found' });
        }
      }
    } catch (error) {
      res.json({
        error,
        message: 'Something went wrong, try again.',
      });
    }
  }
});

async function main() {
  await mongoose.connect(
    'mongodb+srv://prince_dev24:6xX3ACUnfeVGNzVe@cluster0.dkljnpt.mongodb.net/second-brain'
  );
  app.listen(4000);
  console.log('connected');
}
main();

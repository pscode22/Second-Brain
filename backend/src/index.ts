import express, { json } from 'express';
import mongoose from 'mongoose';
import { ContentModel, LinkModel, UserModel } from './db';
import { signInValidation, signUpValidation } from './validations';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_PASSWORD } from './config';
import { userMiddleware } from './middleware';
import { randomString } from './utils';

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

const app = express();
app.use(json());

const { log } = console;

app.post('/api/v1/signup', async (req, res) => {
  // zod validation
  const zodValidation = signUpValidation.safeParse(req.body);

  if (!zodValidation.success) {
    res.json({ message: 'Invalid format.', error: zodValidation.error });
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
  // zod validation
  const zodValidation = signInValidation.safeParse(req.body);

  if (!zodValidation.success) {
    res.json({ message: 'Invalid format.', error: zodValidation.error });
  }

  const { userName, password } = req.body as {
    userName: string;
    password: string;
  };

  try {
    const user = await UserModel.findOne({ userName });

    if (!user) {
      res.json({ message: 'User Not found.' });
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password as string
      );

      if (!isPasswordCorrect) {
        res.status(403).json({ message: 'Invalid credentials' });
      } else {
        const generateToken = jwt.sign(
          { userId: user.id as string },
          JWT_PASSWORD
        );
        res
          .status(200)
          .json({ message: 'you are signed in.', token: generateToken });
      }
    }
  } catch (error) {
    res.json({
      message: 'Something went wrong, try again.',
    });
  }
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
          res
            .status(200)
            .json({
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

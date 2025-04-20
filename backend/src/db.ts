import mongoose, { model, Schema } from 'mongoose';

const userSchema = new Schema({
  userName: { type: String, unique: true, required: true },
  password: String,
});

export const UserModel = model('User', userSchema);

const contentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

const linkSchema = new Schema({
  hashLink: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
});

export const ContentModel = model('Content', contentSchema);
export const LinkModel = model('Link', linkSchema);

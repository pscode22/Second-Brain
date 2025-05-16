import mongoose, { model, Schema } from 'mongoose';

const userSchema = new Schema({
  userName: { type: String, unique: true, required: true },
  password: String,
});

const contentSchema = new Schema({
  title: String,
  link: String,
  contentType: { type: String, required: true },
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

const refreshTokenSchema = new Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Number, required: true }, // timestamp ms
  lastUsedAt: { type: Number, required: true }, // timestamp ms
  expiresAt: { type: Date, required: true },
});

// Configure toJSON so that __v never appears in JSON output
userSchema.set('toJSON', {
  versionKey: false,
});

linkSchema.set('toJSON', {
  versionKey: false,
});

refreshTokenSchema.set('toJSON', {
  versionKey: false,
});

contentSchema.set('toJSON', {
  versionKey: false,
});

export const UserModel = model('User', userSchema);
export const RefreshTokenModel = model('RefreshToken', refreshTokenSchema);
export const ContentModel = model('Content', contentSchema);
export const LinkModel = model('Link', linkSchema);

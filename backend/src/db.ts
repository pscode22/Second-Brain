import mongoose, { model, Schema } from 'mongoose';

const userSchema = new Schema({
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
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
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  expiresAt: { type: Date, required: true },
});

// 🧹 Mongo will automatically delete expired refresh tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

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

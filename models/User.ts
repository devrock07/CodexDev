import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    username: string;
    passwordHash: string;
    role: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'staff' }, // 'admin', 'staff'
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema, 'codex_users');

export default User;

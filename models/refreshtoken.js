import mongoose from "mongoose";
const Schema = mongoose.Schema;

const redreshTokenSchema = new Schema({

    token: { type: String, unique: true }

}, { timestamps: false });

export default mongoose.model('RefreshToken', redreshTokenSchema, 'RefreshTokens');
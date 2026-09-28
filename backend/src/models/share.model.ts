import mongoose, { model, Types } from "mongoose";

const Schema = mongoose.Schema;

export interface I_Share extends mongoose.Document {
    "shareToken": string;
    "userId": Types.ObjectId;
}

const shareSchema = new Schema<I_Share>({
    shareToken: { type: String, unique: true, sparse: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
});

export const ShareModel = mongoose.models.Share as mongoose.Model<I_Share> || model<I_Share>("Share", shareSchema);
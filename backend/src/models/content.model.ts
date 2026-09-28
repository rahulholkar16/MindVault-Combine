import mongoose, { Types } from "mongoose";
import { UserModel } from "./user.model.js";

const Schema = mongoose.Schema;

export interface I_Content extends mongoose.Document {
    "_id": Types.ObjectId,
    "title": string,
    "url"?: string,
    "description"?: string,
    "tags"?: Types.ObjectId[],
    "type"?: "document" | "video" | "tweets" | "url",
    "userId": Types.ObjectId,
    "isPublic"?: boolean
};

const content = new Schema<I_Content>({
    title: { type: String, required: true },
    url: { type: String },
    tags: [ { type: mongoose.Types.ObjectId, ref: "Tag" } ],
    type: { type: String },
    description: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPublic: { type: Boolean, default: false }
}, {timestamps: true});

content.pre("save", async function (next) {
    if (this.type !== "video" || !this.url) return next();
    
    const url = this.url; 
    let videoId: string | undefined;

    if (url.includes("youtu.be")) {
        videoId = url.split("youtu.be/")[1];
    } else if (url.includes("v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
    }

    if (!videoId) return next();

    this.url = `https://www.youtube.com/embed/${videoId}`;
    next();
});

content.post("save", async function () {
    const contentId = this._id;
    const userId = this.userId;
    await UserModel.findByIdAndUpdate(userId, {
        $push: { content: contentId}
    });
});


export const ContentModel = (mongoose.models?.Content as mongoose.Model<I_Content>) || (mongoose.model<I_Content>("Content", content));
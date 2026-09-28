import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ContentModel } from "../models/content.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { UserModel } from "../models/user.model.js";
import { ShareModel } from "../models/share.model.js";
// import { TagModel } from "../models/tags.model.js";

export const createContent = asyncHandler(async (req: Request, res: Response) => {
    const { title, url, type, description, isPublic } = req.body; // Add tag after 
    const userId = req.user?._id;  
    const isVerified = req.user?.isVerified;
    if (!isVerified) throw new ApiError(401, "Pls verify your email.");  
    if (!userId) throw new ApiError(400, "Unauthorized Access.");
    
    if (!title || !type || !description) throw new ApiError(400, "All field are required!");
    if (type === "tweets" || type === "video" || type === "url") {
        if (!url) throw new ApiError(400, "Url is missing!");
    }

    // const normalized = tags.map((t: string) => t.toLowerCase().trim());
    // const existingTags = await TagModel.find({
    //     tag: { $in: normalized }
    // });
    // const existingSet = new Set(existingTags.map(t => t.tag));
    // const newTags = normalized.filter(t => !existingSet.has(t));
    // if (newTags.length) {
    //     await TagModel.insertMany(
    //         newTags.map(t => ({ tag: t })),
    //         { ordered: false }
    //     );
    // }

    const data = await ContentModel.create({
        title,
        url,
        type,
        // tags: tagIds,
        description,
        userId,
        isPublic
    });

    res.status(200).json(
        new ApiResponse(200, data, "Content added successfully.")
    );
});

export const getAllContent = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(400, "Unauthorized Access!");
    const content = await ContentModel.find({
        isPublic: true
    }).sort({ createdAt: -1 }).populate("userId", "name");
    if (!content) throw new ApiError(404, "Content not found!");
    res.status(200).json( new ApiResponse(200, content, "Data fetched successfully!") );
});

export const getAllContentMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(400, "Unauthorized Access!");
    const content = await ContentModel.find({ userId }).sort({ createdAt: -1 }).populate("userId", "name");
    if (!content) throw new ApiError(404, "Content not found!");

    res.status(200).json(new ApiResponse(200, content, "Data fetched successfully!"));
});

export const getSpecificContent = asyncHandler(async (req: Request, res: Response) => {
    const { type } = req.params;
    const userId = req.user?._id;
    if (!userId) throw new ApiError(400, "Unauthorized Access!");
    const content = await ContentModel.find({ type, isPublic: true }).sort({ createdAt: -1 }).populate("userId", "name");
    if (!content) throw new ApiError(404, "Content not found!");
    res.status(200).json(new ApiResponse(200, content, "Data fetched successfully!"));
});

export const getSpecificContentMe = asyncHandler(async (req: Request, res: Response) => {
    const { type } = req.params;    
    const userId = req.user?._id;
    if (!userId) throw new ApiError(400, "Unauthorized Access!");
    const content = await ContentModel.find({ type, userId }).sort({ createdAt: -1 }).populate("userId", "name");
    if (!content) throw new ApiError(404, "Content not found!");
    res.status(200).json(new ApiResponse(200, content, "Data fetched successfully!"));
});

export const getContentById = asyncHandler(async (req: Request, res: Response) => {
    const { contentId } = req.params;
    console.log(contentId);

    if (!contentId) throw new ApiError(400, "Content Id missing!");

    const content = await ContentModel.findById(contentId).populate("userId", "name");
    console.log("Content: ", content)
    
    if (!content) throw new ApiError(400, "Content not found or Invalid ID.");
    res.status(200).json( new ApiResponse(200, content, "content fetched siuccessfully!") );
});

export const deleteContent = asyncHandler(async (req: Request, res: Response) => {
    const { contentId } = req.params;
    const userId = req.user?._id;
    if (!contentId) throw new ApiError(400, "Content Id is missing!");
    if (!userId) throw new ApiError(400, "Unauthorized Access!");

    const content = await ContentModel.findOneAndDelete({
        _id: contentId,
        userId
    });
    res.status(200).json( new ApiResponse(200, content, "Deleted successfully!") );
});

export const toggleNoteVisibility = asyncHandler(async (req: Request, res: Response) => {
    const  { contentId } = req.params;
    const userId = req.user?._id;
    if (!contentId) throw new ApiError(404, "Content Id is requierd!");
    if (!userId) throw new ApiError(401, "Unauthorized Access!");

    const content = await ContentModel.findOneAndUpdate(
        {
            _id: contentId,
            userId
        },
        [{ $set: { isPublic: { $not: "$isPublic" } } }],
        {
            new: true,
        }
    );
    if (!content) throw new ApiError(404, "content not found!");   

    return res.status(200).json(
        new ApiResponse(
            200,
            content?.isPublic,
            content?.isPublic ? "Note is now public" : "Note is now private"
        )
    );
});

export const getSharedBrain = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;
    if (!token) throw new ApiError(404, "Token is requierd!");
    const share = await ShareModel.findOne({ shareToken: token });    
    if (!share) {
        throw new ApiError(404, "Invalid or expired share link");
    }

    const user = await UserModel.findById(share?.userId);
    if (!user) throw new ApiError(404, "Invalid share User");

    const content = await ContentModel.find({
        userId: share?.userId,
        isPublic: true,
    });

    return res.status(200).json(
        new ApiResponse(200, {user, content}, "Shared brain fetched")
    );
});

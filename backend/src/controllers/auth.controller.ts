import type { Request, Response } from "express";
import { UserModel } from "../models/user.model.js";
import type { CookieOptions } from "express";
import fs from "fs";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    emailVerificationContent,
    forgotPasswordContent,
    sendEmail,
} from "../services/sendMail.services.js";
import { ApiResponse } from "../utils/apiResponse.js";
import type { Types } from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/jwtPayload.js";
import { uploadOnCloud } from "../services/fileUploder.services.js";
import { ShareModel } from "../models/share.model.js";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (
    userId: string | Types.ObjectId
) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) throw new ApiError(404, "User not found");
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access token."
        );
    }
};

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.validateData;
    const { isPublic } = req.body;
    if (!isPublic) throw new ApiError(404, "Account type requierd!");
    const file = req.file;    
    if (!file) throw new ApiError(400, "Avatar is Required!");

    const isExist = await UserModel.findOne({ email });
    if (isExist) throw new ApiError(409, "User already exists.");
    const avatar = await uploadOnCloud(file.path);
    if (avatar === null) {
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        throw new ApiError(400, "File not upload on cloud!");
    }
    const newUser = await UserModel.create({
        name,
        email,
        password,
        avatar: avatar.url,
        isPublic: isPublic === "false" ? false : true,
    });
    const { unHashedToken, hasedToken, tokenExpiry } = newUser.generateTempToken();
    newUser.verificationToken = hasedToken;
    newUser.verificationTokenExpire = tokenExpiry;
    await newUser.save({ validateBeforeSave: false });
    // await sendEmail({
    //     email: newUser.email,
    //     subject: "Plesase verify your email.",
    //     mailgenContent: emailVerificationContent(
    //         newUser.name,
    //         `${process.env.CORS_ORIGIN}/verify-user/${unHashedToken}`
    //     ),
    // });
    const data = await UserModel.findById(newUser._id).select(
        "-password -verificationToken -resetPasswordToken -refreshToken"
    );

    if (!data)
        throw new ApiError(500, "Something went wrong while Register a User.");
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: data },
                "User added successfully and verification email send"
            )
        );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new ApiError(401, "Email and Password required.");

    const user = await UserModel.findOne({ email });
    if (!user) throw new ApiError(404, "User not found!");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid Password!");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedUser = await UserModel.findById(user._id).select(
        "-password -verificationToken -resetPasswordToken -refreshToken"
    );

    const accessCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none"
    };
    
    const refreshCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
        sameSite: "none"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully."
            )
        );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    await UserModel.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: "",
            },
        },
        {
            new: true,
        },
    );
    const options: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out."));
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Current User fetched successfully."));
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { verificationToken } = req.params;
    if (!verificationToken) throw new ApiError(400, "Email verfication token is missing.");

    let hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");

    const user = await UserModel.findOne({ verificationToken: hashedToken, verificationTokenExpire: { $gt: Date.now() } });
    if (!user) throw new ApiError(400, "Token is invalid or expired");

    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isEmailVerified: true
                },
                "Email is verified"
            )
        );
});

export const resendEmailVerification = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.user?._id);
    if(!user) throw new ApiError(404, "User does not exist.");

    if(user.isVerified) throw new ApiError(400, "User alredy verified.");

    const { unHashedToken, hasedToken, tokenExpiry } = user.generateTempToken();
    user.verificationToken = hasedToken;
    user.verificationTokenExpire = tokenExpiry;
    await user.save({ validateBeforeSave: false });
    await sendEmail({
        email: user.email,
        subject: "Please verify your email.",
        mailgenContent: emailVerificationContent(
            user?.name,
            `${process.env.CORS_ORIGIN}/verify-user/${unHashedToken}`
        )
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Mail has been sent to your email ID."
        )
    );
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingrefreshToken) throw new ApiError(400, "Unauthorized acces");

    try {
        const decode = jwt.verify(incomingrefreshToken, process.env.REFRESH_JWT_SECRET as string) as JwtPayload;
        const user = await UserModel.findById(decode?._id);
        if (!user) throw new ApiError(401, "Invalid refresh token");
        if (incomingrefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired");
        };
        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        user.refreshToken = newRefreshToken;

        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed."
                )
            );
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token.");
    }
});

export const forgotPasswordEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) throw new ApiError(400, "User does not exists");

    const { unHashedToken, hasedToken, tokenExpiry } = user.generateTempToken();
    user.resetPasswordToken = hasedToken;
    user.resetPasswordTokenExpire = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user.email,
        subject: "Password reset request.",
        mailgenContent: forgotPasswordContent(
            user.name,
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`,
        )
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset mail has been sent on your mail.")
    );
});

export const resetForgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { resetToken } = req.params;
    const { password: newPassword } = req.body;
    if (!resetToken) throw new ApiError(400, "Reset token is missing.")

    let hashedToken = crypto.createHash("sha256")
        .update(resetToken)
        .digest("hex");
    
    const user = await UserModel.findOneAndUpdate(
        {
            resetPasswordToken: hashedToken,
            resetPasswordTokenExpire: { $gt: Date.now() }
        },
        {
            password: newPassword,
            resetPasswordToken: undefined,
            resetPasswordTokenExpire: undefined
        }
    );
    if (!user) throw new ApiError(404, "Token is invalid or expired.");
    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset successfully.")
    );
});

export const changeCurrentPassword = asyncHandler(async (req: Request, res: Response) => {
    const { oldPassword } = req.body;
    const { password: newPassword } = req.validateData;
    const user = await UserModel.findById(req.user?._id);
    if (!user) throw new ApiError(400, "User not found.");
    const isPasswordValid = await user?.isPasswordCorrect(oldPassword);
    if(!isPasswordValid) throw new ApiError(400, "Invalid Old Password.");
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200, 
            {
                oldPassword,
                newPassword
            },
            "Password Change successfully."
        )
    );
});

export const togglePublic = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized Request!");

    const user = await UserModel.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    user.isPublic = !user.isPublic;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, user, user.isPublic ? "User set Public account." : "User set Private account.")
    )
});

export const createShareLink = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized Access!");

    const user = await UserModel.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    if (!user?.isPublic) throw new ApiError(403, "You are private — cannot generate share link");

    let share = await ShareModel.findOne({ userId });
    if (!share) {
        const hash = await crypto.randomBytes(16).toString("hex");
        share = await ShareModel.create({
            userId,
            isPublic: true,
            shareToken: hash
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                shareLink: share?.shareToken,
            },
            "Share link generated"
        )
    );
});

export const changeName = asyncHandler(async (req:Request, res: Response) => {
    const { name: newName } = req.validateData;
    if (!newName) throw new ApiError(404, 'Name is requierd!');
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized Access!");

    const user = await UserModel.findByIdAndUpdate(userId, { name: newName }, { new: true });
    if (!user) throw new ApiError(404, "User not found");

    res.json(
        new ApiResponse(200, user, "Name is successfully updated!")
    );
});

export const changeEmail = asyncHandler(async (req:Request, res: Response) => {
    const { email: newEmail } = req.validateData;
    if (!newEmail) throw new ApiError(404, 'Name is requierd!');
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized Access!");

    const user = await UserModel.findByIdAndUpdate(userId, { email: newEmail }, { new: true });
    if (!user) throw new ApiError(404, "User not found");

    res.json(
        new ApiResponse(200, user, "Email is successfully updated!")
    );
});

export const changeAvatar = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) throw new ApiError(404, "Avatar is Required!");
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized Access!");

    const avatar = await uploadOnCloud(file.path);
    if (!avatar) throw new ApiError(400, "File not upload on cloud!");

    const user = await UserModel.findByIdAndUpdate(userId, {
        avatar: avatar.url
    }, {new: true});

    if (!user) throw new ApiError(404, "User Not found!");

    return  res.json(
        new ApiResponse(200, user, "Avatar update successfully.")
    );
});

export const followUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { targetUserId } = req.params;

    if (!userId) throw new ApiError(401, "Unauthorized Access!");

    if (!targetUserId) throw new ApiError(400, "Target user id is required!");

    if (userId.toString() === targetUserId) {
        throw new ApiError(400, "You cannot follow yourself!");
    }

    const user = await UserModel.findById(userId);
    const targetUser = await UserModel.findById(targetUserId);

    if (!user || !targetUser) throw new ApiError(404, "User not found!");
    const targetObjectId = new mongoose.Types.ObjectId(targetUserId);
    // Already following?
    if (user.followingUsers?.includes(targetObjectId)) {
        throw new ApiError(400, "You are already following this user!");
    }

    const newUser = await UserModel.findByIdAndUpdate(userId, {
        $push: { followingUsers: targetUserId },
        $inc: { following: 1 },
    }, {new: true});

    await UserModel.findByIdAndUpdate(targetUserId, {
        $push: { followers: userId },
        $inc: { follower: 1 },
    });

    return res.json(
        new ApiResponse(200, newUser, "Followed user successfully.")
    );
});

export const unfollowUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { targetUserId } = req.params;

    if (!userId) throw new ApiError(401, "Unauthorized Access!");

    if (!targetUserId) throw new ApiError(400, "Target user id is required!");

    if (userId.toString() === targetUserId) {
        throw new ApiError(400, "You cannot unfollow yourself!");
    }

    const user = await UserModel.findById(userId);
    const targetUser = await UserModel.findById(targetUserId);

    if (!user || !targetUser) throw new ApiError(404, "User not found!");
    const targetObjectId = new mongoose.Types.ObjectId(targetUserId);
    // Not following?
    if (!user.followingUsers?.includes(targetObjectId)) {
        throw new ApiError(400, "You are not following this user!");
    }

    const newUser = await UserModel.findByIdAndUpdate(userId, {
        $pull: { followingUsers: targetUserId },
        $inc: { following: -1 },
    });

    await UserModel.findByIdAndUpdate(targetUserId, {
        $pull: { followers: userId },
        $inc: { follower: -1 },
    });

    return res.json(
        new ApiResponse(200, newUser, "Unfollowed user successfully.")
    );
});

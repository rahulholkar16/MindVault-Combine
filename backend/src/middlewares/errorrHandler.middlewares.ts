import type { Request, Response, NextFunction } from "express"
import { ApiError } from "../utils/apiError.js"

export const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500

    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
        errors: err.errors || null,
    })
}

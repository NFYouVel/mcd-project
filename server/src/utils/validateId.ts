import { Request } from "express";

export const getIdParam = (req: Request, key: string = "id"): string => {
    const id = req.params[key];
    if (!id || typeof id !== "string") {
        const err: any = new Error(`Invalid ${key} parameter`);
        err.status = 400;
        throw err;
    }
    return id;
};
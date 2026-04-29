import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/menu";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_, file, cb) => {
        const ok = /jpeg|jpg|png|webp/.test(file.mimetype);
        if (ok) {
            cb(null, true);
        } else {
            cb(new Error("Only image files allowed (jpeg, jpg, png, webp)"));
        }
    },
});
import { Router } from "express";
import { auth } from "../middlewares/auth.middlewares.js";
import { createContent, deleteContent, getAllContent, getAllContentMe, getContentById, getSharedBrain, getSpecificContent, getSpecificContentMe } from "../controllers/content.controller.js";

const router = Router();

router.route("/content").post(auth, createContent);
router.route("/content").get(auth, getAllContent);
router.route("/me/content").get(auth, getAllContentMe);
router.route("/content/type/:type").get(auth, getSpecificContent);
router.route("/me/content/:type").get(auth, getSpecificContentMe);
router.route("/content/:contentId").get(auth, getContentById);
router.route("/content/:contentId").delete(auth, deleteContent);
router.route("/share-brain/:token").get(auth, getSharedBrain);

export default router;
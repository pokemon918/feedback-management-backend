import { feedbackController } from "@/controllers";
import { authMiddleware } from "@/middlewares";
import { Router } from "express";

export const feedbackRouter = Router();

feedbackRouter.post("/", authMiddleware, feedbackController.submitFeedback);
feedbackRouter.get("/all", authMiddleware, feedbackController.getFeedback);
feedbackRouter.get("/user", authMiddleware, feedbackController.getUserFeedback);
feedbackRouter.put("/:feedbackId", authMiddleware, feedbackController.updateFeedback);
feedbackRouter.delete("/:feedbackId", authMiddleware, feedbackController.deleteFeedback);
feedbackRouter.delete(
  "/admin/:feedbackId", 
  authMiddleware, 
  feedbackController.adminDeleteFeedback
);
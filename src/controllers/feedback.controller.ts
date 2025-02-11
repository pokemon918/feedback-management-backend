/** @format */
import { Request, Response } from "express";
import { feedbackService } from "@/services";
import { errorHandlerWrapper } from "@/utils";

const submitFeedbackHandler = async (req: Request, res: Response) => {
  const { text } = req.body;
  
  // Now req.user will be available
  const userId = req.user.uuid;

  if (!text || text.length > 1000) {
    return res.status(400).json({ 
      message: "Text is required and must not exceed 1000 characters" 
    });
  }

  const feedback = await feedbackService.createFeedback(text, userId);
  
  if (!feedback) {
    return res.status(409).json({ 
      message: "You already have existing feedback. Please delete it first before submitting new feedback." 
    });
  }

  res.status(201).json(feedback);
};

const getFeedbackHandler = async (req: Request, res: Response) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: "Only admin users can access all feedback" 
    });
  }

  const feedback = await feedbackService.getFeedback();
  res.status(200).json(feedback);
};

const getUserFeedbackHandler = async (req: Request, res: Response) => {
  const userId = req.user.uuid;
  const feedback = await feedbackService.getUserFeedback(userId);
  res.status(200).json(feedback);
};

const updateFeedbackHandler = async (req: Request, res: Response) => {
  const { text } = req.body;
  const { feedbackId } = req.params;
  const userId = req.user.uuid;

  if (!text || text.length > 1000) {
    return res.status(400).json({ 
      message: "Text is required and must not exceed 1000 characters" 
    });
  }

  const updatedFeedback = await feedbackService.updateFeedback(feedbackId, userId, text);
  
  if (!updatedFeedback) {
    return res.status(404).json({ 
      message: "Feedback not found or you don't have permission to update it" 
    });
  }

  res.status(200).json(updatedFeedback);
};

const deleteFeedbackHandler = async (req: Request, res: Response) => {
  const { feedbackId } = req.params;
  const userId = req.user.uuid;

  const isDeleted = await feedbackService.deleteFeedback(feedbackId, userId);
  
  if (!isDeleted) {
    return res.status(404).json({ 
      message: "Feedback not found or you don't have permission to delete it" 
    });
  }

  res.status(204).send();
};

const adminDeleteFeedbackHandler = async (req: Request, res: Response) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: "Only admin users can delete any feedback" 
    });
  }

  const { feedbackId } = req.params;
  const isDeleted = await feedbackService.adminDeleteFeedback(feedbackId);
  
  if (!isDeleted) {
    return res.status(404).json({ 
      message: "Feedback not found" 
    });
  }

  res.status(204).send();
};

export const submitFeedback = errorHandlerWrapper(submitFeedbackHandler);
export const getFeedback = errorHandlerWrapper(getFeedbackHandler);
export const getUserFeedback = errorHandlerWrapper(getUserFeedbackHandler);
export const updateFeedback = errorHandlerWrapper(updateFeedbackHandler);
export const deleteFeedback = errorHandlerWrapper(deleteFeedbackHandler);
export const adminDeleteFeedback = errorHandlerWrapper(adminDeleteFeedbackHandler); 
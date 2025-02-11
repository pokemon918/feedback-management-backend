import { FeedbackEntity } from "@/entities/feedback.entity";
import { AppDataSource } from "@/setup/datasource";
import sentiment from "sentiment";
import { authService } from "@/services";

const analyzer = new sentiment();

export const analyzeSentiment = (text: string) => {
  const result = analyzer.analyze(text);
  
  let label = "Neutral";
  if (result.score > 0) label = "Good";
  if (result.score < 0) label = "Bad";

  return {
    score: result.score,
    label
  };
};

export const createFeedback = async (text: string, userId: string) => {
  const feedbackRepository = AppDataSource.getRepository(FeedbackEntity);
  
  // Check if user already has feedback
  const existingFeedback = await feedbackRepository.findOne({
    where: { userId }
  });

  if (existingFeedback) {
    return null;
  }
  
  const sentimentResult = analyzeSentiment(text);
  
  const feedback = new FeedbackEntity();
  Object.assign(feedback, {
    text,
    userId,
    sentimentScore: sentimentResult.score,
    sentimentLabel: sentimentResult.label
  });

  return await feedbackRepository.save(feedback);
};

export const getFeedback = async () => {
  const feedbackRepository = AppDataSource.getRepository(FeedbackEntity);
  const feedbacks = await feedbackRepository.find({
    order: {
      createdAt: "DESC"
    }
  });

  // Fetch usernames for all feedback
  const feedbacksWithUsernames = await Promise.all(
    feedbacks.map(async (feedback) => {
      const user = await authService.getUserById(feedback.userId);
      return {
        ...feedback,
        username: user ? user.name : 'Unknown'
      };
    })
  );

  return feedbacksWithUsernames;
};

export const getUserFeedback = async (userId: string) => {
  const feedbackRepository = AppDataSource.getRepository(FeedbackEntity);
  return await feedbackRepository.find({
    where: { userId },
    order: {
      createdAt: "DESC"
    }
  });
};

export const updateFeedback = async (feedbackId: string, userId: string, text: string) => {
  const feedbackRepository = AppDataSource.getRepository(FeedbackEntity);
  
  const feedback = await feedbackRepository.findOne({
    where: { uuid: feedbackId, userId }
  });

  if (!feedback) {
    return null;
  }

  const sentimentResult = analyzeSentiment(text);
  
  Object.assign(feedback, {
    text,
    sentimentScore: sentimentResult.score,
    sentimentLabel: sentimentResult.label
  });

  return await feedbackRepository.save(feedback);
};

export const deleteFeedback = async (feedbackId: string, userId: string) => {
  const feedbackRepository = AppDataSource.getRepository(FeedbackEntity);
  
  const feedback = await feedbackRepository.findOne({
    where: { uuid: feedbackId, userId }
  });

  if (!feedback) {
    return false;
  }

  await feedbackRepository.remove(feedback);
  return true;
};

export const adminDeleteFeedback = async (feedbackId: string) => {
  const feedbackRepository = AppDataSource.getRepository(FeedbackEntity);
  
  const feedback = await feedbackRepository.findOne({
    where: { uuid: feedbackId }
  });

  if (!feedback) {
    return false;
  }

  await feedbackRepository.remove(feedback);
  return true;
};
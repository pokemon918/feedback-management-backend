import { feedbackService } from "@/services";
import { AppDataSource } from "@/setup/datasource";
import { FeedbackEntity, UserEntity } from "@/entities";

describe("Feedback Service", () => {
  let userId: string;

  beforeEach(async () => {
    // Create a test user
    const userRepo = AppDataSource.getRepository(UserEntity);
    const user = await userRepo.save({
      name: "testuser",
      hashedPassword: "hashedpass",
      role: "user"
    });
    userId = user.uuid;
  });

  describe("analyzeSentiment", () => {
    it("should analyze positive sentiment correctly", () => {
      const result = feedbackService.analyzeSentiment("This is great!");
      expect(result.label).toBe("Good");
      expect(result.score).toBeGreaterThan(0);
    });

    it("should analyze negative sentiment correctly", () => {
      const result = feedbackService.analyzeSentiment("This is terrible!");
      expect(result.label).toBe("Bad");
      expect(result.score).toBeLessThan(0);
    });
  });

  describe("createFeedback", () => {
    it("should create feedback successfully", async () => {
      const feedback = await feedbackService.createFeedback("Great product!", userId);
      expect(feedback).toBeDefined();
      expect(feedback.text).toBe("Great product!");
      expect(feedback.userId).toBe(userId);
    });

    it("should not allow multiple feedback from same user", async () => {
      await feedbackService.createFeedback("First feedback", userId);
      const secondFeedback = await feedbackService.createFeedback("Second feedback", userId);
      expect(secondFeedback).toBeNull();
    });
  });

  describe("getFeedback", () => {
    it("should return all feedback", async () => {
      await feedbackService.createFeedback("Test feedback", userId);
      const feedback = await feedbackService.getFeedback();
      expect(feedback).toHaveLength(1);
      expect(feedback[0].text).toBe("Test feedback");
    });
  });

  describe("getUserFeedback", () => {
    it("should return user's feedback", async () => {
      await feedbackService.createFeedback("User feedback", userId);
      const feedback = await feedbackService.getUserFeedback(userId);
      expect(feedback).toHaveLength(1);
      expect(feedback[0].text).toBe("User feedback");
    });
  });
}); 
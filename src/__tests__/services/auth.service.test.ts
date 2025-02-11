import { authService } from "@/services";
import { UserEntity } from "@/entities";
import { AppDataSource } from "@/setup/datasource";
import bcrypt from "bcryptjs";

describe("Auth Service", () => {
  describe("createUser", () => {
    it("should create a new user successfully", async () => {
      const userData = {
        name: "testuser",
        hashedPassword: await bcrypt.hash("password123", 10),
        role: "user"
      };

      const user = await authService.createUser(userData);
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe(userData.role);
    });

    it("should return null for duplicate username", async () => {
      const userData = {
        name: "testuser",
        hashedPassword: await bcrypt.hash("password123", 10),
        role: "user"
      };

      await authService.createUser(userData);
      const duplicateUser = await authService.createUser(userData);
      expect(duplicateUser).toBeNull();
    });
  });

  describe("getUser", () => {
    it("should return user if exists", async () => {
      const userData = {
        name: "testuser",
        hashedPassword: await bcrypt.hash("password123", 10),
        role: "user"
      };

      await authService.createUser(userData);
      const user = await authService.getUser({ name: "testuser" });
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
    });

    it("should return null if user doesn't exist", async () => {
      const user = await authService.getUser({ name: "nonexistent" });
      expect(user).toBeNull();
    });
  });
}); 
/** @format */

import { createDatabase } from "typeorm-extension";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { UserEntity, FeedbackEntity } from "@/entities";
import { AppDataSource } from "./datasource";
import bcrypt from "bcryptjs";
import { authService } from "@/services";
import { CreateUserRequestType } from "@/types";
import "dotenv/config";

export const databaseSetup = async (): Promise<void> => {
  await createDatabase({
    ifNotExist: true,
    options: {
      type: "postgres",
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_DATABASE,
      synchronize: true,
      entities: [UserEntity, FeedbackEntity],
      entitySkipConstructor: true,
      namingStrategy: new SnakeNamingStrategy(),
    },
  });

  await AppDataSource.initialize();

  // Adding admin user when the database setup
  const userRepository = AppDataSource.getRepository(UserEntity);

  const userCount: number = await userRepository.count();
  if (userCount === 0) {
    const adminHashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    const adminUser: CreateUserRequestType = {
      name: process.env.ADMIN_NAME,
      hashedPassword: adminHashedPassword,
      role: "admin",
    };

    authService.createUser(adminUser);
  }
};

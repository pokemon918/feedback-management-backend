/** @format */

import { UserEntity } from "@/entities";
import { AppDataSource } from "@/setup/datasource";
import { CreateUserRequestType } from "@/types";

export const createUser = async ({
  name,
  hashedPassword,
  role,
}: CreateUserRequestType): Promise<UserEntity | null> => {
  const userRepository = AppDataSource.getRepository(UserEntity);

  const existingUser = await userRepository.findOne({ where: { name } });

  if (existingUser) {
    return null;
  }

  const newUser = new UserEntity();
  Object.assign(newUser, { name, hashedPassword, role });

  return await userRepository.save(newUser);
};

export const getUser = async ({ name }): Promise<UserEntity | null> => {
  const userRepository = AppDataSource.getRepository(UserEntity);

  const gettingUser: UserEntity | null = await userRepository.findOne({
    where: { name },
  });
  if (gettingUser) return gettingUser;
  return null;
};

export const getUserById = async (uuid: string): Promise<UserEntity | null> => {
  const userRepository = AppDataSource.getRepository(UserEntity);
  
  const user = await userRepository.findOne({
    where: { uuid }
  });
  
  return user;
};

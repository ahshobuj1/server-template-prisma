import {UserRole} from '../../../../prisma/generated/enums';
import {prisma} from '../../lib';

const createAdmin = async (data: any) => {
  // console.log(data);

  const userData = {
    email: data.admin.email,
    password: data.password,
    role: UserRole.ADMIN,
  };

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: data.admin.email,
    },
  });

  if (isUserExist) {
    return {message: 'User already exists with this email!'};
  }

  const result = await prisma.$transaction(async (TransactionClient) => {
    const createUser = await TransactionClient.user.create({
      data: userData,
    });

    const createAdmin = await TransactionClient.admin.create({
      data: data.admin,
    });

    return {createUser, createAdmin};
  });

  return result;
};

export const userService = {
  createAdmin,
};

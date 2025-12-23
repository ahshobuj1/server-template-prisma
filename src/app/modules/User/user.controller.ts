import express from 'express';
import {userService} from './user.service';

const createAdmin = async (req: express.Request, res: express.Response) => {
  // console.log(req.body);
  const result = await userService.createAdmin(req.body);
  console.log(result);

  return res.json(result);
};

export const userController = {
  createAdmin,
};

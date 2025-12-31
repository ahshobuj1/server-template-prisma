import express from 'express';
import {userService} from './user.service';

const createAdmin = async (req: express.Request, res: express.Response) => {
  const result = await userService.createAdmin(req.body);
  return res.json(result);
};

export const userController = {
  createAdmin,
};

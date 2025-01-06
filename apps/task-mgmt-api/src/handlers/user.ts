import { NextFunction, Request, Response } from 'express';
import prisma from '../db';
import { comparePasswords, hashPassword } from '../modules/auth';

import { createJWT } from '../modules/auth';

export const createNewUser = async (req: Request, res: Response) => {
  const hash = await hashPassword(req.body.password);

  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      password: hash,
    },
  });

  const token = createJWT(user);
  res.json({ token });
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (!user) {
      res.status(401);
      res.send('Invalid username or password');
      return;
    }

    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      res.status(401);
      res.send('Invalid username or password');
      return;
    }

    const token = createJWT(user);
    res.json({ token });
  } catch (error: any) {
    error.type = 'input';
    next(error);
  }
};

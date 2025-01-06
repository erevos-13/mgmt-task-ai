import { NextFunction, Request, Response } from 'express';
import prisma from '../db';
import { comparePasswords, hashPassword } from '../modules/auth';

import { createJWT } from '../modules/auth';
import { uploadImage } from '../modules/cloudinary';
import { File } from 'buffer';

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
    const { password, ...userData } = user;
    res.json({ token, user: userData });
  } catch (error: any) {
    error.type = 'input';
    next(error);
  }
};

export const updateProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email } = req.body;
    // Access uploaded file
    const file = req.file;

    // If file was uploaded
    if (file) {
      console.log('File details:', {
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      });
    }
    debugger;
    let imageUrlUploaded;
    if (req.file) {
      imageUrlUploaded = await uploadImage(req.file);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        ...(imageUrlUploaded && { profileImage: imageUrlUploaded }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImage: true,
        imagePublicId: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

import { Request, Response } from 'express';
import prisma from '../db';
import { HttpStatus } from '../utils/status-codes';

export const createTask = async (req: Request, res: Response) => {
  try {
    const getUserAssigned = await prisma.user.findFirst({
      where: { email: req.body.assignedTo.email },
    });
    if (!getUserAssigned) {
      return res
        .status(HttpStatus.BadRequest)
        .json({ message: 'User not found to assign task' });
    }
    const task = await prisma.task.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        assignedTo: { connect: { id: getUserAssigned?.id } },
      },
    });
    res.json({ task });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatus.InternalServerError)
      .json({ message: 'Internal server error' });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany();
  res.json({ tasks });
};

export const deleteTask = async (req: Request, res: Response) => {
  const task = await prisma.task.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ task });
};

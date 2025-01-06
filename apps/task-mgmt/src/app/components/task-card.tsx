import { FC, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../models/task';
import { TaskModal } from './task-modal';
import { priorityColors } from '../utils/colors';

export type TaskCardProps = {
  task: Task;
  index: number;
  onUpdate: (updatedTask: Task) => void;
};

export const TaskCard: FC<TaskCardProps> = ({ task, index, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setIsModalOpen(true)}
            className={`bg-white dark:bg-gray-700 p-4 rounded-lg shadow mb-3 cursor-pointer hover:ring-2 hover:ring-indigo-500/50 ${
              snapshot.isDragging ? 'opacity-75 ring-2 ring-indigo-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-900 dark:text-white font-medium">
                {task.title}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  priorityColors[task.priority]
                }`}
              >
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {task.description}
              </p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {task.assignedTo.email}
              </span>
            </div>
          </div>
        )}
      </Draggable>

      <TaskModal
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onUpdate}
      />
    </>
  );
};

import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { FC, useState } from 'react';
import { Task } from '../../models/task';
import { TaskCard } from '../../components/task-card';
import { TaskModal } from '../../components/task-modal';

const Column: FC<{
  title: string;
  tasks: Task[];
  id: string;
  onTaskUpdate: (task: Task) => void;
}> = ({ title, tasks, id, onTaskUpdate }) => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
      {title}
      <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-2 py-1 rounded">
        {tasks.length}
      </span>
    </h2>
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`space-y-3 min-h-[200px] transition-colors duration-200 ${
            snapshot.isDraggingOver
              ? 'bg-gray-200 dark:bg-gray-700'
              : 'bg-transparent'
          } rounded-lg p-2`}
        >
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onUpdate={onTaskUpdate}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

const Home: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Implement Authentication',
      description: 'Set up JWT authentication for the API',
      priority: 'HIGH',
      status: 'TODO',
      assignedTo: { email: 'john@example.com' },
    },
    {
      id: 2,
      title: 'Design Dashboard',
      description: 'Create wireframes for the main dashboard',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assignedTo: { email: 'jane@example.com' },
    },
    {
      id: 3,
      title: 'User Testing',
      description: 'Conduct user testing sessions',
      priority: 'LOW',
      status: 'DONE',
      assignedTo: { email: 'test@example.com' },
    },
  ]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const taskIndex = tasks.findIndex((t) => t.id.toString() === draggableId);
    const [movedTask] = updatedTasks.splice(taskIndex, 1);

    movedTask.status = destination.droppableId as Task['status'];

    const insertIndex =
      updatedTasks.findIndex(
        (task) => task.status === destination.droppableId
      ) + destination.index;

    updatedTasks.splice(insertIndex, 0, movedTask);

    setTasks(updatedTasks);
  };

  const getColumnTasks = (status: Task['status']) =>
    tasks.filter((task) => task.status === status);

  const handleTaskSave = (newTask: Task) => {
    if (newTask.id === 0) {
      // This is a new task
      const maxId = Math.max(0, ...tasks.map((task) => task.id));
      setTasks([...tasks, { ...newTask, id: maxId + 1 }]);
    } else {
      // This is an existing task being updated
      setTasks(tasks.map((task) => (task.id === newTask.id ? newTask : task)));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Task Board
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column
            title="To Do"
            tasks={getColumnTasks('TODO')}
            id="TODO"
            onTaskUpdate={handleTaskSave}
          />
          <Column
            title="In Progress"
            tasks={getColumnTasks('IN_PROGRESS')}
            id="IN_PROGRESS"
            onTaskUpdate={handleTaskSave}
          />
          <Column
            title="Done"
            tasks={getColumnTasks('DONE')}
            id="DONE"
            onTaskUpdate={handleTaskSave}
          />
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default Home;

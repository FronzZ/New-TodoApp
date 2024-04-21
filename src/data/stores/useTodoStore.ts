import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { formatDistanceToNowStrict } from 'date-fns';
import { ru } from 'date-fns/locale';

export interface ITodoTask {
   id: string;
   completed: boolean;
   description: string;
   timer: number;
   isPlay: boolean;
   created: number;
}

interface ITaskData {
   description: string;
   timer: number;
}

interface IFilter {
   name: string;
   selected: boolean;
}

interface IStateStore {
   todoTasks: ITodoTask[];
   filters: IFilter[];
   actualFilter: string;
   createTask: (taskData: ITaskData) => void;
   deleteTask: (id: string) => void;
   deleteCompletedTasks: () => void;
   completedTask: (id: string, completed: boolean) => void;
   editTask: (id: string, description: string) => void;
   filterClick: (filterName: string) => void;
   timerToggle: (id: string) => void;
   setTodoTasks: (newTodoTasks: ITodoTask[]) => void;
   formatDateTime: (created: number) => string;
}

export const stateStore = create<IStateStore>()(
   persist(
      (set) => ({
         todoTasks: [] as ITodoTask[],
         actualFilter: 'All',
         filters: [
            { name: 'All', selected: true },
            { name: 'Active', selected: false },
            { name: 'Complited', selected: false },
         ],

         // Обновление массива с задачами
         setTodoTasks: (newTodoTasks: ITodoTask[]) => set({ todoTasks: newTodoTasks }),

         // Создание задачи
         createTask: (taskData: ITaskData) => {
            const newTask: ITodoTask = {
               id: uuidv4(),
               completed: false,
               description: taskData.description,
               timer: taskData.timer,
               isPlay: false,
               created: Date.now(),
            };
            set((state) => ({
               todoTasks: [...state.todoTasks, newTask],
            }));
         },

         // Удаление задачи
         deleteTask: (id) => {
            set((state) => ({
               todoTasks: [...state.todoTasks.filter((task) => task.id !== id)],
            }));
         },

         // Удаление всех выполненных задач
         deleteCompletedTasks: () => {
            set((state) => ({ todoTasks: [...state.todoTasks.filter((task) => !task.completed)] }));
         },

         // Работа с фильтрами (выбираем нужный фильтр)
         filterClick: (filterName) => {
            set((state) => ({
               filters: [...state.filters.map((filter) => ({ ...filter, selected: filterName === filter.name }))],
               actualFilter: filterName,
            }));
         },

         // Меняем статус задачи (выполена или не выполнена) и если выполненна обнуляем таймер.
         completedTask: (id, completed) => {
            set((state) => ({
               todoTasks: [
                  ...state.todoTasks.map((task) =>
                     task.id === id ? { ...task, completed: !task.completed, timer: completed ? 0 : task.timer } : task,
                  ),
               ],
            }));
         },

         // Редактируем задачу

         editTask: (id, description) => {
            set((state) => ({
               todoTasks: [...state.todoTasks.map((task) => (task.id === id ? { ...task, description } : task))],
            }));
         },

         // Переключение таймера
         timerToggle: (id) => {
            set((state) => ({
               todoTasks: [
                  ...state.todoTasks.map((task) => ({ ...task, isPlay: task.id === id ? !task.isPlay : task.isPlay })),
               ],
            }));
         },

         // Шаблон, высчитываем когда была создана задача
         formatDateTime: (created) => {
            return `создана ${formatDistanceToNowStrict(new Date(created), {
               addSuffix: true,
               locale: ru,
            })}`;
         },
      }),
      {
         name: 'todo-store',
         storage: createJSONStorage(() => sessionStorage),
         version: 0,
      },
   ),
);

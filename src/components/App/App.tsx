import { useEffect } from 'react';
import { clearInterval, setInterval } from 'worker-timers';

import Header from '@/Header/Header';
import NewTaskForm from '@/NewTaskForm/NewTaskForm';
import TaskList from '@/TaskList/TaskList';
import Footer from '@/Footer/Footer';

import '@/App/App.css';
import { stateStore } from '../../data/stores/useTodoStore';

export default function App() {
   const [todoTasks, setTodoTasks] = stateStore((state) => [state.todoTasks, state.setTodoTasks]);

   useEffect(() => {
      const intervals: number[] = [];
      todoTasks.forEach((task) => {
         if (task.isPlay && !task.completed) {
            const intervalId = setInterval(() => {
               setTodoTasks([
                  ...todoTasks.map((t) =>
                     t.isPlay && !t.completed
                        ? {
                             ...t,
                             timer: t.timer >= 1 ? t.timer - 1 : 0,
                             completed: t.timer === 0 ? true : t.completed,
                             isPlay: t.timer > 0,
                          }
                        : t,
                  ),
               ]);
            }, 1000);
            intervals.push(intervalId);
         }
      });

      return () => intervals.forEach((intervalId) => clearInterval(intervalId));
   }, [todoTasks, setTodoTasks]);

   return (
      <section className="todoapp">
         <Header />
         <NewTaskForm />
         <section className="main">
            <TaskList />
            <Footer />
         </section>
      </section>
   );
}

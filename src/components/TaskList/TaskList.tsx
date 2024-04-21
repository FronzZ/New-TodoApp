import Task from '@/Task/Task';

import '@/TaskList/TaskList.css';
import { stateStore } from '../../data/stores/useTodoStore';

export default function TaskList() {
   const [todoTasks, actualFilter] = stateStore((state) => [state.todoTasks, state.actualFilter]);
   return (
      <ul className="todo-list">
         {todoTasks
            .filter((task) => {
               switch (actualFilter) {
                  case 'Active':
                     return !task.completed;
                  case 'Complited':
                     return task.completed;
                  default:
                     return true;
               }
            })
            .map((task) => (
               <Task
                  key={task.id}
                  id={task.id}
                  completed={task.completed}
                  description={task.description}
                  timer={task.timer}
                  isPlay={task.isPlay}
                  created={task.created}
               />
            ))}
      </ul>
   );
}

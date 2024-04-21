import TasksFilter from '@/TasksFilter/TasksFilter';

import { stateStore } from '../../data/stores/useTodoStore';
import '@/Footer/Footer.css';

export default function Footer() {
   const [todoTasks, deleteCompletedTasks] = stateStore((state) => [
      state.todoTasks.filter((task) => !task.completed).length,
      state.deleteCompletedTasks,
   ]);
   return (
      <footer className="footer">
         <span className="toto-count">{todoTasks} items left</span>
         <TasksFilter />
         <button type="button" className="clear-completed" onClick={deleteCompletedTasks}>
            Clear completed
         </button>
      </footer>
   );
}

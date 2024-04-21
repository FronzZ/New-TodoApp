import { stateStore } from '../../data/stores/useTodoStore';
import '@/TasksFilter/TasksFilter.css';

export default function TasksFilter() {
   const [filters, filterClick] = stateStore((state) => [state.filters, state.filterClick]);

   return (
      <ul className="filters">
         {filters.map((filter) => (
            <li key={filter.name}>
               <button
                  type="button"
                  className={filter.selected ? 'selected' : 'filter'}
                  onClick={() => filterClick(filter.name)}
               >
                  {filter.name}
               </button>
            </li>
         ))}
      </ul>
   );
}

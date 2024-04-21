import { useState, useEffect, useRef } from 'react';

import '@/Task/Task.css';
import { stateStore, ITodoTask } from '../../data/stores/useTodoStore';

export default function Task({ id, completed, description, timer, created }: ITodoTask) {
   const [deleteTask, completedTask, editTask, timerToggle, formatDateTime] = stateStore((state) => [
      state.deleteTask,
      state.completedTask,
      state.editTask,
      state.timerToggle,
      state.formatDateTime,
   ]);

   const [editInput, setEditInput] = useState(description);
   const [clickEdit, setClickEdit] = useState(false);
   const [createdDate, setCreatedDate] = useState(() => {
      const distance = formatDateTime(created);
      return distance === 'создана 0 секунд назад' ? 'создана только что' : distance;
   });
   const taskRef = useRef<HTMLLIElement>(null);
   const editInputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      const handleClickOutsideEdit = (event: MouseEvent) => {
         if (taskRef.current && !taskRef.current.contains(event.target as Node)) {
            setClickEdit((prev) => !prev);
            setEditInput(description);
         }
      };

      if (clickEdit) {
         document.addEventListener('click', handleClickOutsideEdit);
         if (editInputRef.current) {
            editInputRef.current.focus();
         }
      }

      return () => document.removeEventListener('click', handleClickOutsideEdit);
   }, [clickEdit, description]);

   useEffect(() => {
      const intervalId = setInterval(() => {
         const distance = formatDateTime(created);
         setCreatedDate(distance);
      }, 5000);

      return () => clearInterval(intervalId);
   }, [created, formatDateTime]);

   const handleClickEdit = () => {
      setClickEdit((prev) => !prev);
   };

   const formatTimerTime = (totalSeconds: number): string => {
      const minutes = Math.floor(totalSeconds / 60)
         .toString()
         .padStart(2, '0');
      const seconds = (totalSeconds - Number(minutes) * 60).toString().padStart(2, '0');
      return `${minutes} : ${seconds}`;
   };

   let className = completed ? 'completed' : 'active';
   if (clickEdit) {
      className = 'editing';
   }

   return (
      <li className={className} ref={taskRef}>
         <div className="view">
            <input
               type="checkbox"
               className="toggle"
               checked={completed}
               onChange={() => completedTask(id, !completed)}
            />
            <label>
               <span className="title">{description}</span>
               <span className="description">
                  <div>
                     <button
                        type="button"
                        className="icon icon-play"
                        aria-label="timerPlay"
                        onClick={() => timerToggle(id)}
                     />
                     <button
                        type="button"
                        className="icon icon-pause"
                        aria-label="timerPause"
                        onClick={() => timerToggle(id)}
                     />
                     {formatTimerTime(timer)}
                  </div>
               </span>
               <span className="created">{createdDate}</span>
            </label>
            <button type="button" aria-label="Edit task" className="icon icon-edit" onClick={handleClickEdit} />
            <button
               type="button"
               aria-label="Delete task"
               className="icon icon-destroy"
               onClick={() => deleteTask(id)}
            />
         </div>
         {clickEdit && (
            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  handleClickEdit();
                  editTask(id, editInput);
               }}
            >
               <input
                  type="text"
                  className="edit"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.code === 'Escape') {
                        handleClickEdit();
                        setEditInput(description);
                     }
                  }}
                  ref={editInputRef}
               />
            </form>
         )}
      </li>
   );
}

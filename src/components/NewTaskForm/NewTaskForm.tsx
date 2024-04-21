import { useState } from 'react';

import { stateStore } from '../../data/stores/useTodoStore';
import '@/NewTaskForm/NewTaskForm.css';

export default function NewTaskForm() {
   const [createTask] = stateStore((state) => [state.createTask]);
   const [inputValue, setInputValue] = useState('');
   const [timer, setTimer] = useState({ minutes: '', seconds: '' });

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
   };

   const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      let onlyNumbers = value.replace(/[^0-9]/g, '');
      if (+onlyNumbers > 59) {
         onlyNumbers = String(59);
      }
      setTimer((prevTimer) => ({ ...prevTimer, [name]: onlyNumbers }));
   };

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputValue.trim() !== '') {
         createTask({
            description: inputValue,
            timer: Number(timer.minutes) * 60 + Number(timer.seconds),
         });
         setInputValue('');
         setTimer({ minutes: '', seconds: '' });
      }
   };

   return (
      <form className="new-todo-form" onSubmit={handleSubmit}>
         <button type="submit" hidden aria-hidden />
         <input
            id="description"
            name="description"
            type="text"
            className="new-todo"
            placeholder="What needs to be done?"
            onChange={handleInputChange}
            value={inputValue}
         />
         <input
            name="minutes"
            className="new-todo-form__timer"
            placeholder="Min"
            onChange={handleTimerChange}
            value={timer.minutes}
         />
         <input
            name="seconds"
            className="new-todo-form__timer"
            placeholder="Sec"
            onChange={handleTimerChange}
            value={timer.seconds}
         />
      </form>
   );
}

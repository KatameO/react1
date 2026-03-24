import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todo_lab_data');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('todo_lab_data', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask = {
      id: Date.now(),
      text: inputValue,
      isCompleted: false,
      createdAt: new Date().toLocaleString()
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.isCompleted));
  };

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const total = tasks.length;
  const completed = tasks.filter(t => t.isCompleted).length;

  return (
    <div className="container">
      <h1>Менеджер задач</h1>

      {/* СТАТИСТИКА */}
      <div className="stats">
        <span>Всего: {total}</span>
        <span>Выполнено: {completed}</span>
        <span>Активно: {total - completed}</span>
      </div>

      {/* ПОИСК */}
      <input 
        className="search-input"
        placeholder="Поиск по задачам" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* ФОРМА ДОБАВЛЕНИЯ*/}
      <form onSubmit={addTask} className="task-form">
        <input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Напишите задачу"
        />
        <button type="submit">Добавить</button>
      </form>

      {/* УДАЛЕНИЕ ВЫПОЛНЕННЫХ */}
      {completed > 0 && (
        <button className="clear-btn" onClick={clearCompleted}>
           Очистить выполненные
        </button>
      )}

      {/* СПИСОК */}
      <div className="task-list">
        {filteredTasks.map(task => (
          <div 
            key={task.id} 
            className={`task-item ${task.isCompleted ? 'completed' : ''}`}
            onClick={() => toggleTask(task.id)}
          >
            <div className="task-body">
              <span className="icon">{task.isCompleted ? '✓' : 'x'}</span>
              <div className="content-wrapper">
                <span className="task-text">{task.text}</span>
                <span className="task-date">Создано: {task.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && <p className="empty">Задач пока нет</p>}
      </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [clients, setClients] = useState([]);
  const [input, setInput] = useState('');
  const [clientInput, setClientInput] = useState('');
  const [date, setDate] = useState(new Date());
  const [expanded, setExpanded] = useState({});
  const [colorPopup, setColorPopup] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTask, setEditTask] = useState({});

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    const savedClients = JSON.parse(localStorage.getItem('clients'));
    if (savedTodos) {
      console.log('Loaded todos from localStorage:', savedTodos);
      setTodos(savedTodos);
    } else {
      console.log('No todos found in localStorage');
    }
    if (savedClients) {
      console.log('Loaded clients from localStorage:', savedClients);
      setClients(savedClients);
    } else {
      console.log('No clients found in localStorage');
    }
  }, []);

  useEffect(() => {
    console.log('Saving todos to localStorage:', todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    console.log('Saving clients to localStorage:', clients);
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const addTodo = () => {
    if (input.trim() !== '') {
      const newTodo = { text: input, completed: false, date: date, notes: '', color: 'green', client: selectedClient, attachments: [], comments: [], history: [] };
      setTodos([...todos, newTodo]);
      setInput('');
      console.log('Added new todo:', newTodo);
    }
  };

  const addClient = () => {
    if (clientInput.trim() !== '') {
      setClients([...clients, clientInput]);
      setClientInput('');
      console.log('Added new client:', clientInput);
    }
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
    console.log('Toggled todo at index:', index);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
    console.log('Deleted todo at index:', index);
  };

  const toggleNotes = (index) => {
    setExpanded({ ...expanded, [index]: !expanded[index] });
    console.log('Toggled notes for todo at index:', index);
  };

  const updateNotes = (index, notes) => {
    const newTodos = [...todos];
    newTodos[index].notes = notes;
    setTodos(newTodos);
    console.log('Updated notes for todo at index:', index, 'notes:', notes);
  };

  const updateColor = (index, color) => {
    const newTodos = [...todos];
    newTodos[index].color = color;
    setTodos(newTodos);
    setColorPopup(null);
    console.log('Updated color for todo at index:', index, 'color:', color);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const task = todos.find(todo => new Date(todo.date).toDateString() === date.toDateString());
      if (task) {
        return `bg-${task.color}-500`;
      }
      return '';
    }
  };

  const colors = ['red', 'orange', 'green'];

  const openTaskDetail = (index) => {
    setSelectedTask(index);
    setEditMode(false);
    setEditTask({});
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
    setEditMode(false);
    setEditTask({});
  };

  const editTaskDetail = (index) => {
    setEditMode(true);
    setEditTask({ ...todos[index] });
  };

  const saveTaskDetail = () => {
    const newTodos = [...todos];
    newTodos[selectedTask] = editTask;
    setTodos(newTodos);
    setEditMode(false);
    setEditTask({});
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="flex w-full max-w-4xl mb-8">
        <div className="w-1/3 pr-4">
          <h1 className="text-2xl font-bold mb-4">Calendar</h1>
          <Calendar onChange={setDate} value={date} tileClassName={tileClassName} className={`react-calendar ${darkMode ? 'react-calendar-dark' : ''}`} />
        </div>
        <div className="w-2/3 pl-4">
          <h1 className="text-2xl font-bold mb-4">Todo List</h1>
          <div className="flex mb-4">
            <input
              type="text"
              className={`flex-1 border border-gray-300 rounded-l px-4 py-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new todo"
            />
            <select
              className={`border border-gray-300 px-4 py-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="">Select Client</option>
              {clients.map((client, index) => (
                <option key={index} value={client}>{client}</option>
              ))}
            </select>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-r"
              onClick={addTodo}
            >
              Add
            </button>
          </div>
          <ul>
            {todos.map((todo, index) => (
              <li
                key={index}
                className="flex flex-col p-2 border-b border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex-1 ${todo.completed ? 'line-through' : ''}`}
                    onClick={() => openTaskDetail(index)}
                  >
                    {todo.text} - {todo.date.toDateString()}
                    {todo.notes && <span className="ml-2">✏️</span>}
                    {todo.client && <span className="ml-2">👤 {todo.client}</span>}
                  </span>
                  <div className="flex items-center">
                    <div className="relative">
                      <div
                        className={`w-4 h-4 cursor-pointer`}
                        style={{ backgroundColor: todo.color }}
                        onClick={() => setColorPopup(index)}
                      >
                        {todo.color === 'red' && '🚩'}
                        {todo.color === 'orange' && '🚩'}
                        {todo.color === 'green' && '🚩'}
                      </div>
                      {colorPopup === index && (
                        <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg">
                          {colors.map(color => (
                            <div
                              key={color}
                              className={`w-6 h-6 cursor-pointer`}
                              style={{ backgroundColor: color }}
                              onClick={() => updateColor(index, color)}
                            >
                              {color === 'red' && '🚩'}
                              {color === 'orange' && '🚩'}
                              {color === 'green' && '🚩'}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      className="text-blue-500 ml-2"
                      onClick={() => toggleNotes(index)}
                    >
                      {expanded[index] ? 'Hide Notes' : 'Show Notes'}
                    </button>
                    <button
                      className="text-red-500 ml-2"
                      onClick={() => deleteTodo(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {expanded[index] && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg w-1/2 text-white`}>
                      <h2 className="text-xl font-bold mb-4">Notes</h2>
                      <textarea
                        className={`w-full h-40 border border-gray-300 rounded p-2 bg-gray-700 text-white`}
                        value={todo.notes}
                        onChange={(e) => updateNotes(index, e.target.value)}
                        placeholder="Add notes..."
                      />
                      <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => toggleNotes(index)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Clients</h1>
        <div className="flex mb-4">
          <input
            type="text"
            className={`flex-1 border border-gray-300 rounded-l px-4 py-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            value={clientInput}
            onChange={(e) => setClientInput(e.target.value)}
            placeholder="Add a new client"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            onClick={addClient}
          >
            Add Client
          </button>
        </div>
        <ul>
          {clients.map((client, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 border-b border-gray-200"
            >
              <span>{client}</span>
              <button
                className="text-red-500"
                onClick={() => setClients(clients.filter((_, i) => i !== index))}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="absolute top-4 right-4 bg-gray-700 text-white px-4 py-2 rounded"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      {selectedTask !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`bg-gray-800 p-6 rounded-lg shadow-lg w-1/2 text-white`}>
            <h2 className="text-xl font-bold mb-4">Task Detail</h2>
            {editMode ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold">Title</h3>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 bg-gray-700 text-white"
                    value={editTask.text}
                    onChange={(e) => setEditTask({ ...editTask, text: e.target.value })}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Description</h3>
                  <textarea
                    className="w-full h-40 border border-gray-300 rounded p-2 bg-gray-700 text-white"
                    value={editTask.notes}
                    onChange={(e) => setEditTask({ ...editTask, notes: e.target.value })}
                    placeholder="Add notes..."
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Due Date</h3>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded p-2 bg-gray-700 text-white"
                    value={editTask.date}
                    onChange={(e) => setEditTask({ ...editTask, date: e.target.value })}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Priority</h3>
                  <select
                    className="w-full border border-gray-300 rounded p-2 bg-gray-700 text-white"
                    value={editTask.color}
                    onChange={(e) => setEditTask({ ...editTask, color: e.target.value })}
                  >
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Client</h3>
                  <select
                    className="w-full border border-gray-300 rounded p-2 bg-gray-700 text-white"
                    value={editTask.client}
                    onChange={(e) => setEditTask({ ...editTask, client: e.target.value })}
                  >
                    <option value="">Select Client</option>
                    {clients.map((client, index) => (
                      <option key={index} value={client}>{client}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={saveTaskDetail}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold">Title</h3>
                  <p>{todos[selectedTask].text}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p>{todos[selectedTask].notes}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Due Date</h3>
                  <p>{todos[selectedTask].date.toDateString()}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Priority</h3>
                  <p>{todos[selectedTask].color}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Client</h3>
                  <p>{todos[selectedTask].client}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Attachments</h3>
                  <ul>
                    {todos[selectedTask].attachments.map((attachment, index) => (
                      <li key={index}>{attachment}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Comments</h3>
                  <ul>
                    {todos[selectedTask].comments.map((comment, index) => (
                      <li key={index}>{comment}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">History</h3>
                  <ul>
                    {todos[selectedTask].history.map((history, index) => (
                      <li key={index}>{history}</li>
                    ))}
                  </ul>
                </div>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => editTaskDetail(selectedTask)}
                >
                  Edit
                </button>
              </>
            )}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={closeTaskDetail}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

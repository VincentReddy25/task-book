import { useEffect, useState } from "react";
import '../App.css'

const TASKS_STORAGE_KEY = "taskbook.tasks";

function getSavedTasks() {
  try {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!savedTasks) return [];

    const tasks = JSON.parse(savedTasks);
    if (!Array.isArray(tasks) || !tasks.every((task) => typeof task === "string")) {
      throw new Error("Saved tasks must be an array of strings.");
    }

    return tasks;
  } catch (error) {
    console.error("Unable to load saved tasks from local storage.", error);
    return [];
  }
}

export default function Dashboard() {
  const [taskData, setTaskData] = useState(getSavedTasks);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(taskData));
    } catch (error) {
      console.error("Unable to save tasks to local storage.", error);
    }
  }, [taskData]);

  const addTask = (e) => {
    e.preventDefault();

    let task = e.target.userInput.value.trim();

    if (task) {
      setTaskData((prev) => [...prev, task]);
      e.target.userInput.value = "";
    }
  };

  const removeTask = (indexToRemove) => {
    setTaskData((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const editTask = (task, index) => {
    setEditIndex(index);
    setEditValue(task);
  };

  const saveEdit = (e, index) => {
    e.preventDefault();
    const updated = [...taskData];
    updated[index] = editValue;
    setTaskData(updated);
    setEditIndex(null);
    setEditValue("");
  };

  return (
    <>

      <form onSubmit={addTask} className="task-form">
        <input type="text" name="userInput" />
        <input type="submit" value="Add Task" />
      </form>

      <ol className="task-list">
        {taskData.map((task, index) => (
          <li key={index}>
            {editIndex === index ? (
              <form onSubmit={(e) => saveEdit(e, index)}>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button type="submit">Save</button>
              </form>
            ) : (
              <>
              <div className="tasks">
                <input type="text" value={task} disabled />
                <button onClick={() => editTask(task, index)}>Edit</button>
                <button onClick={() => removeTask(index)}>Remove</button>
              </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
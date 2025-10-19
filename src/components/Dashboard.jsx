import { useState } from "react";

export default function Dashboard() {
  const [taskData, setTaskData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

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
      <div>Dashboard</div>

      <form onSubmit={addTask}>
        <input type="text" name="userInput" />
        <input type="submit" />
      </form>

      <ol>
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
                <input type="text" value={task} disabled />
                <button onClick={() => editTask(task, index)}>Edit</button>
                <button onClick={() => removeTask(index)}>Remove</button>
              </>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
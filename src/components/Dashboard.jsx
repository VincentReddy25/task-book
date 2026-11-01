import { useEffect, useState } from "react";
import '../App.css'

const TASKS_STORAGE_KEY = "taskbook.tasks";

function createTask(text, completed = false) {
  return {
    id: `${Date.now()}-${Math.random()}`,
    text,
    completed,
  };
}

function getSavedTasks() {
  try {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!savedTasks) return [];

    const tasks = JSON.parse(savedTasks);
    if (!Array.isArray(tasks)) {
      throw new Error("Saved tasks must be an array.");
    }

    return tasks.map((task) => {
      if (typeof task === "string") {
        return createTask(task);
      }

      if (
        task &&
        typeof task.id === "string" &&
        typeof task.text === "string" &&
        typeof task.completed === "boolean"
      ) {
        return task;
      }

      throw new Error("Saved task data is invalid.");
    });
  } catch (error) {
    console.error("Unable to load saved tasks from local storage.", error);
    return [];
  }
}

export default function Dashboard() {
  const [taskData, setTaskData] = useState(getSavedTasks);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [expandedTaskIds, setExpandedTaskIds] = useState(() => new Set());
  const [openSections, setOpenSections] = useState({
    active: true,
    completed: true,
  });

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(taskData));
    } catch (error) {
      console.error("Unable to save tasks to local storage.", error);
    }
  }, [taskData]);

  const addTask = (e) => {
    e.preventDefault();

    const task = e.target.userInput.value.trim();

    if (task) {
      setTaskData((prev) => [...prev, createTask(task)]);
      e.target.userInput.value = "";
    }
  };

  const markTaskDone = (taskId) => {
    setTaskData((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task,
      ),
    );
  };

  const reassignTask = (taskId) => {
    setTaskData((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: false } : task,
      ),
    );
  };

  const deleteTask = (taskId) => {
    setTaskData((prev) => prev.filter((task) => task.id !== taskId));
  };

  const editTask = (task) => {
    setEditIndex(task.id);
    setEditValue(task.text);
  };

  const saveEdit = (e, taskId) => {
    e.preventDefault();

    const updatedText = editValue.trim();
    if (updatedText) {
      setTaskData((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, text: updatedText } : task,
        ),
      );
    }

    setEditIndex(null);
    setEditValue("");
  };

  const toggleTaskText = (taskId) => {
    setExpandedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeTasks = taskData.filter((task) => !task.completed);
  const completedTasks = taskData.filter((task) => task.completed);

  const renderTaskList = (tasks, completed = false) => (
    <ol className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          {!completed && editIndex === task.id ? (
            <form onSubmit={(e) => saveEdit(e, task.id)}>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                aria-label="Edit task"
                autoFocus
              />
              <button type="submit">Save</button>
            </form>
          ) : (
            <div className={`tasks${completed ? " is-completed" : ""}`}>
              <div className="task-copy">
                <span>
                  {task.text.length > 120 && !expandedTaskIds.has(task.id)
                    ? `${task.text.slice(0, 120).trimEnd()}...`
                    : task.text}
                </span>
                {task.text.length > 120 && (
                  <button
                    type="button"
                    className="task-read-more"
                    aria-expanded={expandedTaskIds.has(task.id)}
                    onClick={() => toggleTaskText(task.id)}
                  >
                    {expandedTaskIds.has(task.id) ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
              {completed ? (
                <>
                  <button type="button" onClick={() => reassignTask(task.id)}>
                    Reassign
                  </button>
                  <button
                    type="button"
                    className="task-action-delete"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => editTask(task)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="task-action-done"
                    onClick={() => markTaskDone(task.id)}
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          )}
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <form onSubmit={addTask} className="task-form">
        <input type="text" name="userInput" placeholder="What needs to get done?" />
        <input type="submit" value="Add Task" />
      </form>

      <div className="task-sections">
        <section className="task-section" aria-labelledby="active-tasks-heading">
          <button
            type="button"
            className="task-section-toggle"
            id="active-tasks-heading"
            aria-expanded={openSections.active}
            aria-controls="active-tasks-panel"
            onClick={() => toggleSection("active")}
          >
            <span>Uncompleted <span className="task-count">{activeTasks.length}</span></span>
            <span className="accordion-icon" aria-hidden="true">{openSections.active ? "−" : "+"}</span>
          </button>
          <div
            id="active-tasks-panel"
            className="task-section-panel"
            hidden={!openSections.active}
          >
            {activeTasks.length > 0 ? renderTaskList(activeTasks) : (
              <p className="empty-state">No uncompleted tasks.</p>
            )}
          </div>
        </section>

        <section className="task-section" aria-labelledby="completed-tasks-heading">
          <button
            type="button"
            className="task-section-toggle"
            id="completed-tasks-heading"
            aria-expanded={openSections.completed}
            aria-controls="completed-tasks-panel"
            onClick={() => toggleSection("completed")}
          >
            <span>Completed <span className="task-count">{completedTasks.length}</span></span>
            <span className="accordion-icon" aria-hidden="true">{openSections.completed ? "−" : "+"}</span>
          </button>
          <div
            id="completed-tasks-panel"
            className="task-section-panel"
            hidden={!openSections.completed}
          >
            {completedTasks.length > 0 ? renderTaskList(completedTasks, true) : (
              <p className="empty-state">Completed tasks will appear here.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
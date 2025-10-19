import { useState } from "react"

export default function Dashboard() {

  
  const [taskData, setTaskData] = useState([])
  
  const addTask = (e) => {
    event.preventDefault()
    
    let task = e.target.userInput
    
    setTaskData(prev => [...prev, task.value])

  }


  return (
    <>
      <div>Dashboard</div>

      <form action="" onSubmit={addTask}>
        <input type="text" name="userInput" />
        <input type="submit" />
      </form>


      <ul>
        {taskData.map((key, index) => (
          <li>{key}</li>
        ))}
      </ul>
    </>
  )
}

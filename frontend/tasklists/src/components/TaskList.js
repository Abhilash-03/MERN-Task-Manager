import { Link } from "react-router-dom"

function TaskList({allTasks, handleGetTask}) {
  return (
    <>
      {
        allTasks.map(item => (
            <li key={item._id} className="listing border border-primary w-100 mb-3 d-flex justify-content-between align-items-center fw-bold p-3 rounded me-5"><span><i className={item.completed === false? 'd-none': "d-inline fa-solid fa-square-check fs-5"}></i> {item.name}</span> 
            <span>
               <span><Link className="btn btn-dark btn-sm me-2" to={`/tasks/id=${item._id}`} onClick={()=>handleGetTask(item._id)}><i className="fa-solid fa-eye"></i></Link></span>
          
               </span>
            </li>
        ))
      }
      </>
   
  )
}

export default TaskList

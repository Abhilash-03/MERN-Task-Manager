function EditTask({ taskDetails, handleUpdate, editTask, setEditTask, completed, setCompleted, msg }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-3">
      <h5 className="text-success fw-bold">{msg}</h5>
     {
        taskDetails.map(task => (
          
            <div key={task._id} className="editBody card m-auto mt-3">
                <div className="card-body fs-5">
                    <p className="task-id">TaskId: <span>{task._id}</span></p>
                    <p className="card-text">Name: <span className="text-capitalize">
                         <input type="text" className="px-1" placeholder="Edit task" value={editTask} onChange={(e)=> setEditTask(e.target.value)} required />
                        </span></p>
                    <p>
                    <label htmlFor="completed">Completed</label>
                     <input type="checkbox" className="ms-3" checked={completed} onChange={(e)=> setCompleted(e.target.checked)}/>
                    </p>
                
                      <button className="btn btn-primary  m-2" onClick={()=> handleUpdate(task._id)} >Save</button>
            
                     
                </div>
               
            </div>
           
        ))
     }
    </div>
  )
}

export default EditTask

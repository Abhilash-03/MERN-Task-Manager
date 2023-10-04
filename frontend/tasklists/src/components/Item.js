import { Link } from "react-router-dom"

function Item({ taskDetails, handleDelete, msg }) {
  return (
    <div className="items d-flex flex-column justify-content-center align-items-center mt-3">
    <h5 className="text-danger fw-bold">{msg}</h5>
      {
          taskDetails.map(dtls => (
            <div key={dtls._id} className="dtlBody mt-3">
                <div className="fs-5">
                    <p className="task-id">TaskId: <span>{dtls._id}</span></p>
                    <p className="card-text">Name: <span className="text-capitalize">{dtls.name}</span></p>
                    <p className="card-text">Completed: <span className="text-capitalize">{(dtls.completed).toString()}</span></p>
                     <p>Date: <span className="fw-bold">{(dtls.createdAt).slice(0, 10)}</span></p>
                     <div className="btns p-2">
                     <Link className="btn btn-success btn-sm m-2" to={`/todos/${dtls._id}`}><i className="fa-solid fa-pen"></i></Link>
                      <button className="btn btn-danger btn-sm m-2" onClick={()=> handleDelete(dtls._id)}><i className="fa-solid fa-trash"></i></button>
                     </div>
            
                </div>
               
            </div>
      
      ))  }
    </div>
  )
}

export default Item

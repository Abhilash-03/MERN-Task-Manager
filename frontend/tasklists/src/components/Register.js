import { useState } from 'react';
import api from '../axios/axios'
import { useNavigate } from 'react-router-dom';

function Register() {
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [msg, setMsg] = useState('');
const [err, setErr] = useState('');
const navigate = useNavigate();
  
const handleSubmit = async(e)=>{
  e.preventDefault()
  console.log("Form Submitted...");
  const newUser = {username, email, password};
  try{
     await api.post('/auth/register', newUser);
     setMsg('New User Registered!!')

     setTimeout(() => {
      setMsg('');
     navigate('/login');
      
     }, 4000);

  } catch(err){
    console.log(err);
    setErr(err.response.data.msg)
    setTimeout(() => {
      setErr('');
    }, 4000);
  }
}

  return (
    <>
       <div className={err === ''? 'd-none': 'd-block alert alert-danger alert-dismissible fade show'} role="alert">
        <strong>Error: </strong> {err}
  </div>
    <form className="registerform form w-50 m-auto mt-4" onSubmit={handleSubmit}>
      <h5 className='text-success fw-bold text-center'>{msg}</h5>
      <h2 className="p-3 text-center">Register Form</h2>
    <div className="form-floating mb-3">
    <input type="text" className="form-control" id="floatingName" placeholder="Username" value={username} onChange={(e)=> setUsername(e.target.value)} />
    <label htmlFor="floatingName">Username</label>
  </div>
    <div className="form-floating mb-3">
    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={(e)=> setEmail(e.target.value)}/>
    <label htmlFor="floatingInput">Email</label>
  </div>
  <div className="form-floating">
    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
    <label htmlFor="floatingPassword">Password</label>
  </div>

   <div className="submitBtn text-center">
  <button type="submit" className="btn btn-dark w-50 mt-4">Submit</button>
  </div>

  </form>
  </>
  )
}

export default Register

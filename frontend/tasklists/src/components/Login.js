import { useState } from "react"
import api from '../axios/axios'
import { useNavigate } from "react-router-dom";

function Login() {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPwd, setLoginPwd] = useState('');
    const [name, setName] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();
    const handleChange = async(e) => {
        e.preventDefault();
        const loginUser = {email: loginEmail, password: loginPwd};
        try{

            const resp = await api.post('/auth/login', loginUser);
            setName(resp.data.user.username);
            localStorage.setItem('token', resp.data.token);
            setTimeout(() => {
            navigate('/');
                
            }, 3000);

        }catch(err){
            setErr(err.response.data.msg)
            setTimeout(() => {
                setErr('');
            }, 2000);
        }   
    }

  return (
    <>
    <div className={name === ''? 'd-none': 'd-block alert alert-success alert-dismissible fade show'} role="alert">
  <strong>Success:</strong> {`${name} logged-in`}
  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
    <div className={err === ''? 'd-none': 'd-block alert alert-danger alert-dismissible fade show'} role="alert">
  <strong>Error: </strong> {err}
  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
   <form className="loginForm form w-50 m-auto mt-4" onSubmit={handleChange}>
    <h2 className="text-center mb-3">Login</h2>
 <div className="form-floating mb-3">
  <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" required value={loginEmail} onChange={(e)=> setLoginEmail(e.target.value)} />
  <label htmlFor="floatingInput">Email address</label>
</div>
<div className="form-floating">
  <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required value={loginPwd} onChange={(e)=> setLoginPwd(e.target.value)} />
  <label htmlFor="floatingPassword">Password</label>
</div>
<div className="submitBtn text-center">
  <button type="submit" className="btn btn-dark w-50 mt-4">Submit</button>
  </div>
   </form>
   </>
  )
}

export default Login

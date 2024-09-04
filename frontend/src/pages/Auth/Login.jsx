import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../redux/api/usersApiSlice'
import { setCredentials } from '../../redux/features/auth/authSlice'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //--redux function
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const { userInfo } = useSelector(state => state.auth)

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/'

    //--automatically navigate the user to a different route if they are already logged in
    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    const submithandler = async (e) => {
        e.preventDefault();

        try {
            const res = await login({ email, password }).unwrap()
            console.log(res);
            dispatch(setCredentials({ ...res }));
            //--Success Toast
            toast.success("Logged in Successfully");
        } catch (error) {
            //--Error Toast
            toast.error(error?.data?.message || error.message)
        }
    }

    return (
        <div>
            <section className="pl-[10rem] flex flex-wrap">
                <div className="mr-[4rem] mt-[5rem]">
                    <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
                    <form className="container w-[40rem]" onSubmit={submithandler}>
                        <div className="my-[2rem]">
                            <label htmlFor="email" className='block text-sm font-medium text-white'>Email Address</label>
                            <input
                                type="email"
                                id='email'
                                className='mt-1 p-2 border rounded w-full'
                                value={email}
                                placeholder='Enter Email'
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="my-[2rem]">
                            <label htmlFor="password" className='block text-sm font-medium text-white'>Password</label>
                            <input
                                type="password"
                                id='password'
                                className='mt-1 p-2 border rounded w-full'
                                value={password}
                                placeholder='Enter Password'
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <button disabled={isLoading} type='submit' className='bg-pink-500 text-white px-4 py-2 rounded 
                        cursor-pointer my-[1rem]'>{isLoading ? "Signing In..." : "Sign in"}
                        </button>

                        {isLoading && <Loader />}

                    </form>
                    <div className="mt-4">
                        <p className='text-white'>
                            New Customer ? {""}
                            <Link to={redirect ? `/register?redirect=${redirect}` : `/register`}
                                className="text-pink-500">Register</Link>
                        </p>
                    </div>
                </div>
                <div className='w-[48%] h-[95vh] rounded-lg'>
                <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
                    alt=""
                    className="h-[95vh] xl:block md:hidden sm:hidden rounded-lg"
                />
                </div>
            </section>
        </div>
    )
}

export default Login
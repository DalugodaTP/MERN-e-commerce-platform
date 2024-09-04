import { useState, useEffect, useReducer } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../components/Loader'
import { setCredentials } from "../../redux/features/auth/authSlice"
import { toast } from 'react-toastify'
import { useRegisterMutation } from "../../redux/api/usersApiSlice"

const Register = () => {
    //--Locally store data
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, SetPassword] = useState("");
    const [confirmePassword, setConfirmePassword] = useState("");

    //--send actions to reduc store
    const dispatch = useDispatch();
    //--navigate users to different routes of the app
    const navigate = useNavigate();

    //--triggers an API call to register a user, isLoading to indicate the registration
    const [register, { isloading }] = useRegisterMutation();

    //--go to the store and get from the store (to Confirm is they are logged in)
    const { userInfo } = useSelector(state => state.auth)

    const { search } = useLocation();
    //-- used to extract query parameters from the URL
    const sp = new URLSearchParams(search);

    //--holds a path to which the user will be redirected after registration, defaulting to '/' if not provided
    const redirect = sp.get('redirect') || '/'

    //--Redirect the user, if they are already logged on, navigate or redirect is changed
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo])

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmePassword) {
            toast.error("Passwords do not match")
        } else {
            try {
                const res = await register({ username, email, password }).unwrap();
                dispatch(setCredentials({ ...res }))
                navigate(redirect);
                toast.success("User registered Successfully");
            } catch (error) {
                console.log(error);
                toast.error(error.data.message)
            }
        }
    }

    return (
        <section className="pl-[10rem] flex flex-wrap">
            <div className="mr-[4rem] mt-[5rem]">
                <h1 className="text-2xl font-semibold mb-4">Register</h1>
                <form className="container w-[40rem]" onSubmit={submitHandler}>
                    <div className="my-[2rem]">
                        <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
                        <input
                            type="text"
                            id='name'
                            className="mt-1 p-2 border rounded w-full"
                            placeholder="Enter name"
                            value={username}
                            onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="my-[2rem]">
                        <label htmlFor="name" className="block text-sm font-medium text-white">Email Address</label>
                        <input
                            type="email"
                            id='email'
                            className="mt-1 p-2 border rounded w-full"
                            placeholder="Enter email"
                            value={email}
                            onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="my-[2rem]">
                        <label htmlFor="name" className="block text-sm font-medium text-white">Password</label>
                        <input
                            type="password"
                            id='password'
                            className="mt-1 p-2 border rounded w-full"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => SetPassword(e.target.value)} />
                    </div>
                    <div className="my-[2rem]">
                        <label htmlFor="name" className="block text-sm font-medium text-white">Confirm Password</label>
                        <input
                            type="password"
                            id='confirmPassword'
                            className="mt-1 p-2 border rounded w-full"
                            placeholder="Confirm password"
                            value={confirmePassword}
                            onChange={e => setConfirmePassword(e.target.value)} />
                    </div>

                    <button disabled={isloading} type="submit" className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]">
                        {isloading ? "Registering...." : "Register"}
                    </button>

                    {isloading && <Loader />}
                </form>

                <div className="mt-4">
                    <p className="text-white">
                        Already have an account ? {""}
                        <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}
                            className="text-pink-500">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
            <div className=" w-[48%] h-[95vh] rounded-lg">
                <img
                    src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
                    alt=""
                    className=" h-[95vh] xl:block lg:hidden md:hidden sm:hidden rounded-lg"
                />
            </div>
        </section>
    )
}

export default Register
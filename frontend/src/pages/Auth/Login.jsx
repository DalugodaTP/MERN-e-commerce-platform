import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../redux/api/usersApiSlice'
import { setCredentials } from '../../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

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

    return (
        <div>
            <section className="pl-[10rem] flex flex-wrap">
                <div className="mr-[4rem] mt-[5rem]">
                    <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
                </div>
            </section>
        </div>
    )
}

export default Login
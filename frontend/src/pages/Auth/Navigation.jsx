import { useState } from 'react'
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai"
import { FaHeart } from "react-icons/fa"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import "./Navigation.css"

import { useSelector, useDispatch } from 'react-redux'
import { useLoginMutation } from '../../redux/api/usersApiSlice'
import { logout } from '../../redux/features/auth/authSlice'


const Navigation = () => {
  //--Get user info
  const { userInfo } = useSelector(state => state.auth);

  //--Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  }


  //--Sidebar
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  }

  const closeSidebar = () => {
    setShowSidebar(false);
  }

  //--Load user data
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLoginMutation();

  //--logout the user
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error)
    }
  };



  return (
    <div
      style={{ zIndex: 999 }}
      // The showSidebar is false by default and creates a flex container
      className={`${showSidebar ? "hidden" : 'flex'} xl:flex lg:hidden sm:hidden flex-col 
      justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] h-[100vh] fixed`}
      id="navigation-container">
      {/* Container 1 */}
      <div className="flex flex-col justify-center space-y-4">

        {/* Home Naviagtion */}
        <Link to='/' className='flex items-center transition-transform transform hover:translate-x-2'>
          <AiOutlineHome className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>HOME</span>
        </Link>

        {/* Shop Naviagtion */}
        <Link to='/shop' className='flex items-center transition-transform transform hover:translate-x-2'>
          <AiOutlineShopping className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>SHOP</span>
        </Link>

        {/* Cart Naviagtion */}
        <Link to='/cart' className='flex items-center transition-transform transform hover:translate-x-2'>
          <AiOutlineShoppingCart className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>CART</span>
        </Link>

        {/* Favourit Naviagtion */}
        <Link to='/favorite' className='flex items-center transition-transform transform hover:translate-x-2'>
          <FaHeart className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>FAVORITE</span>
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropDown}
          className='flex items-center text-gray-800 focus:outline-none'
        >
          {userInfo ? (<span className='text-white'>{userInfo.username}</span>
          ) : (
            <></>
          )}
        </button>
      </div>

      {/* Container 2 */}
      <ul>
        <li>
          <Link to='/login' className='flex items-center transition-transform transform hover:translate-x-2'>
            <AiOutlineLogin className='mr-2 mt-[3rem]' size={26} />
            <span className='hidden nav-item-name mt-[3rem]'>Login</span>
          </Link>
        </li>
        <li>
          <Link to='/register' className='flex items-center transition-transform transform hover:translate-x-2'>
            <AiOutlineUserAdd className='mr-2 mt-[3rem]' size={26} />
            <span className='hidden nav-item-name mt-[3rem]'>Register</span>
          </Link>
        </li>
      </ul>


    </div>
  );
};

export default Navigation;
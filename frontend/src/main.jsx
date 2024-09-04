import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux';
import store from './redux/store.js';

//Private Route
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminRoutes from './pages/Admin/AdminRoutes.jsx';

// Auth
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

import Profile from './pages/User/Profile.jsx';
import UserList from './pages/Admin/UserList.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* All users routes*/}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Registered users Only*/}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<Profile />} />
      </Route>

      {/* Admin users Only*/}
      <Route path="/admin" element={<AdminRoutes />}>
        <Route path="userlist" element={<UserList />} />
      </Route>
    </Route>
  )
)

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

import { createBrowserRouter } from 'react-router-dom';
import Welcome from './features/welcome/Welcome';
import Login from './features/auth/Login';
import Register from './features/auth/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path:'/register',
    element : <Register/>
  }
]);
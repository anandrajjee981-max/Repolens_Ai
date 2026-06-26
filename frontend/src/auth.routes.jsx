import { createBrowserRouter } from 'react-router-dom';
import Welcome from './features/welcome/Welcome';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/pages/Dashboard';
import Data from './features/pages/Data';
import Contents from './features/pages/Contents';

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
  },
  {
    path:'/dashboard',
    element:<Dashboard/>
  },
  {
    path : '/library',
    element : <Data/>
  },
  {
    path : '/contents',
    element : <Contents/>
  }
]);
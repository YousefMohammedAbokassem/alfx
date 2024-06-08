import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import RequireAuth from './hooks/require-auth';
import Admin from './pages/Admin';
import Teacher from './pages/Teacher';
import Courses from './pages/Courses';
import TeacherDetails from './pages/TeacherDetails';
import Map from './pages/Map';
import Chapters from './pages/Chapters';
import Lectures from './pages/Lectures';
import Items from './pages/Items';
import Pos from './pages/Pos';
import User from './pages/User';
import Mcq from './pages/Mcq';
import Live from './pages/Live';
import Requests from './pages/Requests';
import Advertise from './pages/Advertise';
import Category from './pages/News';
import GlobalSetting from './pages/GlobalSetting';
import Recommendation from './pages/recommendationCategory';
import SpecialCategory from './pages/Recommendation';
import AboutUs from './pages/AboutUs';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: (
        <RequireAuth>
          <DashboardLayout />
        </RequireAuth>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <User /> },
        { path: 'teacher', element: <Teacher /> },
        { path: 'teacher/details/:id', element: <TeacherDetails /> },
        { path: 'map', element: <Map /> },
        { path: 'courses', element: <Courses /> },
        { path: 'courses/chapter/:id', element: <Chapters /> },
        { path: 'courses/lectures/:id', element: <Lectures /> },
        { path: 'courses/lectures/mcq/:id', element: <Mcq /> },
        { path: 'admin', element: <Admin /> },
        { path: 'items', element: <Items /> },
        { path: 'live', element: <Live /> },
        { path: 'requests', element: <Requests /> },
        { path: 'pos', element: <Pos /> },
        { path: 'advertise', element: <Advertise /> },
        { path: 'category', element: <Category /> },
        { path: 'globalsetting', element: <GlobalSetting /> },
        { path: 'recommendationCategory', element: <Recommendation /> },
        { path: 'SpecialCategory', element: <SpecialCategory /> },
        { path: 'aboutUs', element: <AboutUs /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: (
        <RequireAuth>
          <SimpleLayout />
        </RequireAuth>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

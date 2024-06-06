import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'admin',
    path: '/dashboard/admin',
    icon: icon('user-01'),
  },
  {
    title: 'Teacher',
    path: '/dashboard/teacher',
    icon: icon('teacher-01'),
  },
  {
    title: 'Courses',
    path: '/dashboard/courses',
    icon: icon('book-01'),
  },
  {
    title: 'Cities',
    path: '/dashboard/items',
    icon: icon('maps-01'),
  },
  {
    title: 'Pos',
    path: '/dashboard/pos',
    icon: icon('maps-01'),
  },
  {
    title: 'Live',
    path: '/dashboard/live',
    icon: icon('maps-01'),
  },
  {
    title: 'Requests',
    path: '/dashboard/requests',
    icon: icon('maps-01'),
  },
  {
    title: 'Advertise',
    path: '/dashboard/advertise',
    icon: icon('maps-01'),
  },
  {
    title: 'News',
    path: '/dashboard/category',
    icon: icon('maps-01'),
  },
  {
    title: 'QrCode',
    path: '/dashboard/globalsetting',
    icon: icon('maps-01'),
  },
  {
    title: 'Recommendation category',
    path: '/dashboard/recommendationCategory',
    icon: icon('maps-01'),
  },
  {
    title: 'About Us',
    path: '/dashboard/aboutUs',
    icon: icon('maps-01'),
  },

  {
    title: 'logout',
    path: '/login',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'logout',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
];

export default navConfig;

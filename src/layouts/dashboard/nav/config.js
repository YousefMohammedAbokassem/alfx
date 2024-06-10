import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'User',
    path: '/dashboard/User',
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
    icon: icon('city-svgrepo-com'),
  },
  {
    title: 'Pos',
    path: '/dashboard/pos',
    icon: icon('maps-01'),
  },

  {
    title: 'Advertise',
    path: '/dashboard/advertise',
    icon: icon('ad-free-svgrepo-com'),
  },
  {
    title: 'News',
    path: '/dashboard/news',
    icon: icon('news-svgrepo-com'),
  },
  {
    title: 'QrCode',
    path: '/dashboard/globalsetting',
    icon: icon('qrcode-svgrepo-com'),
  },
  {
    title: 'Recommendation category',
    path: '/dashboard/recommendationCategory',
    icon: icon('passport-svgrepo-com'),
  },
  {
    title: 'About Us',
    path: '/dashboard/aboutUs',
    icon: icon('about-svgrepo-com'),
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

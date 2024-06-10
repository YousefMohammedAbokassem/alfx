import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// components
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import { logoutUser } from 'src/store/authSlice';
import Chart from 'src/components/chart';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [thisYearOrder, setThisYearOrder] = useState([]);
  const [lastYearOrder, setLastYearOrder] = useState([]);
  const [topCtegoryKey, setCategoryKey] = useState([]);
  const [topCtegoryValue, setCategoryValue] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersOne, setOrdersOne] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersOne, setUsersOne] = useState([]);

  console.log(lastYearOrder);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}dashboard/charts`, {
        headers: headerApi(token),
      })
      .then((res) => {
        const valuesArray = Object.values(res.data.orders_in_two_years);
        setThisYearOrder(valuesArray[0]);
        setLastYearOrder(valuesArray[1]);
        setCategoryKey(res.data.top_categories.keys);
        setCategoryValue(res.data.top_categories.values);
        setOrders(res.data.orders);
        setOrdersOne(res.data.orders1);
        setUsers(res.data.users);
        setUsersOne(res.data.users1);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
      });
  }, [dispatch, token]);

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        <div className="container mx-auto flex justify-start py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 w-full">
            {/* <!-- Students Card --> */}
            <div className="bg-white shadow-md rounded-lg flex flex-col justify-between p-6 ">
              <div className="flex items-center mb-1">
                <SchoolIcon className="text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-700 ml-2">Students</h2>
              </div>
              <p className="">
                Number of Students: <span className="font-bold">50</span>{' '}
              </p>
              <div>
                <Typography color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowDownwardIcon size="" />
                  <span>25%</span>
                </Typography>
              </div>
            </div>
            {/* <!-- Courses Card --> */}
            <div className="bg-white shadow-md rounded-lg flex flex-col justify-between p-6">
              <div className="flex items-center mb-1">
                <BookIcon className="text-green-500" />
                <h2 className="text-lg font-semibold text-gray-700 ml-2">Courses</h2>
              </div>
                <p className="">
                  Number of Courses: <span className="font-bold">50</span>{' '}
                </p>
              <>
                <div>
                  <Typography color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowDownwardIcon size="" />
                    <span>25%</span>
                  </Typography>
                </div>
              </>
            </div>
            {/* <!-- QR Card --> */}
            <div className="bg-white shadow-md rounded-lg flex flex-col justify-between p-6">
              <div className="flex items-center mb-1">
                <QrCodeIcon className="text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-700 ml-2">QR</h2>
              </div>
              <p className="">
                Number of Qrs: <span className="font-bold">50</span>{' '}
                <br />
                active:40 {" "}
                inactive:10
              </p>
              <div>
                <Typography color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowDownwardIcon size="" />
                  <span>25%</span>
                </Typography>
              </div>
            </div>
            {/* <!-- Recommendation Card --> */}
            <div className="bg-white shadow-md rounded-lg flex flex-col justify-between p-6">
              <div className="flex items-center mb-1">
                <ThumbUpIcon className="text-red-500" />
                <h2 className="text-md font-semibold text-gray-700 ml-2">Recommendation</h2>
              </div>
              <p className="">
                Number of Category: <span className="font-bold">50</span>{' '}
              </p>
              <div>
                <Typography color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowDownwardIcon size="" />
                  <span>25%</span>
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <Chart />
      </Container>
    </>
  );
}

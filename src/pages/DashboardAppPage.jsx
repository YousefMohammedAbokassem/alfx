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
  const [loading, setLoading] = useState(false);

  const [dataSet, setDataSet] = useState([]);

  const [stat, setStat] = useState([
    {
      studentCount: 21,
      coursesCount: 86,
      qrCount: 50,
      recommendationCount: 40,
      month: 'Jan',
    },
    {
      studentCount: 28,
      coursesCount: 78,
      month: 'Fev',
      qrCount: 40,
      recommendationCount: 50,
    },
    {
      studentCount: 41,
      coursesCount: 106,
      month: 'Mar',
      qrCount: 50,
      recommendationCount: 40,
    },
    {
      studentCount: 73,
      coursesCount: 92,
      month: 'Apr',
      qrCount: 100,
      recommendationCount: 70,
    },
    {
      studentCount: 99,
      coursesCount: 92,
      qrCount: 50,
      recommendationCount: 40,
      month: 'May',
    },
    {
      studentCount: 144,
      coursesCount: 103,
      qrCount: 100,
      recommendationCount: 70,
      month: 'June',
    },
    {
      studentCount: 319,
      coursesCount: 105,
      qrCount: 100,
      recommendationCount: 70,
      month: 'July',
    },
    {
      studentCount: 249,
      coursesCount: 106,
      qrCount: 100,
      recommendationCount: 70,
      month: 'Aug',
    },
    {
      studentCount: 131,
      coursesCount: 95,
      qrCount: 100,
      recommendationCount: 70,
      month: 'Sept',
    },
    {
      studentCount: 55,
      coursesCount: 97,
      qrCount: 50,
      recommendationCount: 40,
      month: 'Oct',
    },
    {
      studentCount: 48,
      coursesCount: 76,
      qrCount: 50,
      recommendationCount: 40,
      month: 'Nov',
    },
    {
      studentCount: 25,
      coursesCount: 103,
      qrCount: 100,
      recommendationCount: 70,
      month: 'Dec',
    },
  ]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios
        // .get(`${process.env.REACT_APP_API_URL}admin/categories`, {
        .get(`${process.env.REACT_APP_API_URL}admin/statistics/${selectedYear || new Date().getFullYear()}`, {
          headers: headerApi(token),
        });
      setDataSet(res.data);
      setStat(res.data.statistics);
      console.log(res.data);
      setLoading(false);

      // setStat(res.data.statistics);
      // const arr = res.data.statistics;

      /*   if (res.data.statistics[0] != undefined) {
        setStat(
          (
            prev //[a,b] [c,d]
          ) =>
            prev.map((ele) => {
              let data = {};
              res.data.statistics.forEach((elementFromFetch) => {
                if (ele?.month === elementFromFetch?.month) {
                  data = elementFromFetch;
                } else {
                  data = ele;
                }
              });
              return data;
            })
        );
        setLoading(false);
      } else {
        setLoading(false);
        setStat([
          {
            driverCount: 0,
            userCount: 0,
            month: 'Jan',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Fev',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Mar',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Apr',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'May',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'June',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'July',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Aug',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Sept',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Oct',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Nov',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Dec',
          },
        ]);
      } */
    } catch (err) {
      if (err.response.status === 401) {
        dispatch(logoutUser());
      }
      setLoading(false);
    }
    // setSelectedYear('');
  };

  // handle year
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

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
                Number of Students: <span className="font-bold">{dataSet?.studentCount}</span>{' '}
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
                Number of Courses: <span className="font-bold">{dataSet?.coursesCount}</span>{' '}
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
                Number of Qrs: <span className="font-bold">{dataSet?.qrCountActive + dataSet?.qrCountNonActive}</span>{' '}
                <br />
                active:{dataSet?.qrCountActive} inactive:{dataSet?.qrCountNonActive}
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
                Number of Category: <span className="font-bold">{dataSet?.recommendationCount}</span>{' '}
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
        <Chart
          loading={loading}
          setSelectedYear={setSelectedYear}
          selectedYear={selectedYear}
          fetchData={fetchData}
          stat={stat}
          year={dataSet?.year}
        />
      </Container>
    </>
  );
}

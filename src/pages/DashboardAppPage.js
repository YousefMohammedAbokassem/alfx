import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import { OverviewBudget } from 'src/sections/@dashboard/overView/overview-budget';
import { OverviewTotalCustomers } from 'src/sections/@dashboard/overView/overview-total-customers';
import { OverviewTasksProgress } from 'src/sections/@dashboard/overView/overview-tasks-progress';
import { OverviewTotalProfit } from 'src/sections/@dashboard/overView/overview-total-profit';
import { OverviewSales } from 'src/sections/@dashboard/overView/overview-sales';
import { OverviewTraffic } from 'src/sections/@dashboard/overView/overview-traffic';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import { logoutUser } from 'src/store/authSlice';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const dispatch = useDispatch
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
        if(error.response.status === 401){
          dispatch(logoutUser())
        }
      });
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

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={3}>
            <OverviewBudget difference={12} positive sx={{ height: '100%' }} value="$24k" orders={orders} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <OverviewTotalCustomers
              orders={ordersOne}
              difference={16}
              positive={false}
              sx={{ height: '100%' }}
              value="1.6k"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <OverviewTasksProgress users={users} sx={{ height: '100%' }} value={75.5} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <OverviewTotalProfit users={usersOne} sx={{ height: '100%' }} value="$15k" />
          </Grid>
          <Grid item xs={12} lg={8}>
            {thisYearOrder.length > 0 && lastYearOrder.length > 0 && (
              <OverviewSales
                chartSeries={[
                  {
                    name: 'This year',
                    data: thisYearOrder,
                  },
                  {
                    name: 'Last year',
                    data: lastYearOrder,
                  },
                ]}
                sx={{ height: '100%' }}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            {topCtegoryValue.length > 0 && (
              <OverviewTraffic chartSeries={topCtegoryValue} labels={topCtegoryKey} sx={{ height: '100%' }} />
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

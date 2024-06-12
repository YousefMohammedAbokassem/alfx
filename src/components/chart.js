import React, { useEffect, useState } from 'react';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { BarChart } from '@mui/x-charts/BarChart';
import { Button, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useSelector, useDispatch } from 'react-redux';
import { dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SkeletonCharts from './SkeletonCharts';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';
import axios from 'axios';

const chartSetting = {
  height: 300,
};

const valueFormatter = (value) => `${value}`;

export default function GridDemo({ year, loading, setSelectedYear, selectedYear, stat, fetchData }) {
  const dispatch = useDispatch();

  const handleYearChange = (date) => {
    setSelectedYear(date.$y);
  };

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // No need to fetch data, using default data
  }, []);

  // const handleYearChange = (date) => {
  //   // No need to handle year change as we're using default data for a specific year
  // };

  const [showTeacher, setShowTeacher] = useState(true);
  const [showStudent, setShowStudent] = useState(true);
  const [showQRCount, setShowQRCount] = useState(true);
  const [showRecommendationCount, setShowRecommendationCount] = useState(true);
  const handleTeacherCheckboxChange = () => {
    setShowTeacher(!showTeacher);
  };

  const handleStudentCheckboxChange = () => {
    setShowStudent(!showStudent);
  };
  const handleQRCountCheckboxChange = () => {
    setShowQRCount(!showQRCount);
  };

  const handleRecommendationCountCheckboxChange = () => {
    setShowRecommendationCount(!showRecommendationCount);
  };
  const series = [];

  if (showStudent) {
    series.push({ dataKey: 'studentCount', label: 'Students', valueFormatter, color: '#007bff' });
  }
  if (showTeacher) {
    series.push({ dataKey: 'coursesCount', label: 'Teacher', valueFormatter, color: '#22c55e' });
  }

  if (showQRCount) {
    series.push({ dataKey: 'qrCount', label: 'QR Count', valueFormatter, color: '#a855f7' });
  }

  if (showRecommendationCount) {
    series.push({ dataKey: 'recommendationCount', label: 'Recommendation Count', valueFormatter, color: '#ef4444' });
  }

  return (
    <>
      {loading ? (
        <SkeletonCharts />
      ) : (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={showStudent}
                onChange={handleStudentCheckboxChange}
                color="primary"
                sx={{
                  '& .MuiSvgIcon-root': {
                    color: '#007bff !important',
                  },
                }}
              />
            }
            label="Show Student"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={showTeacher}
                onChange={handleTeacherCheckboxChange}
                color="primary"
                sx={{
                  '& .MuiSvgIcon-root': {
                    color: '#22c55e !important',
                  },
                }}
              />
            }
            label="Show Teacher"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={showQRCount}
                onChange={handleQRCountCheckboxChange}
                color="secondary"
                sx={{
                  '& .MuiSvgIcon-root': {
                    color: '#a855f7 !important',
                  },
                }}
              />
            }
            label="Show QR Count"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={showRecommendationCount}
                onChange={handleRecommendationCountCheckboxChange}
                sx={{
                  '& .MuiSvgIcon-root': {
                    color: '#ef4444 !important',
                  },
                }}
              />
            }
            label="Show Recommendation Count"
          />

          <Grid sx={{ display: 'flex', gap: '5px', mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={['year']}
                label="Select Year"
                // value={{ $y: 2024 }} // Setting year to 2024
                onChange={handleYearChange}
                color="primary"
                sx={{
                  '& .MuiButtonBase-root': {
                    backgroundColor: 'primary.main',
                    color: '#fff',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'primary.main',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              />
            </LocalizationProvider>

            <Grid item>
              <Button
                disabled={selectedYear === '' ? true : false} // No need for this button as we're using default data
                color="primary"
                sx={{ height: '100%' }}
                variant="outlined"
                onClick={() => {
                  // No need for this button as we're using default data
                  fetchData();
                }}
              >
                get year
              </Button>
            </Grid>
          </Grid>
          {stat == undefined ? (
            ''
          ) : (
            <BarChart
              dataset={stat}
              xAxis={[
                {
                  scaleType: 'band',
                  dataKey: 'month',
                  valueFormatter: (month, context) => `${month}\n${year || new Date().getFullYear()}`, // Using 2024 as the year
                },
              ]}
              series={series}
              grid={{ horizontal: true }}
              bottomAxis={{
                labelStyle: {
                  fontSize: 16,
                },
                tickLabelStyle: {
                  angle: 0,
                  textAnchor: 'middle',
                  fontSize: 15,
                },
              }}
              sx={{
                [`& .${axisClasses.left} .${axisClasses.label}`]: {
                  transform: 'translateX(-10px)',
                },
                [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3', strokeWidth: 2 },
              }}
              {...chartSetting}
            />
          )}
        </div>
      )}
    </>
  );
}

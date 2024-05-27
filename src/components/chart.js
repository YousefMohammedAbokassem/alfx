// import dynamic from 'next/dynamic';
// import { styled } from '@mui/material/styles';

// const ApexChart = dynamic(() => import('react-apexcharts'), {
//   ssr: false,
//   loading: () => null
// });

// export const Chart = styled(ApexChart)``;

import React, { lazy, Suspense } from 'react';
import { styled } from '@mui/material/styles';

const ApexChart = lazy(() => import('react-apexcharts'));

export const Chart = styled(ApexChart)``;

function App() {
  return (
    <Suspense fallback={null}>
      <Chart />
    </Suspense>
  );
}
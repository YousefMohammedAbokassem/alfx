import PropTypes from 'prop-types';
import { Card, CardContent, Stack, Typography } from '@mui/material';

export const OverviewBudget = (props) => {
  const { sx, value, orders } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Students
            </Typography>
            <Typography variant="h4">{orders[0]}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, fontSize: '14px' }}>
              Number of Students: {'100'}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewBudget.propTypes = {
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
  orders: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
};

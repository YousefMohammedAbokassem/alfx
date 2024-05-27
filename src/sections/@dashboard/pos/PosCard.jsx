import { Button, Card, CardActions, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PosCard = ({ element, setDelete, setOpenDelete, setSelectedUpdate, setOpenUpdate }) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    setDelete(element.id)
    setOpenDelete(true)
  }

  const handleUpdate = () => {
    setSelectedUpdate(element)
    setOpenUpdate(true)
  }

  return (
    <Card sx={{ width: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={`${process.env.REACT_APP_API_URL_IMAGE}${element.image}`}
        title={element.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {element.name}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Address : {element.address}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Phone : {element.phone}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          City : {element.city}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row">
          <Button size="small" onClick={handleUpdate}>Update</Button>
          <Button size="small" onClick={handleDelete}>Delete</Button>
        </Stack>
        <Stack>
          <Button size="small" onClick={() => navigate(`/dashboard/map?lat=${element.lat}&lng=${element.lng}`)}>
            View Location
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default PosCard;

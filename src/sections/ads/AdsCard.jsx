import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';

const AdsCard = ({ element, setOpenDelete, setSelectedElement, setOpenUpdate }) => {
  const onClick = () => {
    if (element.url) {
      window.open(element.url, '_blank');
    }
  };

  const handleDelete = () => {
    setOpenDelete(true);
    setSelectedElement(element);
  };

  const handleUpdate = () => {
    setOpenUpdate(true);
    setSelectedElement(element);
  };
  return (
    <>
      <Card sx={{ width: 345 }}>
        <CardMedia
          sx={{ height: 240, cursor: 'pointer' }}
          image={`${process.env.REACT_APP_API_URL_IMAGE}${element.file}`}
          title="Advertise"
          onClick={onClick}
        />
        <CardContent>
          <Typography>Title: {element?.title}</Typography>
          <Typography>Body: { element?.body}</Typography>
          <Typography>Url: {element?.url}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleUpdate}>
            update
          </Button>
          <Button size="small" onClick={handleDelete}>
            Delete
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default AdsCard;

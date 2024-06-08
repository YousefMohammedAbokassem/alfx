import { Avatar, IconButton, Link, Card, Stack, TableCell, TableRow, Typography, Grid, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

import './styles.css';

// import required modules
import { EffectCards } from 'swiper/modules';

const RecommendationTableRow = ({
  recommendation,
  id,
  handleDeleteAdmin,
  loading,
  handleUpdate,
  setSelectedRecommendation,
}) => {
  const navigate = useNavigate();
  const [media, setMedia] = React.useState([
    ...(typeof recommendation?.images === 'string'
      ? JSON.parse(recommendation?.images)
      : recommendation?.images === 'object'
      ? recommendation?.images
      : []
    ).map((image) => ({ type: 'image', src: image })),
    ...(typeof recommendation?.videos === 'string'
      ? JSON.parse(recommendation?.videos)
      : recommendation?.videos === 'object'
      ? recommendation?.videos
      : []
    ).map((video) => ({ type: 'video', src: video })),
  ]);
  return (
    <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]} className="mySwiper">
      {media?.map((item, index) => (
        <SwiperSlide
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: '10px',
            width: '100%',
            backgroundColor: '#f6f6f6',
            borderRadius: '15px',
          }}
        >
          {item.type === 'image' ? (
            <img src={process.env.REACT_APP_API_URL_IMAGE + item.src} alt="" style={{ height: '75%' }} />
          ) : (
            <video controls style={{ height: '75%' }}>
              <source src={process.env.REACT_APP_API_URL_IMAGE + item.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <Typography
            sx={{ color: 'primary.main', fontSize: '14px', padding: '20px 10px', fontWeight: 'bold' }}
            component="div"
          >
            Description: {recommendation.description}
          </Typography>
          <Typography
            sx={{ color: 'primary.main', fontSize: '14px', padding: '20px 10px', fontWeight: 'bold' }}
            component="div"
          >
            <Button disabled={loading} variant="text" onClick={() => handleDeleteAdmin(recommendation?.id)}>
              Delete
            </Button>
            <Button variant="text" onClick={() => handleUpdate(recommendation?.id, recommendation)}>
              Update
            </Button>
          </Typography>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default RecommendationTableRow;

import { Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { customDecrypt } from 'src/utils/hashingFunction';

const CoursesCard = ({ element, handleDelete, handleUpdate, setSelectedId, mainPage }) => {
  const navigate = useNavigate();

  const decryptedVideoUrl = customDecrypt(element.introduction_video);
  // استخراج معرف الفيديو ووقت البدء باستخدام تعبيرات منتظمة
  const videoIdMatch = decryptedVideoUrl.match(/v=([^&]+)/);
  const startTimeMatch = decryptedVideoUrl.match(/t=(\d+)s/);

  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  const startTime = startTimeMatch ? startTimeMatch[1] : '0'; // تعيين الوقت الافتراضي إلى 0 إذا لم يكن هناك وقت بدء

  // إنشاء رابط التضمين
  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${startTime}`;

  return (
    <Card sx={{ width: '350px' }}>
      {/* {videoId && ( */}
      <iframe
        width="350"
        height="315"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
      {/* )} */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {element.name}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          {element.description}
        </Typography>
        <Stack spacing={2}>
          <Typography gutterBottom variant="body2" component="div">
            Teacher Name: {element.teacher_name}
          </Typography>
        </Stack>
      </CardContent>
      {mainPage && (
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button
            onClick={() => navigate(`/dashboard/courses/chapter/${element.id}?name=${element.name}`)}
            size="small"
          >
            Learn More
          </Button>
          <Stack direction="row" spacing={2}>
            <Button size="small" onClick={() => handleDelete(element.id)}>
              Delete
            </Button>
            <Button size="small" onClick={() => handleUpdate(element)}>
              Update
            </Button>
          </Stack>
        </CardActions>
      )}
    </Card>
  );
};

export default CoursesCard;

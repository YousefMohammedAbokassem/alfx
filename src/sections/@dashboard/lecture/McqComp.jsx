import { faCircleDown, faCircleUp } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

const McqComp = ({ element, index, setOpenDelete, setSelectedDelete, setOpenUpdate, setSelectedUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    setSelectedDelete(element.id)
    setOpenDelete(true)
  }


  const handleUpdate = () => {
    setOpenUpdate(true)
    setSelectedUpdate(element)
  }


  return (
    <>
      <div style={{ marginBottom: '20px', border: '1px solid #333', padding: '10px 20px', borderRadius: '20px' }}>
        <Typography variant="h6" onClick={() => setIsExpanded((prev) => !prev)}>
          {index + 1} - {element.text}
          {isExpanded ? (
            <FontAwesomeIcon style={{ marginLeft: '10px' }} icon={faCircleUp} />
          ) : (
            <FontAwesomeIcon style={{ marginLeft: '10px' }} icon={faCircleDown} />
          )}
        </Typography>
        <div className={`content ${isExpanded ? 'active' : ''}`}>
          {element.options.map((option, idx) => (
            <Typography variant="body1" key={idx} sx={{color: option.is_correct === 1 ? "green" : "", marginLeft: "20px"}}>
              {' '}
              {idx === 0 ? 'A - ' : idx === 1 ? 'B - ' : idx === 2 ? 'C - ' : 'D - '} {option.text}
            </Typography>
          ))}
      <Stack direction="row" >
            <Button onClick={handleDelete}>Delete</Button>
            <Button onClick={handleUpdate}>Update</Button>
      </Stack>
        </div>
      </div>
    </>
  );
};

export default McqComp;

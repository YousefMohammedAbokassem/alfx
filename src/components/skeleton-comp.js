import { Skeleton } from '@mui/material'
import React from 'react'

const SkeletonCopm = () => {
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "30px", flexWrap: "wrap"}}>
        {
            [1, 2, 3, 4, 5, 6].map((_, index) => (
                <Skeleton key={index} variant="rectangular" width={345} height={300} />
                ))
        }
    </div>
  )
}

export default SkeletonCopm
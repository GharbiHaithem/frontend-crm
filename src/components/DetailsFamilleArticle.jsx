import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { familleService } from '../services/api'
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';

const DetailsFamilleArticle = () => {
  const{id} = useParams()
   const [selectedCard, setSelectedCard] = React.useState(0);
  useEffect(()=>{
   familleService.getById(id).then((result)=>setSelectedCard(result.data))
  },[id])

  return (
    <div>
       <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
        gap: 2,
      }}
    >
   
        <Card>
          <CardActionArea
           
          
            sx={{
              height: '100%',
              '&[data-active]': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selectedHover',
                },
              },
            }}
          >
            <CardContent sx={{ height: '100%' }}>
               <Typography variant="body2" color="text.secondary">
                              Code Famille
                            </Typography>
              <Typography variant="h5" component="div">
               {selectedCard?.codeFamille}
               <hr  className='mt-5 mb-3'/>
              </Typography>
                    <Typography variant="body2" color="text.secondary">
                            Designation Famille
                            </Typography>
               <Typography variant="h5" component="div">
              {selectedCard?.designationFamille}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

    </Box>
    </div>
  )
}

export default DetailsFamilleArticle
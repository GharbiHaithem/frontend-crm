import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { categorieService } from '../services/api'
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material'

const DetailsCategoryArticle = () => {
  const { id } = useParams()
  const [categoryArticle, setCategoryArticle] = useState({})
  useEffect(() => {
    categorieService.getById(id).then((response) => setCategoryArticle(response.data))
  }, [id])
  console.log(categoryArticle)
  return (
    <div className='flex items-center justify-center '>
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
                Code Categorie
              </Typography>
              <Typography variant="h5" component="div">
                {categoryArticle?.codeCategorie}
              </Typography>
              <hr className='mt-5 mb-3'/>
              <Typography variant="body2" color="text.secondary">
                Designation Categorie
              </Typography>
               <Typography variant="h5" component="div">
                {categoryArticle?.designationCategorie}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

      </Box>
    </div>
  )
}

export default DetailsCategoryArticle
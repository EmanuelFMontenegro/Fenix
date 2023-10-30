import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActionArea, Dialog, DialogContent, DialogTitle } from '@mui/material';

const EmpleadoCard = ({ nombre, foto, informacionAdicional }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Card>
        <CardActionArea onClick={handleDialogOpen}>
          <CardContent>
            <img src={foto} alt={nombre} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
            <Typography variant="h6" component="h2">
              {nombre}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Información detallada de {nombre}</DialogTitle>
        <DialogContent>
          <Typography>{informacionAdicional}</Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmpleadoCard;

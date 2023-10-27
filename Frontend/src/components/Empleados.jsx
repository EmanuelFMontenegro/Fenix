import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import '../styles/Empleados.css'

const Empleados = () => {
  return (
    <div className="empleados"> 
      <h1>Empleados</h1>
      <div className="grid-container"> 
        <Grid container spacing={3}>
          <Grid item xs={4} className="grid-item"> 
            <Paper style={{ padding: 20, textAlign: 'center' }}>Item 1</Paper>
          </Grid>
          <Grid item xs={4} className="grid-item"> 
            <Paper style={{ padding: 20, textAlign: 'center' }}>Item 2</Paper>
          </Grid>
          <Grid item xs={4} className="grid-item"> 
            <Paper style={{ padding: 20, textAlign: 'center' }}>Item 3</Paper>
          </Grid>
          <Grid item xs={4} className="grid-item"> 
            <Paper style={{ padding: 20, textAlign: 'center' }}>Item 4</Paper>
          </Grid>
          <Grid item xs={4} className="grid-item"> 
            <Paper style={{ padding: 20, textAlign: 'center' }}>Item 5</Paper>
          </Grid>
          <Grid item xs={4} className="grid-item"> 
            <Paper style={{ padding: 20, textAlign: 'center' }}>Item 6</Paper>
          </Grid>
          <Grid item xs={4} className="grid-item"> 
            <Paper style={{ padding: 20, textAlign: 'center' }}>Item 7</Paper>
          </Grid>
          <Grid item xs={4} className="grid-item"> 
            <Paper style={{ padding: 20, textAlign: 'center' }}>Item 8</Paper>
          </Grid>
          <Grid item xs={4} className="grid-item"> 
            <Paper style={{ padding: 20, textAlign: 'center' }}>Item 9</Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Empleados;

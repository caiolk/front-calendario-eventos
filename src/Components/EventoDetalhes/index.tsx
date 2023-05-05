import React, { useEffect, useState,  useCallback, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import { TextField, Box, Paper, Select , Button, Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';
import api from '../../services/api';
import ISessaoParametros from '../../shared/interfaces/ISessaoParametros'
import IEventoDetalhesParam from '../../shared/interfaces/IEventoDetalhesParam'
import useStyles from './styles';

interface IDetalhesParam{
  eventoDetalhes: IEventoDetalhesParam
}

const EventoDetalhes = (eventoDetalhes: IDetalhesParam) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.divPrincipal}>
        <TextField 
          label="Titulo Evento" autoComplete={'false'} size={'small'} className={classes.divValor}
          defaultValue={eventoDetalhes.eventoDetalhes.evento_titulo} onChange={(event:any) => {}}
          id={`evento_titulo`}
          InputLabelProps={{ shrink: true }}
          inputProps={{ maxLength: 35 }}
        />
      </div>
    </div>
  );
}

export default EventoDetalhes;
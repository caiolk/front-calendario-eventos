import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { TextField, Box, Paper, Select , Button, Snackbar, Alert, Backdrop, CircularProgress, Switch } from '@mui/material';
import api from '../../services/api';
import ISessaoParametros from '../../shared/interfaces/ISessaoParametros'
import IEventoDetalhesParam from '../../shared/interfaces/IEventoDetalhesParam'
import useStyles from './styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import ptBR from 'dayjs/locale/pt-br';
import moment from "moment";

interface IDetalhesParam{
  eventoDetalhes: IEventoDetalhesParam
}
const EventoDetalhes = (eventoDetalhes: IDetalhesParam) => {
  const classes = useStyles();
  const [eventoTitulo,setEventoTitulo] = useState("");
  const [uf,setUF] = useState("");
  const [status,setStatus] = useState("");
  const [cidade,setCidade] = useState("");
  const [ativo,setAtivo] =  useState(false);
  const [dataEvento,setDataEvento] = useState("");
  const eventoTituloRef = useRef<HTMLInputElement>(null);
  const cidadeRef = useRef<HTMLInputElement>(null);
  const ufRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);
  const dataEventoRef = useRef<HTMLInputElement>(null);
  const ativoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(eventoDetalhes.eventoDetalhes){
      setUF(String(eventoDetalhes.eventoDetalhes.uf))
      setStatus(String(eventoDetalhes.eventoDetalhes.status_string))
      setCidade(String(eventoDetalhes.eventoDetalhes.cidade))
      setDataEvento(String(eventoDetalhes.eventoDetalhes.evento_data_realizacao));
      setAtivo((eventoDetalhes.eventoDetalhes.ativo === 1 ? true : false));
    }
  },[eventoDetalhes]);

  return (
    <div style={{width : '100%'}}>
      <div className={classes.divPrincipal}>
        <div style={{display : 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  }} >
          <TextField 
            label="Título Evento" autoComplete={'false'} size={'small'} className={classes.divValor}
            defaultValue={eventoDetalhes.eventoDetalhes.evento_titulo} onChange={(event:any) => {}}
            id={`evento_titulo`}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 35 }}
            inputRef={eventoTituloRef}
          />
          <TextField 
            select id={`uf`} label="UF" size={'small'}
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: true }}
            onChange={(event:any) => setUF(event.value) } 
            value={uf}
            inputRef={ufRef}
          >
            <option value={'-'} > -  </option>
            <option value={'PR'}> PR </option>
            <option value={'SC'}> SC </option>
            <option value={'RS'}> RS </option>
            <option value={'SP'}> SP </option>
            <option value={'RJ'}> RJ </option>
          </TextField>
          <TextField 
            id={`cidade`} label="Cidade" autoComplete={'false'} size={'small'} className={classes.divValor}
            defaultValue={eventoDetalhes.eventoDetalhes.cidade} onChange={(event:any) => setCidade(event.value)}
            InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 35 }}
            inputRef={cidadeRef}
          />
        </div>
      </div> 
      <div style={{display : 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  }} >
        <TextField 
          label="Url Inscrição" autoComplete={'false'} size={'small'} className={classes.divValor}
          defaultValue={eventoDetalhes.eventoDetalhes.url_pagina} onChange={(event:any) => {}}
          id={`url_pagina`}
          InputLabelProps={{ shrink: true }}
          inputProps={{ maxLength: 100 }}
        />
 
        <TextField 
          label="Organizador" autoComplete={'false'} size={'small'} className={classes.divValor}
          defaultValue={eventoDetalhes.eventoDetalhes.organizador?.nome_fantasia} onChange={(event:any) => {}}
          id={`organizador`}
          InputLabelProps={{ shrink: true }}
          inputProps={{ maxLength: 100 }}
          disabled={true}
        />
      </div>
      <div className={classes.divPrincipal}>
        <TextField 
          label="Realização" autoComplete={'false'} size={'small'} className={classes.divValor}
          defaultValue={eventoDetalhes.eventoDetalhes.evento_data_realizacao} onChange={(event:any) => {}}
          id={`data_evento`}
          InputLabelProps={{ shrink: true }}
          inputProps={{ maxLength: 100 }}
        />
      </div>
      <div className={classes.divPrincipal}>
        <TextField
          id={`status`}
          select
          inputRef={statusRef}
          label="Status"
          size={'small'}
          InputLabelProps={{ shrink: true }}
          SelectProps={{ native: true }}
          value={status}
          onChange={(event:any) => setStatus(event.value)} 
        >
          <option value={'Aberto'}> Aberto </option>
          <option value={'Encerrado'}> Encerrado </option>
          <option value={'Cancelado'}> Cancelado </option>
          <option value={'Esgotado'}>  Esgotado </option>
        </TextField>
      
        <Switch color="primary"  size="medium"  checked={ativo} inputRef={ativoRef} onChange={(event:any) => setAtivo(event.target.checked)} />
      </div>
    </div>
  );
}

export default EventoDetalhes;
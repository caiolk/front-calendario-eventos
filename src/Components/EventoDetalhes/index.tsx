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
  const session = useSelector( (state:ISessaoParametros) => state.session );
  const [eventoTitulo,setEventoTitulo] = useState("");
  const [uf,setUF] = useState("");
  const [status,setStatus] = useState("");
  const [cidade,setCidade] = useState("");
  const [ativo,setAtivo] =  useState(false);
  const [dataEvento,setDataEvento] = useState("");
  const [urlPagina,setUrlPagina] = useState("");
  const [disabled,setDisabled] = useState(false);
  const eventoTituloRef = useRef<HTMLInputElement>(null);
  const cidadeRef = useRef<HTMLInputElement>(null);
  const ufRef = useRef<HTMLInputElement>(null);
  const urlPaginaRef = useRef<HTMLInputElement>(null);
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

  async function salvarEvento(uuidEvento:string){
    setDisabled(true);
    let evento = mountData();
    return await api.put(`/eventos/${uuidEvento}`, {...evento},
        { headers: {
            'Authorization': `Bearer ${session.access_token.access_token}`
        } }).then( (result:any) => {
            console.log(result);
            setDisabled(false);
        }).catch( (error:any) => {
          setDisabled(false);
        })
  }

  function mountData(){
    return {
      "uuid": eventoDetalhes.eventoDetalhes.uuid,
      "evento_titulo": eventoTituloRef.current?.value,
      "organizador_uuid": eventoDetalhes.eventoDetalhes.organizador_uuid,
      "uf" : ufRef.current?.value,
      "cidade" : cidadeRef.current?.value,
      "url_pagina": urlPaginaRef.current?.value,
      "evento_data_realizacao": dataEventoRef.current?.value,
      "status_string": statusRef.current?.value,
      "ativo": ativoRef.current?.checked === true ? 1 : 0 ,
    };
  }

  return (
    <div style={{width : '100%'}}>
      <div className={classes.divRow} >
        <TextField 
          id={`evento_titulo`} label="Título Evento" autoComplete={'false'} size={'small'} className={classes.divValor}
          defaultValue={eventoDetalhes.eventoDetalhes.evento_titulo} onChange={(event:any) => setEventoTitulo(event.value) }
          InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '45vw'}}
          inputRef={eventoTituloRef}
          disabled={disabled}
        />
        <TextField 
          select id={`uf`} label="UF" size={'small'} InputLabelProps={{ shrink: true }}
          SelectProps={{ native: true }} onChange={(event:any) => setUF(event.value) }  value={uf}
          inputRef={ufRef}
          disabled={disabled}
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
          InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }}
          inputRef={cidadeRef} disabled={disabled}
        />
      </div>
      <div className={classes.divRow} >
        <TextField 
            id={`url_pagina`} label="Link Inscrição" autoComplete={'false'} size={'small'} className={classes.divValor}
            defaultValue={eventoDetalhes.eventoDetalhes.url_pagina} onChange={(event:any) => {}}
            InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 200 }} style={{ width: '100vw'}}
            inputRef={urlPaginaRef} disabled={disabled}
          />
      </div> 
      <div className={classes.divRow} >
        <TextField 
            id={`organizador`} label="Organizador" autoComplete={'false'} size={'small'} className={classes.divValor}
            defaultValue={eventoDetalhes.eventoDetalhes.organizador?.nome_fantasia} disabled={true}
            InputLabelProps={{ shrink: true }} style={{ width: '40vw'}}
        />
        <TextField 
          id={`data_evento`} label="Realização" autoComplete={'false'} size={'small'} className={classes.divValor}
          defaultValue={eventoDetalhes.eventoDetalhes.evento_data_realizacao} onChange={(event:any) => {}}
          InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '15vw'}} 
          inputRef={dataEventoRef} disabled={disabled}
        />
        <TextField
          select id={`status`} label="Status" size={'small'}
          InputLabelProps={{ shrink: true }} SelectProps={{ native: true }}
          value={status} onChange={(event:any) => setStatus(event.value)} 
          inputRef={statusRef} disabled={disabled}
        >
          <option value={'Aberto'}   > Aberto    </option>
          <option value={'Encerrado'}> Encerrado </option>
          <option value={'Cancelado'}> Cancelado </option>
          <option value={'Esgotado'} > Esgotado  </option>
        </TextField>
        <Switch color="primary"  size="medium"  checked={ativo} disabled={disabled} onChange={(event:any) => setAtivo(event.target.checked)} inputRef={ativoRef} />
      </div>
      <div className={classes.divRowEnd} >
        <div style={{marginRight: '10px'}}>
          {disabled ? (<><CircularProgress size={30} /></>) : (<></>)}
        </div>
        <div>
        <Button 
          className={classes.buttonBuscar}
          style={{ background: (disabled ? '#c1c1c1' : '#04ccb9' ), color:'#fff' }}
          variant="contained" size="small" onClick={() => salvarEvento(String(eventoDetalhes.eventoDetalhes.uuid))} 
          disabled={disabled}
        >
           Salvar
        </Button>
        </div>
      </div>
    </div>
  );
}

export default EventoDetalhes;
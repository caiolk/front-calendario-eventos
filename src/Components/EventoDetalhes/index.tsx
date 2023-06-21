import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, CircularProgress, Switch, Autocomplete } from '@mui/material';
import { debounce } from "lodash"
import api from '../../services/api';
import ISessaoParametros from '../../shared/interfaces/ISessaoParametros'
import IEventoDetalhesParam from '../../shared/interfaces/IEventoDetalhesParam'
import useStyles from './styles';
import { setAlertCustom } from '../../store/actions/AlertCustom.action';

interface IDetalhesParam{
  eventoDetalhes: IEventoDetalhesParam,
  tipo?: string
}

interface IOrganizadorDetalhesParam{
  uuid?:string,
  nome_fantasia?:string,
  site?:string
}

const EventoDetalhes = (eventoDetalhes: IDetalhesParam, tipo?:string) => {
  const classes = useStyles();
  const session = useSelector( (state:ISessaoParametros) => state.session );
  const dispatch = useDispatch();
  const [eventoTitulo,setEventoTitulo] = useState("");
  const [uf,setUF] = useState("");
  const [status,setStatus] = useState("");
  const [cidade,setCidade] = useState("");
  const [ativo,setAtivo] =  useState(false);
  const [dataEvento,setDataEvento] = useState("");
  const [urlPagina,setUrlPagina] = useState("");
  const [disabled,setDisabled] = useState(false);
  const [organizador,setOrganizador] = useState<IOrganizadorDetalhesParam>({})
  const [firstTime,setFirstTime] = useState(true);
  const eventoTituloRef = useRef<HTMLInputElement>(null);
  const cidadeRef = useRef<HTMLInputElement>(null);
  const ufRef = useRef<HTMLInputElement>(null);
  const urlPaginaRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);
  const dataEventoRef = useRef<HTMLInputElement>(null);
  const ativoRef = useRef<HTMLInputElement>(null);
  const organizadorRef = useRef<HTMLInputElement>(null);
  const fonteRef = useRef<HTMLInputElement>(null);
  const tipoCorridaRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [loadingInput, setLoadingInput] = useState(false);
  const [dados, setDados] = useState( eventoDetalhes.eventoDetalhes.organizador ? [eventoDetalhes.eventoDetalhes.organizador] : []);
  const [busca, setBusca] = useState(null);
  const [tipoModal, setTipoModal] = useState("");
  const [listaTipoCorridas, setListaTipoCorridas] = useState([]);
  const [listaFontes, setListaFontes] = useState([]);
  const [fonte, setFonte] = useState("");
  const [tipoCorrida, setTipoCorrida] = useState("");

  useEffect(() => {
    if(eventoDetalhes.eventoDetalhes){
      setUF(String(eventoDetalhes.eventoDetalhes.uf))
      setStatus(String(eventoDetalhes.eventoDetalhes.status_string))
      setCidade(String(eventoDetalhes.eventoDetalhes.cidade))
      setDataEvento(String(eventoDetalhes.eventoDetalhes.evento_data_realizacao));
      setAtivo((eventoDetalhes.eventoDetalhes.ativo === 1 ? true : false));
      setOrganizador(eventoDetalhes.eventoDetalhes.organizador || {});
      setFonte(eventoDetalhes.eventoDetalhes.fonte?.uuid || "")
      setTipoCorrida(eventoDetalhes.eventoDetalhes.tipo?.uuid || "")
    }
    if(eventoDetalhes.tipo !== undefined && eventoDetalhes.tipo !== ""){
      setTipoModal(eventoDetalhes.tipo)
      setFirstTime(false);
    }
  },[eventoDetalhes, tipo]);

  async function salvarEvento(uuidEvento?:string){
    dispatch(setAlertCustom({ mensagens: [], title: '', open: false, type: 'info'}));
    setDisabled(true);
    let evento = mountData();

    if(tipoModal == 'novo'){
      return await api.post(`/eventos/`, {...evento},
        { headers: {
            'Authorization': `Bearer ${session.access_token.access_token}`
        }}).then( (result:any) => {
            dispatch(setAlertCustom({ mensagens: ['Evento salvo com sucesso!'], title: 'Sucesso', open: true, type: 'success'}));
            setDisabled(false);
        }).catch( (error:any) => {
          setDisabled(false);
          dispatch(setAlertCustom({ mensagens: ['Erro ao salvar!'], title: 'Erro', open: true, type: 'error'}));
        })  
    }
    return await api.put(`/eventos/${uuidEvento}`, {...evento},
        { headers: {
            'Authorization': `Bearer ${session.access_token.access_token}`
        }}).then( (result:any) => {
            dispatch(setAlertCustom({ mensagens: ['Evento salvo com sucesso!'], title: 'Sucesso', open: true, type: 'success'}));
            setDisabled(false);
        }).catch( (error:any) => {
          setDisabled(false);
          dispatch(setAlertCustom({ mensagens: ['Erro ao salvar!'], title: 'Erro', open: true, type: 'error'}));
        })
  }
  useEffect(() => {
    buscaTipoCorridas();
    buscaFontes();
      if(!firstTime){
        const delayDebounceFn = setTimeout(() => {
          buscaOrganizadores();
        }, 500)
       
        return () => { clearTimeout(delayDebounceFn); setBusca(null); setLoadingInput(false); }
      }
  }, [busca, firstTime])

  const buscaOrganizadores = useCallback( async () => {
    let _organizador = organizadorRef.current?.value;
    if(_organizador!=="" || tipoModal !== ""){
      setLoadingInput(true);
      return await api.get( `/organizador?nome_fantasia=${organizadorRef.current?.value}`,
        { headers: {
            'Authorization': `Bearer ${session.access_token.access_token}`
        } }).then( (result:any) => {
            if(result.data.status !== false){
              setDados(result.data.data);
            }
            setLoadingInput(false);
        }).catch( (error:any) => {
            setDados([]);
            setLoadingInput(false);
        })
       
    }
  },[])

  const buscaTipoCorridas = useCallback( async () => {
      return await api.get( `/tipos/`,
        { headers: {
            'Authorization': `Bearer ${session.access_token.access_token}`
        } }).then( (result:any) => {
            if(result.data.status !== false){
              setListaTipoCorridas(result.data.data);
            }
            
        }).catch( (error:any) => {
          setListaTipoCorridas([]);
        })
  },[])

  const buscaFontes = useCallback( async () => {
    return await api.get( `/fontes/`,
      { headers: {
          'Authorization': `Bearer ${session.access_token.access_token}`
      } }).then( (result:any) => {
          if(result.data.status !== false){
            setListaFontes(result.data.data);
          }
          
      }).catch( (error:any) => {
        setListaFontes([]);
      })
  },[])

  function mountData(){

    let data = {
      "evento_titulo": eventoTituloRef.current?.value,
      "organizador_uuid": organizador.uuid ?? null,
      "uf" : ufRef.current?.value,
      "cidade" : cidadeRef.current?.value,
      "url_pagina": urlPaginaRef.current?.value,
      "evento_data_realizacao": dataEventoRef.current?.value,
      "status_string": statusRef.current?.value,
      "fonte_uuid": fonteRef.current?.value,
      "tipo_evento_uuid": tipoCorridaRef.current?.value,
      "ativo": ativoRef.current?.checked === true ? 1 : 0 ,
    };
    if(eventoDetalhes.eventoDetalhes.uuid !== undefined){
      data = Object.assign(data, { "uuid" : eventoDetalhes.eventoDetalhes.uuid});
    }
    
    return data;
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
    <Autocomplete
        id="organizador"
        size={'small'} sx={{ width: 510 }}
        open={open}
        onOpen={() =>  { setOpen(true); }}
        onClose={() => { setOpen(false); }}
        defaultValue={eventoDetalhes.eventoDetalhes.organizador}
        isOptionEqualToValue={(option:any, value:any) => option.nome_fantasia === value.nome_fantasia }
        getOptionLabel={(option:any) => option.nome_fantasia}
        options={dados}
        onChange={(event, novoOrganizador:any) => { setOrganizador(novoOrganizador); }}  
        disabled={disabled}
        loading={loadingInput}
        renderInput={(params) => (
          <TextField
            required
            {...params}
            label="Organizador"
            inputRef={organizadorRef}
            onChange={(event:any) => { setBusca(event.value); setFirstTime(false); }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingInput ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
        />
      )}
      />
      <TextField 
        id={`data_evento`} label="Realização" autoComplete={'false'} size={'small'} className={classes.divValor}
        defaultValue={eventoDetalhes.eventoDetalhes.evento_data_realizacao} onChange={(event:any) => {}}
        InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '15vw'}} 
        inputRef={dataEventoRef} disabled={disabled} type='date'
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
      <TextField
          select id={`tipoCorrida`} label="Tipo Corrida" size={'small'}
          InputLabelProps={{ shrink: true }} SelectProps={{ native: true }}
          value={tipoCorrida} onChange={(event:any) => setTipoCorrida(event.value) } 
          inputRef={tipoCorridaRef} disabled={disabled}
        >
        <option value={''}> - </option>
        { listaTipoCorridas.length > 0 ? listaTipoCorridas.map( ( tipoCorrida:any ) => { return (<><option value={tipoCorrida.uuid}> {tipoCorrida.nome} </option></>) }) :'' }
      </TextField>
      <TextField
        select id={`fonte`} label="Fonte" size={'small'}
        InputLabelProps={{ shrink: true }} SelectProps={{ native: true }}
        value={fonte} onChange={(event:any) => setFonte(event.value)} 
        inputRef={fonteRef} disabled={disabled}
      >
        <option value={''}> - </option>
        { listaFontes.length > 0 ? listaFontes.map( ( fonte:any ) => { return (<><option value={fonte.uuid}> {fonte.nome} </option></>) }) :'' }
      </TextField>
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
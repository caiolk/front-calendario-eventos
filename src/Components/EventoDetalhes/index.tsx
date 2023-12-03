import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, CircularProgress, Switch, Autocomplete } from '@mui/material';
import { debounce, first } from "lodash"
import api from '../../services/api';
import ISessaoParametros from '../../shared/interfaces/ISessaoParametros'
import IEventoDetalhesParam from '../../shared/interfaces/IEventoDetalhesParam'
import ITipoCorridas from '../../shared/interfaces/ITipoCorridas'
import IFonteCorridas from '../../shared/interfaces/IFonteCorridas'
import useStyles from './styles';
import { setAlertCustom } from '../../store/actions/AlertCustom.action';
import { setDivulgarEvento, getDivulgarEvento } from '../../store/actions/DivulgarEvento.action';
import IDivulgarParametros from '../../shared/interfaces/IDivulgarParametros';

import EditIcon from '@mui/icons-material/Edit';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { NumericFormat } from "react-number-format";


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
  const divulgarEvento = useSelector( (state:IDivulgarParametros) => state.divulgarEvento );
  const dispatch = useDispatch();
  const [eventoTitulo,setEventoTitulo] = useState("");
  const [uf,setUF] = useState("");
  const [status,setStatus] = useState("");
  const [cidade,setCidade] = useState("");
  const [endereco,setEndereco] = useState("");
  const [cep,setCep] = useState("");
  const [coordenadas,setCoordenadas] = useState("");
  const [ativo,setAtivo] =  useState(false);
  const [dataEvento,setDataEvento] = useState("");
  const [urlPagina,setUrlPagina] = useState("");
  const [disabled,setDisabled] = useState(false);
  const [organizador,setOrganizador] = useState<IOrganizadorDetalhesParam>({})
  const [firstTime,setFirstTime] = useState(true);
  const eventoTituloRef = useRef<HTMLInputElement>(null);
  const enderecoRef = useRef<HTMLInputElement>(null);
  const cidadeRef = useRef<HTMLInputElement>(null);
  const ufRef = useRef<HTMLInputElement>(null);
  const cepRef = useRef<HTMLInputElement>(null);
  const coordenadasRef = useRef<HTMLInputElement>(null);
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
  const [fonte, setFonte] = useState("");
  const [tipoCorrida, setTipoCorrida] = useState("");
  const [divulgar, setDivulgar] = useState(false);
  const listaTipoCorridas = useSelector( (state:ITipoCorridas) => state.tipoCorridas );
  const listaFontes = useSelector( (state:IFonteCorridas) => state.fonteCorridas );
  const listaStatus = useSelector( (state:any) => state.status );
  const listaEstados = useSelector( (state:any) => state.estados );
  
  const loteRef = useRef<HTMLInputElement>(null);
  const descricaoRef = useRef<HTMLInputElement>(null);
  const inicioLoteRef = useRef<HTMLInputElement>(null);
  const fimLoteRef = useRef<HTMLInputElement>(null);
  const [valor,setValor] = useState("");
  const [inscricoes, setInscricoes] = useState({});
  const [lotes, setLotes] = useState([]);
  const [uuidInscricao, setUuidInscricao] = useState("");
  const [uuidInscricaoDeletar, setUuidInscricaoDeletar] = useState("");
  const [tipoDeletar, setTipoDeletar] = useState("");
  const [loteNome, setNomeLote] = useState("");
  const [loteUuid, setUuidLote] = useState("");
  const [descricao, setDescricao] = useState("");
  const [inicioLote, setInicioLote] = useState("");
  const [fimLote, setFimLote] = useState("");
  const [statusDivulgar, setStatusDivulgar] = useState(false)

  useEffect(() => {
    if(eventoDetalhes.eventoDetalhes){
      setUF(String(eventoDetalhes.eventoDetalhes.uf))
      setStatus(String(eventoDetalhes.eventoDetalhes.status_string))
      setCidade(String(eventoDetalhes.eventoDetalhes.cidade))
      setEndereco(String(eventoDetalhes.eventoDetalhes.endereco))
      setCep(String(eventoDetalhes.eventoDetalhes.cep))
      setCoordenadas(String(eventoDetalhes.eventoDetalhes.coordenadas))
      setDataEvento(String(eventoDetalhes.eventoDetalhes.evento_data_realizacao));
      setAtivo((eventoDetalhes.eventoDetalhes.ativo === 1 ? true : false));
      setOrganizador(eventoDetalhes.eventoDetalhes.organizador || {});
      setFonte(eventoDetalhes.eventoDetalhes.fonte?.uuid || "")
      setTipoCorrida(eventoDetalhes.eventoDetalhes.tipo?.uuid || "")
      
      dispatch(setDivulgarEvento({uuidEvento: eventoDetalhes.eventoDetalhes.uuid, statusDivulgar: Boolean(eventoDetalhes.eventoDetalhes.divulgar)}));
      setDivulgar(divulgarEvento.statusDivulgar);
      
    }
    if(eventoDetalhes.tipo !== undefined && eventoDetalhes.tipo !== ""){
      setTipoModal(eventoDetalhes.tipo)
      setFirstTime(false);
    }
    
  },[eventoDetalhes, tipo]);

  useEffect(() =>{
    setDisabled(divulgarEvento.statusDivulgar);
    setStatusDivulgar(divulgarEvento.statusDivulgar);
  },[divulgarEvento])
  
  async function salvarEvento(uuidEvento?:string){
    dispatch(setAlertCustom({ mensagens: [], title: '', open: false, type: 'info'}));
    setDisabled(true);
    let evento = mountData();

    if(tipoModal === 'novo'){
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

  async function dilvugarEvento(uuidEvento?:string, divulgarBoolean?: any){

    return await api.patch(`/eventos/${uuidEvento}`, { "divulgar" : divulgarBoolean },
    { headers: {
        'Authorization': `Bearer ${session.access_token.access_token}`
    }}).then( (result:any) => {
      setDivulgar(divulgarBoolean)
      dispatch(setDivulgarEvento({ uuidEvento: eventoDetalhes.eventoDetalhes.uuid, statusDivulgar: divulgarBoolean }));   
      dispatch(setAlertCustom({ mensagens: ['Evento atualizado com sucesso!'], title: 'Sucesso', open: true, type: 'success'}));
      
    }).catch( (error:any) => {
      dispatch(setAlertCustom({ mensagens: ['Erro ao atualizar!'], title: 'Erro', open: true, type: 'error'}));
    })
  }

  useEffect(() => {
      if(!firstTime){
        const delayDebounceFn = setTimeout(() => {
          buscaOrganizadores();
        }, 500)
       
        return () => { clearTimeout(delayDebounceFn); setBusca(null); setLoadingInput(false); }
      }
      if(eventoDetalhes.eventoDetalhes.uuid !== undefined && tipoModal.trim() !=='novo'){
        buscarInscricoesEvento(eventoDetalhes.eventoDetalhes.uuid);
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

  function mountData(){

    let data = {
      "evento_titulo": eventoTituloRef.current?.value,
      "organizador_uuid": organizador.uuid ?? null,
      "uf" : ufRef.current?.value,
      "cidade" : cidadeRef.current?.value,
      "endereco" : enderecoRef.current?.value,
      "cep" : cepRef.current?.value,
      "coordenadas" : coordenadasRef.current?.value,
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

  const handleClose = () => {
    setOpen(false);
  };

  function resetar(){
    setUuidInscricao("");
    setNomeLote("");
    setUuidLote("");
    setDescricao("");
    setValor("");
    setInicioLote("");
    setFimLote("");
  }
  async function buscarInscricoesEvento(uuidEvento?:string)
  {
    let inscricao = mountDataLote();

    return await api.get(`/inscricao/${uuidEvento}`,
      { headers: {
          'Authorization': `Bearer ${session.access_token.access_token}`
      }}).then( (result:any) => {
          setInscricoes(result.data.data)
   
      }).catch( (error:any) => {
        setInscricoes({})
   
      }) 
  }


  async function buscaLotes()
  {
    setDisabled(true);
    let inscricao = mountDataLote();

    return await api.get(`/inscricao/lotes?eventos_uuid=${eventoDetalhes.eventoDetalhes.uuid}&lote=P`,
      { headers: {
          'Authorization': `Bearer ${session.access_token.access_token}`
      }}).then( (result:any) => {
          setLotes(result.data.data)
          setDisabled(false);
      }).catch( (error:any) => {
        setLotes([])
        setDisabled(false);
      }) 
  }

  async function editar(uuidInscricao?:string){
    
    if(Object.values(inscricoes).length >0 && uuidInscricao !== undefined){
      Object.values(inscricoes).map((inscricao:any) => {
        inscricao.map( (item:any) => {
          if(item.uuid === uuidInscricao){
              setUuidInscricao(item.uuid);
              setNomeLote(item.lote.nome);
              setUuidLote(item.lote.uuid);
              setDescricao(item.descricao);
              setValor(item.valor_formatado);
              setInicioLote(item.lote.data_inicio);
              setFimLote(item.lote.data_fim);
          }
        })
      })
    }
  }

  async function deletar(uuid?:string){
    dispatch(setAlertCustom({ mensagens: [], title: '', open: false, type: 'info'}));
    setDisabled(true);
    
    let url = tipoDeletar === 'Lote' ? `/inscricao/${uuid}/lote` :  `/inscricao/${uuid}`;

    return await api.delete(url,
      { headers: {
          'Authorization': `Bearer ${session.access_token.access_token}`
      }}).then( (result:any) => {
          dispatch(setAlertCustom({ mensagens: [`${tipoDeletar} deletado com sucesso!`], title: 'Sucesso', open: true, type: 'success'}));
          buscarInscricoesEvento(eventoDetalhes.eventoDetalhes.uuid);
          setDisabled(false);
      }).catch( (error:any) => {
        setDisabled(false);
        dispatch(setAlertCustom({ mensagens: [`Erro ao remover ${tipoDeletar}!`], title: 'Erro', open: true, type: 'error'}));
      })  
    
  }

  async function salvar(uuidEvento?:string){
    dispatch(setAlertCustom({ mensagens: [], title: '', open: false, type: 'info'}));
    setDisabled(true);
    let inscricao = mountDataLote();

    return await api.post(`/inscricao/`, {...inscricao},
      { headers: {
          'Authorization': `Bearer ${session.access_token.access_token}`
      }}).then( (result:any) => {
          dispatch(setAlertCustom({ mensagens: ['Inscricao salva com sucesso!'], title: 'Sucesso', open: true, type: 'success'}));
          buscarInscricoesEvento(eventoDetalhes.eventoDetalhes.uuid);
          setDisabled(false);
      }).catch( (error:any) => {
        setDisabled(false);
        dispatch(setAlertCustom({ mensagens: ['Erro ao salvar!'], title: 'Erro', open: true, type: 'error'}));
      })  
    
  }

  function mountDataLote(){

    let data:any = {
      "eventos_uuid": eventoDetalhes.eventoDetalhes.uuid,
      "titulo": loteNome,
      "lote_uuid": loteUuid,
      "lote": loteNome,
      "nome": loteNome,
      "descricao": descricaoRef.current?.value,
      "valor": parseFloat(valor.replace(",",".")).toFixed(2),
      "data_inicio": inicioLoteRef.current?.value,
      "data_fim": fimLoteRef.current?.value,
    };
    if(uuidInscricao !== "" && uuidInscricao !== undefined){
      data.uuid = uuidInscricao;
    }
    return data;
  }

  return (
    <div style={{width : '100%', height: '67vh', display:'flex', flexDirection: 'column'}}>
      <div className={classes.divRow} >
        <TextField 
          id={`evento_titulo`} label="Título Evento" autoComplete={'false'} size={'small'} className={classes.divValor}
          defaultValue={eventoDetalhes.eventoDetalhes.evento_titulo} onChange={(event:any) => setEventoTitulo(event.value) }
          InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '45vw'}}
          inputRef={eventoTituloRef}
          disabled={disabled}
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
          { listaStatus !== undefined && listaStatus.length > 0 ? listaStatus.map( ( _status:any ) => { return (<><option value={_status}> {_status} </option></>) }) :'' }
        </TextField>
        <Switch color="primary"  size="medium"  checked={ativo} disabled={disabled} onChange={(event:any) => setAtivo(event.target.checked)} inputRef={ativoRef} />
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
            id={`endereco`} label="Endereço" autoComplete={'false'} size={'small'} className={classes.divValor}
            defaultValue={eventoDetalhes.eventoDetalhes.endereco} onChange={(event:any) => {}}
            InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 200 }} style={{ width: '100vw'}}
            inputRef={enderecoRef} disabled={disabled}
          />
      </div> 
      <div className={classes.divRow} >
      <TextField 
          select id={`uf`} label="UF" size={'small'} InputLabelProps={{ shrink: true }}
          SelectProps={{ native: true }} onChange={(event:any) => setUF(event.value) }  value={uf}
          inputRef={ufRef}
          disabled={disabled}
        >
          <option value={'-'} > -  </option>
          { listaEstados !== undefined && listaEstados.length > 0 ? listaEstados.map( ( uf:any ) => { return (<><option value={uf}> {uf} </option></>) }) :'' }
        </TextField>
        <TextField 
          id={`cidade`} label="Cidade" autoComplete={'false'} size={'small'} className={classes.divValor}
          defaultValue={eventoDetalhes.eventoDetalhes.cidade} onChange={(event:any) => setCidade(event.value)}
          InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }}
          inputRef={cidadeRef} disabled={disabled}
        />
        <TextField 
          id={`cep`} label="Cep" autoComplete={'false'} size={'small'} className={classes.divValor}
          defaultValue={eventoDetalhes.eventoDetalhes.cep} onChange={(event:any) => setCidade(event.value)}
          InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 10 }}
          inputRef={cepRef} disabled={disabled}
        />
        <TextField 
          id={`coordenadas`} label="Coordenadas" autoComplete={'false'} size={'small'} className={classes.divValor}
          defaultValue={eventoDetalhes.eventoDetalhes.coordenadas} onChange={(event:any) => setCidade(event.value)}
          InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }}
          inputRef={coordenadasRef} disabled={disabled}
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
            select id={`tipoCorrida`} label="Tipo Corrida" size={'small'}
            InputLabelProps={{ shrink: true }} SelectProps={{ native: true }}
            value={tipoCorrida} onChange={(event:any) => setTipoCorrida(event.value) } 
            inputRef={tipoCorridaRef} disabled={disabled}
          >
          <option value={''}> - </option>
          { listaTipoCorridas !== undefined && listaTipoCorridas.length > 0 ? listaTipoCorridas.map( ( tipoCorrida:any ) => { return (<><option value={tipoCorrida.uuid}> {tipoCorrida.nome} </option></>) }) :'' }
        </TextField>
        <TextField
          select id={`fonte`} label="Fonte" size={'small'}
          InputLabelProps={{ shrink: true }} SelectProps={{ native: true }}
          value={fonte} onChange={(event:any) => setFonte(event.value)} 
          inputRef={fonteRef} disabled={disabled}
        >
          <option value={''}> - </option>
          { listaFontes !== undefined && listaFontes.length > 0 ? listaFontes.map( ( fonte:any ) => { return (<><option value={fonte.uuid}> {fonte.nome} </option></>) }) :'' }
        </TextField>
        <div style={{marginRight: '10px'}}>
          {disabled && !divulgar ? (<><CircularProgress size={30} /></>) : (<></>)}
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


      <div className={classes.info} style={{ flexDirection: 'column',  justifyContent:'center', alignItems:'center',  width: '100%', marginTop: '1%' }} >
          <div>Inscrições</div>
      </div>
      <div className={classes.divRowEnd} style={{ 'height': '45vh'}} >
        <div className={classes.divPrincipalLote}>
            <div style={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', width: '100%', padding: 2}}>
              <TextField 
                id={`lote`} label="Lote" autoComplete={'false'} size={'small'} className={classes.divValor}
                value={loteNome} onChange={(event:any) => setNomeLote(event.target.value) }
                InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 10 }} style={{ width: '15vw'}}
                disabled={disabled}
                inputRef={loteRef}
              />

              {/* <Autocomplete
                      id="organizador"
                      size={'small'} sx={{ width: 510 }}
                      open={open}
                      onOpen={() =>  { setOpen(true); }}
                      onClose={() => { setOpen(false); }}
                      defaultValue={loteNome}
                      isOptionEqualToValue={(option:any, value:any) => option.lote === value.lote }
                      getOptionLabel={(option:any) => option.lote}
                      options={lotes}
                      onChange={(event, lotes:any) => { setLotes(lotes); }}  
                      disabled={disabled}
                      loading={loadingInput}
                      renderInput={(params) => (
                        <TextField
                          required
                          {...params}
                          label="Lote"
                          inputRef={loteRef}
                          onChange={(event:any) => { setNomeLote(event.value); setFirstTime(false); }}
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
                    /> */}

              <TextField 
                id={`descricao`} label="Descricao" autoComplete={'false'} size={'small'} className={classes.divValor}
                value={descricao} onChange={(event:any) => setDescricao(event.target.value) }
                InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '20vw'}}
                disabled={disabled}
                inputRef={descricaoRef}
              />

            <NumericFormat
                    id={`valor`} label="Valor" autoComplete={'false'} size={'small'} className={classes.divValor}
                    value={valor}
                    style={{ width: '10vw', }}
                    customInput={TextField}
                    InputLabelProps={{ shrink: true }}
                    onChange={(event:any) => setValor(event.target.value)}
                    decimalSeparator=","
                    decimalScale={2}
                    inputProps={{ maxLength: 10 }} 
                    InputProps={{
                      inputProps: { decimalScale: 2, maxLength: 10 , style: { textAlign: 'right'} }
                    }}
                    disabled={disabled} 
                  />
            
              <TextField 
                id={`inicio_lote`} label="Inicio" autoComplete={'false'} size={'small'} className={classes.divValor}
                defaultValue={""} value={inicioLote} onChange={(event:any) => setInicioLote(event.target.value)}
                InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '12vw'}} 
                disabled={disabled} type='date'
                inputRef={inicioLoteRef}
              />
              <TextField 
                id={`fim_lote`} label="Fim" autoComplete={'false'} size={'small'} className={classes.divValor}
                defaultValue={""} value={fimLote} onChange={(event:any) => setFimLote(event.target.value)}
                InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '12vw'}} 
                disabled={disabled} type='date'
                inputRef={fimLoteRef}
              />
              <Button 
                className={  !uuidInscricao ?  classes.btnSalvarDesabilitado : classes.btnSalvar }
                title='Resetar'
                variant="contained" size="small" onClick={() => !uuidInscricao ? '' : resetar() } 
                disabled={!uuidInscricao ? true : false}
              >
                <RestartAltIcon/>
              </Button>
              
              <Button 
                className={ statusDivulgar ? classes.btnSalvarDesabilitado : classes.btnSalvar}
                title='Salvar'
                style={{ background: (statusDivulgar  ? '#E0E0E0' : '#04ccb9') , color:'#fff' }}
                variant="contained" size="medium" onClick={() => salvar() } 
                disabled={disabled}
              >
                Salvar
              </Button>
            </div>

            {statusDivulgar ?  
              (<div style={{ display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'flex-end', width: '100%', padding: 2, fontWeight: 1 }} >
                <div style={{ display:'flex', height:'3vh', borderColor: '#000 solid 2px' ,flexDirection: 'column', alignItems: 'center', justifyContent:'center', backgroundColor:'#fdeded', color: "rgb(95, 33, 32)", width: '90%' , }} >
                  Para editar os lotes, cancele a divulgação do evento.
                </div>
              </div>) : (<></>)  
            }
          
            <div style={{ display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', width: '100%', padding: 2, fontWeight: 1, overflow: 'auto', height: '50vh' }}>
              {inscricoes !== null && inscricoes !== undefined && Object.keys(inscricoes).length > 0  ? 
                  (<div style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'flex-start', width: '100%', padding: 2, fontWeight: 1, height: '100%' }}>
                    
                    { Object.values(inscricoes).map( (inscricao:any) => {
                      return (
                          <div style={{ marginBottom:'10px',width: '90%', border: '0.2px #c6c6c6 solid', borderRadius: '5px 5px 5px 5px' }} > 
                            <div style={{ fontSize: '18px', borderBottom: '0.2px #c6c6c6 solid', display:'flex', flexDirection: 'row', alignItems: 'center', width: '100%', padding: 5, fontWeight: 1 }} >

                              <div style={{ fontSize: '18px', borderRight: '1px #c6c6c6 solid', backgroundColor:'#c6c6c6', borderRadius: '2px 2px 2px 2px', display:'flex', width: '20%', flexDirection: 'row', alignItems: 'center', justifyContent:'flex-start', padding: 5, fontWeight: 1 }}>
                                {inscricao[0]['lote']['nome']}
                              </div>
                              <div style={{ display:'flex', flexDirection: 'row', alignItems: 'center', width: '100%', padding: 5, fontWeight: 1 }} >
                                <span  style={{ fontWeight: 'bold', color: ( inscricao[0]['lote']['status_lote'] ? 'green' : 'red')}} > 
                                  {inscricao[0]['lote']['data_inicio_formatada']} à {inscricao[0]['lote']['data_fim_formatada']}
                                  <span style={{ fontSize: '12px'}} > &nbsp;({inscricao[0]['lote']['status_lote_string']}) </span>
                                </span>
                              </div> 
                              <div style={{ display:'flex', flexDirection: 'row'}} >
                                <IconButton size='small' aria-label="delete" color="error" onClick={ () => { 
                                    setOpen(true); 
                                    setUuidInscricaoDeletar(inscricao[0]['lote']['uuid']); 
                                    setTipoDeletar('Lote');
                                    } }
                                    disabled={disabled}
                                    >
                                  <HighlightOffIcon  fontSize="inherit"/>
                                </IconButton>
                              </div> 
                              
                            </div>
                          { Object.values(inscricao).map((item:any) => {
                            return <div style={{ display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', width: '100%', fontWeight: 1}}>
                                      <div style={{ marginLeft: 12}}> {item.descricao} - R$ {item.valor_formatado} </div>
                                      <div> 
                                          <IconButton aria-label="delete" color="info" onClick={ () => editar(item.uuid) } disabled={disabled} >
                                            <EditIcon fontSize="inherit"  />
                                          </IconButton>
                                          <IconButton aria-label="delete" color="error" onClick={ () => { setOpen(true); setUuidInscricaoDeletar(item.uuid); setTipoDeletar('Inscrição'); } } disabled={disabled}>
                                            <HighlightOffIcon  fontSize="inherit"/>
                                          </IconButton>
                                        </div>
                                    </div>
                          })}
                          
                          </div>
                          
                      )
                    })
                    }
                  </div>) : 
                  (<></>)
              } 
            </div>
            <div style={{ display:'flex', flexDirection: 'column', backgroundColor:'#c6c6c6', width: '100%' , alignItems: 'center', marginTop: '1%'}} >
                <Button 
                  className={classes.buttonBuscar}
                  style={{ background: ( divulgar ? '#2e7d32' : '#c1c1c1' ), color: '#fff', width: '100%'   }}
                  variant="contained" size="small" onClick={() => dilvugarEvento(String(eventoDetalhes.eventoDetalhes.uuid), !divulgar)} 
                >
                  <strong>{ divulgar ? 'Evento divulgado' : 'Divulgar evento'}</strong>
                </Button>
              </div>
            <div>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {`Exclusão de ${tipoDeletar}?`}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {`Deseja mesmo excluir? (${tipoDeletar})`}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Não</Button>
                  <Button onClick={() => { handleClose(); deletar(uuidInscricaoDeletar); }} autoFocus>
                    Sim
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
      </div>

    </div> 
  </div>
  );
}

export default EventoDetalhes;
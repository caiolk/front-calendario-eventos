import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, CircularProgress, Switch, Autocomplete } from '@mui/material';
import { debounce } from "lodash"
import api from '../../services/api';
import ISessaoParametros from '../../shared/interfaces/ISessaoParametros'
import IDivulgarParametros from '../../shared/interfaces/IDivulgarParametros';
import NumberFormatCustom from '../../Components/NumberFormatCustom';
import useStyles from './styles';
import { setAlertCustom } from '../../store/actions/AlertCustom.action';
import SaveIcon from '@mui/icons-material/Save';
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



interface IEventoProps{
  eventoUid: string
}

const InscricaoCard = (eventoUid?:IEventoProps) => {
  const classes = useStyles();
  const session = useSelector( (state:ISessaoParametros) => state.session );
  const divulgarEvento = useSelector( (state:IDivulgarParametros) => state.divulgarEvento );
  const dispatch = useDispatch();
  const [disabled,setDisabled] = useState(false);
  const loteRef = useRef<HTMLInputElement>(null);
  const descricaoRef = useRef<HTMLInputElement>(null);
  const inicioLoteRef = useRef<HTMLInputElement>(null);
  const fimLoteRef = useRef<HTMLInputElement>(null);
  const [valor,setValor] = useState("");
  const [firstTime, setFirstTime] = useState(true);
  const [open, setOpen] = useState(false);
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
  const [loadingInput, setLoadingInput] = useState(false);
  const [statusDivulgar, setStatusDivulgar] = useState(false)
  
  useEffect(() => {
    setStatusDivulgar(divulgarEvento.statusDivulgar);
  })
  async function salvar(uuidEvento?:string){
    dispatch(setAlertCustom({ mensagens: [], title: '', open: false, type: 'info'}));
    setDisabled(true);
    let inscricao = mountData();

    return await api.post(`/inscricao/`, {...inscricao},
      { headers: {
          'Authorization': `Bearer ${session.access_token.access_token}`
      }}).then( (result:any) => {
          dispatch(setAlertCustom({ mensagens: ['Inscricao salva com sucesso!'], title: 'Sucesso', open: true, type: 'success'}));
          buscarInscricoesEvento(eventoUid?.eventoUid);
          setDisabled(false);
      }).catch( (error:any) => {
        setDisabled(false);
        dispatch(setAlertCustom({ mensagens: ['Erro ao salvar!'], title: 'Erro', open: true, type: 'error'}));
      })  
    
  }
  
  async function atualizar()
  {
    let inscricao = {
      "uuid": uuidInscricao,
      "titulo": loteNome,
      "lote_uuid": loteUuid,
      "nome": loteNome,
      "lote": loteNome,
      "descricao": descricao,
      "eventos_uuid": eventoUid?.eventoUid,
      "valor": valor,
      "data_inicio": inicioLote,
      "data_fim": fimLote,
    }

    return await api.put(`/inscricao/${uuidInscricao}`, {...inscricao},
        { headers: {
            'Authorization': `Bearer ${session.access_token.access_token}`
        }}).then( (result:any) => {
            dispatch(setAlertCustom({ mensagens: ['Inscricao atualizada com sucesso!'], title: 'Sucesso', open: true, type: 'success'}));
            setUuidInscricao("");
            setNomeLote("");
            setUuidLote("");
            setDescricao("");
            setValor("");
            setInicioLote("");
            setFimLote("");
            setDisabled(false);
            buscarInscricoesEvento(eventoUid?.eventoUid);
        }).catch( (error:any) => {
          setDisabled(false);
          dispatch(setAlertCustom({ mensagens: ['Erro ao atualizar inscrição!'], title: 'Erro', open: true, type: 'error'}));
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
          buscarInscricoesEvento(eventoUid?.eventoUid);
          setDisabled(false);
      }).catch( (error:any) => {
        setDisabled(false);
        dispatch(setAlertCustom({ mensagens: [`Erro ao remover ${tipoDeletar}!`], title: 'Erro', open: true, type: 'error'}));
      })  
    
  }

  function mountData(){

    let data:any = {
      "eventos_uuid": eventoUid?.eventoUid,
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
    setDisabled(true);
    let inscricao = mountData();

    return await api.get(`/inscricao/${uuidEvento}`,
      { headers: {
          'Authorization': `Bearer ${session.access_token.access_token}`
      }}).then( (result:any) => {
          setInscricoes(result.data.data)
          
          setDisabled(false);
      }).catch( (error:any) => {
        setInscricoes({})
        setDisabled(false);
      }) 
  }


  async function buscaLotes()
  {
    setDisabled(true);
    let inscricao = mountData();

    return await api.get(`/inscricao/lotes?eventos_uuid=${eventoUid?.eventoUid}&lote=P`,
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

  useEffect(() => {
    if(eventoUid !== undefined && eventoUid.eventoUid !== "" && firstTime){
      buscarInscricoesEvento(eventoUid?.eventoUid);
      setFirstTime(false);
      //buscaLotes();
      
    }

  },[eventoUid]);
  
  useEffect(() =>{
   
    setDisabled(statusDivulgar);
    
  },[buscaLotes])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
//   useEffect(() => {
//     if(!firstTime){
//       const delayDebounceFn = setTimeout(() => {
//         buscaLotes();
//       }, 500)
     
//       return () => { clearTimeout(delayDebounceFn); setLotes([]); setLoadingInput(false); }
//     }
// }, [lotes, firstTime])

  return (
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
          <hr style={{margin: 15}}/>
          <div style={{ display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'flex-end', width: '100%', height: '100%', padding: 2, fontWeight: 1 }} >
          {statusDivulgar ?
            (<>
              <div style={{ display:'flex', height:'3vh', borderColor: '#000 solid 2px' ,flexDirection: 'column', alignItems: 'center', justifyContent:'center', backgroundColor:'#fdeded', color: "rgb(95, 33, 32)", width: '90%' , }} >
                Para editar os lotes, cancele a divulgação do evento.
              </div>
            </>) : (<></>)  
          }
          
        </div>
          <div style={{ display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', width: '100%', padding: 2, fontWeight: 1, overflow: 'auto', height: '55vh' }}>
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
                              {inscricao[0]['lote']['data_inicio_formatada']} à {inscricao[0]['lote']['data_fim_formatada']}
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
    
  );
}

export default InscricaoCard;
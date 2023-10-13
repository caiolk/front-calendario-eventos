import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, CircularProgress, Switch, Autocomplete } from '@mui/material';
import { debounce } from "lodash"
import api from '../../services/api';
import ISessaoParametros from '../../shared/interfaces/ISessaoParametros'
import NumberFormatCustom from '../../Components/NumberFormatCustom';
import useStyles from './styles';
import { setAlertCustom } from '../../store/actions/AlertCustom.action';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



interface IEventoProps{
  eventoUid: string
}

const InscricaoCard = (eventoUid?:IEventoProps) => {
  const classes = useStyles();
  const session = useSelector( (state:ISessaoParametros) => state.session );
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
  const [loteNome, setNomeLote] = useState("");
  const [descricao, setDescricao] = useState("");
  const [inicioLote, setInicioLote] = useState("");
  const [fimLote, setFimLote] = useState("");
  const [loadingInput, setLoadingInput] = useState(false);
  


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
              setNomeLote(item.lote);
              setDescricao(item.descricao);
              setValor(item.valor);
              setInicioLote(item.data_inicio);
              setFimLote(item.data_fim);

          }
        })
      })
    }
  }

  async function deletar(uuidInscricao?:string){
    dispatch(setAlertCustom({ mensagens: [], title: '', open: false, type: 'info'}));
    setDisabled(true);

    return await api.delete(`/inscricao/${uuidInscricao}`,
      { headers: {
          'Authorization': `Bearer ${session.access_token.access_token}`
      }}).then( (result:any) => {
          dispatch(setAlertCustom({ mensagens: ['Inscricao removida com sucesso!'], title: 'Sucesso', open: true, type: 'success'}));
          buscarInscricoesEvento(eventoUid?.eventoUid);
          setDisabled(false);
      }).catch( (error:any) => {
        setDisabled(false);
        dispatch(setAlertCustom({ mensagens: ['Erro ao remover inscrição!'], title: 'Erro', open: true, type: 'error'}));
      })  
    
  }

  function mountData(){

    let data = {
      "eventos_uuid": eventoUid?.eventoUid,
      "titulo": loteRef.current?.value,
      "lote": loteRef.current?.value,
      "descricao": descricaoRef.current?.value,
      "valor": valor,
      "data_inicio": inicioLoteRef.current?.value,
      "data_fim": fimLoteRef.current?.value,
    };
    return data;
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
              disabled={false}
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
            disabled={false}
            inputRef={descricaoRef}
          />
          <TextField 
            id={`valor`} label="Valor" autoComplete={'false'} size={'small'} className={classes.divValor}
            value={valor} onChange={(event:any) => setValor(event.target.value) }
            InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '10vw'}}
            InputProps={{
              inputComponent: NumberFormatCustom,
              inputProps: { decimalScale: 2, maxLength: 10 , style: { textAlign: 'right'} }
          }}
            disabled={false} 
          />
          
            <TextField 
              id={`inicio_lote`} label="Inicio" autoComplete={'false'} size={'small'} className={classes.divValor}
              defaultValue={""} value={inicioLote} onChange={(event:any) => setInicioLote(event.target.value)}
              InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '12vw'}} 
              disabled={false} type='date'
              inputRef={inicioLoteRef}
            />
            <TextField 
              id={`fim_lote`} label="Fim" autoComplete={'false'} size={'small'} className={classes.divValor}
              defaultValue={""} value={fimLote} onChange={(event:any) => setFimLote(event.target.value)}
              InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '12vw'}} 
              disabled={false} type='date'
              inputRef={fimLoteRef}
            />
            <Button 
              className={classes.addIcon}
              title='Salvar'
              style={{ background: '#04ccb9', color:'#fff' }}
              variant="contained" size="medium" onClick={() => !uuidInscricao ? salvar() : atualizar() } 
              disabled={false}
            >
              Salvar
            </Button>
          </div>
          <hr style={{margin: 15}}/>
          <div style={{ display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', width: '100%', padding: 2, fontWeight: 1, overflow: 'auto', height: '55vh' }}>
            {inscricoes !== null && inscricoes !== undefined && Object.keys(inscricoes).length > 0  ? 
                (<div style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'flex-start', width: '100%', padding: 2, fontWeight: 1, height: '100%' }}>
                  { Object.values(inscricoes).map( (inscricao:any) => {
                     return (
                        <div style={{ marginBottom:'10px',width: '90%', border: '0.2px #c6c6c6 solid', borderRadius: '5px 5px 5px 5px' }} > 
                          <div style={{ fontSize: '18px', borderBottom: '0.2px #c6c6c6 solid', display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', width: '100%', padding: 5, fontWeight: 1 }} >
                            {inscricao[0]['lote']} - Período: {inscricao[0]['data_inicio']} à {inscricao[0]['data_fim']}
                          </div>
                        { Object.values(inscricao).map((item:any) => {
                          return <div style={{ display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', width: '100%', fontWeight: 1}}>
                                     <div style={{ marginLeft: 12}}> {item.descricao} - R$ {item.valor} </div>
                                     <div> 
                                        <IconButton aria-label="delete" color="info" onClick={ () => editar(item.uuid) }>
                                          <EditIcon fontSize="inherit"  />
                                        </IconButton>
                                        <IconButton aria-label="delete" color="error" onClick={ () => { setOpen(true); setUuidInscricaoDeletar(item.uuid); } }>
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
                {"Exclusão de inscrição?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Deseja mesmo excluir a inscrição?
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
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
  const [valor,setValor] = useState(null);
  const [firstTime, setFirstTime] = useState(true);
  const [inscricoes, setInscricoes] = useState({});
  
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
    
    // return await api.put(`/eventos/${uuidEvento}`, {...evento},
    //     { headers: {
    //         'Authorization': `Bearer ${session.access_token.access_token}`
    //     }}).then( (result:any) => {
    //         dispatch(setAlertCustom({ mensagens: ['Evento salvo com sucesso!'], title: 'Sucesso', open: true, type: 'success'}));
    //         setDisabled(false);
    //     }).catch( (error:any) => {
    //       setDisabled(false);
    //       dispatch(setAlertCustom({ mensagens: ['Erro ao salvar!'], title: 'Erro', open: true, type: 'error'}));
    //     })
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
  useEffect(() => {
    if(eventoUid !== undefined && eventoUid.eventoUid !== "" && firstTime){
      buscarInscricoesEvento(eventoUid?.eventoUid);
      setFirstTime(false);
      
    }

  },[eventoUid]);
  
  return (
    <div className={classes.divPrincipalLote}>
          <div style={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', width: '100%', padding: 2}}>
            <TextField 
              id={`lote`} label="Lote" autoComplete={'false'} size={'small'} className={classes.divValor}
              defaultValue={""} onChange={(event:any) => {} }
              InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 10 }} style={{ width: '15vw'}}
              disabled={false}
              inputRef={loteRef}
            />
            <TextField 
            id={`descricao`} label="Descricao" autoComplete={'false'} size={'small'} className={classes.divValor}
            defaultValue={null} onChange={(event:any) => {} }
            InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '20vw'}}
            disabled={false}
            inputRef={descricaoRef}
          />
          <TextField 
            id={`valor`} label="Valor" autoComplete={'false'} size={'small'} className={classes.divValor}
            onChange={(event:any) => setValor(event.target.value) }
            InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '10vw'}}
            InputProps={{
              inputComponent: NumberFormatCustom,
              inputProps: { decimalScale: 2, maxLength: 10 , style: { textAlign: 'right'} }
          }}
            disabled={false} 
          />
          
            <TextField 
              id={`inicio_lote`} label="Inicio" autoComplete={'false'} size={'small'} className={classes.divValor}
              defaultValue={""} onChange={(event:any) => {}}
              InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '12vw'}} 
              disabled={false} type='date'
              inputRef={inicioLoteRef}
            />
            <TextField 
              id={`fim_lote`} label="Fim" autoComplete={'false'} size={'small'} className={classes.divValor}
              defaultValue={""} onChange={(event:any) => {}}
              InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} style={{ width: '12vw'}} 
              disabled={false} type='date'
              inputRef={fimLoteRef}
            />
            <Button 
              className={classes.addIcon}
              title='Novo Item'
              style={{ background: '#04ccb9', color:'#fff' }}
              variant="contained" size="small" onClick={() => salvar() } 
              disabled={false}
            >
              <SaveIcon/>
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
                                        <IconButton aria-label="delete" color="info">
                                          <EditIcon fontSize="inherit" />
                                        </IconButton>
                                        <IconButton aria-label="delete" color="error" onClick={ () => deletar(item.uuid) }>
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
    </div>
    
  );
}

export default InscricaoCard;
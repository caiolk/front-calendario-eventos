import { TextField, Paper, Select , Button, Snackbar, Alert, Backdrop, CircularProgress, AlertTitle } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertCustom } from '../../store/actions/AlertCustom.action';
import ISessaoParametros from '../../shared/interfaces/ISessaoParametros'
import ITipoCorridas from '../../shared/interfaces/ITipoCorridas'
import IFonteCorridas from '../../shared/interfaces/IFonteCorridas'
import BasicModal, { IModalHandles } from '../../Components/BasicModal';

import TabelaResultado from '../../Components/TabelaResultado';
import AlertCustom from '../../Components/AlertCustom';
import api from '../../services/api';
import useStyles from './styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import ptBR from 'dayjs/locale/pt-br';
import moment from "moment";
import { trim } from 'lodash';


const Eventos = () => {
    const classes = useStyles();
    const session = useSelector( (state:ISessaoParametros) => state.session );
    const tipoCorridas = useSelector( (state:ITipoCorridas) => state.tipoCorridas );
    const fonteCorridas = useSelector( (state:IFonteCorridas) => state.fonteCorridas );
    const listaStatus = useSelector( (state:any) => state.status );
    const listaEstados = useSelector( (state:any) => state.estados );
    const dispatch = useDispatch();
    const [dadosEventos, setDadosEventos] = useState([]);

    const [evento,setEvento] = useState("");
    const [uf,setUF] = useState("");
    const [status,setStatus] = useState("Aberto");
    const [cidade,setCidade] = useState("");
    const [dataInicio,setDataInicio] = useState("");
    const [dataFim,setDataFim] = useState("");
    const eventoRef = useRef<HTMLInputElement>(null);
    const ufRef = useRef<HTMLInputElement>(null);
    const statusRef = useRef<HTMLInputElement>(null);
    const cidadeRef = useRef<HTMLInputElement>(null);
    const dataInicioRef = useRef<HTMLInputElement>(null);
    const dataFimRef = useRef<HTMLInputElement>(null);
    const [buscaParametros,setBuscaParametros] = useState("");
    const [loading, setLoading] = useState(true);
    const [firstTime, setFirstTime] = useState(true);
    const modalRef = useRef<IModalHandles>(null);

    async function buscaEventos(buscaParametros:string){
        dispatch(setAlertCustom({ mensagens: [], title: '', open: false, type: 'info'}));
        if(!buscaParametros)
        {
            buscaParametros = "status_string=Aberto"
        }
        
        return await api.get( `/eventos?${buscaParametros}`,
            { headers: {
                'Authorization': `Bearer ${session.access_token.access_token}`
            } }).then( (result:any) => {
                if(result.data.status !== false){
                    setDadosEventos(result.data.data.data);
                    setLoading(false)
                    dispatch(setAlertCustom({ mensagens: ['Dados encontrados com sucesso'], title: 'Sucesso', open: true, type: 'success'}));
                }else{
                    dispatch(setAlertCustom({ mensagens: [ result.data.message ], title: '', open: true, type: 'warning'}));
                }
                
                setLoading(false)
            }).catch( (error:any) => {
                setDadosEventos([]);
                setLoading(false);
                dispatch(setAlertCustom({ mensagens: ['Erro ao buscar dados'], title: 'Erro', open: true, type: 'error'}));
            })
    }

    async function buscar(){
        setLoading(true);
        let params = new Array();
        if(eventoRef.current?.value !== undefined){
            params.push(`evento_titulo=${eventoRef.current?.value}`);
        }
        
        if(ufRef.current?.value !== undefined){
            params.push(`uf=${ufRef.current?.value}`);
        }
        if(statusRef.current?.value !== undefined){
            params.push(`status_string=${statusRef.current?.value}`);
        }
        if(cidadeRef.current?.value !== undefined){
            params.push(`cidade=${cidadeRef.current?.value}`);
        }
        if(dataInicioRef.current?.value !== undefined){
            let _dataInicio = "";
            if(dataInicioRef.current?.value !== ""){
                let _mesInicio = String(moment(dataInicioRef.current?.value, "MM/YYYY").locale('ptBR').month()+1).padStart(2, "0")
                let _anoInicio = String(moment(dataInicioRef.current?.value, "MM/YYYY").locale('ptBR').year())
                _dataInicio = `${_anoInicio}-${_mesInicio}`
            }
            
            params.push(`data_evento_inicio=${_dataInicio}`);
        }
        if(dataFimRef.current?.value !== undefined){
            let _dataFim = "";
            if(dataFimRef.current?.value !== ""){
                let _mesFim = String(moment(dataFimRef.current?.value, "MM/YYYY").month()+1).padStart(2, "0")
                let _anoFim = String(moment(dataFimRef.current?.value, "MM/YYYY").year())
                _dataFim = `${_anoFim}-${_mesFim}`
            }
            params.push(`data_evento_fim=${_dataFim}`);
        }
        setBuscaParametros(params.join("&"))
        buscaEventos(params.join("&"));
        
        setDadosEventos([]);
    
    }
    
    function openModalRef(uuid?:string, tipoModal?:string){
  
        modalRef.current?.openModal(uuid, tipoModal);
        
    }

    useEffect(() =>{

        if((session !== null && session.access_token.access_token !== undefined && session.access_token.access_token !== "") && buscaParametros === ""){
            buscaEventos(buscaParametros);
            
        } 
    },[session,buscaParametros,firstTime])

    return (<>
                <AlertCustom key={session.user.id}/>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div style={{  display:'flex', flexDirection: 'column', height: '75%', marginTop:'5%', width: '100%', justifyContent:'center', alignItems:'center', overflow: 'auto' }} >
                    <div className={classes.info} >
                        <div>Calendário de Eventos Esportivos</div>
                    </div>
                </div>
                <div className={classes.divPrincipal} >
                    <Paper className={classes.paper}>
                            <div style={{ display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'center', width: '95%' }}>
                                <div className={classes.divCampos} >
                                    <TextField
                                        label="Evento"
                                        autoComplete={'false'}
                                        size={'small'}
                                        className={classes.divValor}
                                        inputRef={eventoRef}
                                        defaultValue={""}
                                        onChange={(event:any) => setEvento(event.value)}
                                        id={`evento`}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        InputProps={{ }}
                                        inputProps={{ maxLength: 35 }}
                                    />
                                    <TextField
                                        id={`uf`}
                                        select
                                        label="UF"
                                        size={'small'}
                                        inputRef={ufRef}
                                        InputLabelProps={{ shrink: true }}
                                        SelectProps={{ native: true }}
                                        value={uf}
                                        onChange={(event:any) => { setUF(event.value)}} 
                                    >
                                        <option value={''}> Todos </option>
                                        { listaEstados.length > 0 ? 
                                            listaEstados.map( ( estado:string ) => { return (<><option value={estado}> {estado} </option></>) }) :'' 
                                        }
                                    </TextField>
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
                                        <option value={''}> Todos </option>
                                        { listaStatus.length > 0 ? 
                                            listaStatus.map( ( status:string ) => { return (<><option value={status}> {status} </option></>) }) :'' 
                                        }

                                    </TextField>
                                    <TextField
                                        label="Cidade"
                                        autoComplete={'false'}
                                        size={'small'}
                                        className={classes.divValor}
                                        inputRef={cidadeRef}
                                        defaultValue={""}
                                        onChange={(event:any) => setCidade(event.value)}
                                        id={`cidade`}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        InputProps={{ }}
                                        inputProps={{ maxLength: 35 }}
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ptBR}>
                                        <DatePicker 
                                            label={'Inicio'} 
                                            views={['year', 'month']}
                                            format='MM/YYYY'
                                            inputRef={dataInicioRef} 
                                            slotProps={{ textField: { size: 'small' } }}
                                            onChange={(event:any) => setDataInicio(event.value)}
                                            />
                                        <DatePicker 
                                            label={'Fim'} 
                                            views={['year', 'month']}
                                            format='MM/YYYY'
                                            inputRef={dataFimRef} 
                                            slotProps={{ textField: { size: 'small' } }}
                                            onChange={(event:any) => setDataFim(event.value)}
                                            />
                                    </LocalizationProvider>
                                </div>
                                <div className={classes.divButton} >
                                    <Button 
                                        className={classes.buttonBuscar}
                                        style={{ background: '#04ccb9', color:'#fff' }}
                                        variant="contained" 
                                        size="small"
                                        onClick={() => buscar()} >
                                        Buscar
                                    </Button>
                        
                                    <Button 
                                        className={classes.buttonBuscar}
                                        style={{ background: '#04ccb9', color:'#fff' }}
                                        variant="contained" 
                                        size="small"
                                        onClick={() => {openModalRef("", "novo")} } >
                                        Novo
                                    </Button>
                        
                                </div>   
                            </div>
                    </Paper>
            </div>
            <div style={{  display:'flex', flexDirection: 'column', height: '75%', width: '100%', justifyContent:'center', alignItems:'center', overflow: 'auto' }} >
                <Paper style={{ display:'flex', flexDirection: 'column', alignItems: 'center', padding: 10, minHeight: '50vh', height: '75% !important', width: '95vw', margin: 5 , overflow: 'auto' }}>
                    
                    <div style={{ display:'flex', flexDirection: 'column', alignItems: 'center', width: '93vw',height: '70vh', padding: 10}} >
                        {dadosEventos !== null && dadosEventos !== undefined && Object.keys(dadosEventos).length > 0 
                            && dadosEventos !== undefined  ? 
                            (<TabelaResultado arDados={dadosEventos}/>) : 
                            (<><div> Nenhum evento encontrado.</div></>)
                        } 
                        
                    </div>
                </Paper>
                <BasicModal ref={modalRef}  />
            </div>
        </>)
}

export default Eventos;
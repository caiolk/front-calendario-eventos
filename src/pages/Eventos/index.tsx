import { TextField, Paper, Select , Button, Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../../Components/SearchBar';
import TabelaResultado from '../../Components/TabelaResultado';
import api from '../../services/api';
import useStyles from './styles';

interface ISessaoParametros{
    session:{
      user:{
        id:number,
        nome:string,
        email:string,
        blAdmin:number
      },
      access_token:{
        access_token: string,
        expires_in: string,
        token_type: string
      }
    }
    
  }

const Eventos = () => {
    const classes = useStyles();
    const session = useSelector( (state:ISessaoParametros) => state.session );
    const [dadosEventos, setDadosEventos] = useState([]);
    const [evento,setEvento] = useState("");
    const [uf,setUF] = useState("");
    const [status,setStatus] = useState("");
    const eventoRef = useRef<HTMLInputElement>(null);
    const ufRef = useRef<HTMLInputElement>(null);
    const statusRef = useRef<HTMLInputElement>(null);
    const [buscaParametros,setBuscaParametros] = useState("");
    const [loading, setLoading] = useState(true);
    
    async function buscaEventos(buscaParametros:string){
        return await api.get( `/eventos?${buscaParametros}`,
            { headers: {
                'Authorization': `Bearer ${session.access_token.access_token}`
            } }).then( (result:any) => {
                if(result.data.data.data){
                    if(result.data.status !== false){
                        setDadosEventos(result.data.data.data);
                        setLoading(false)
                    }
                }
            }).catch( (error:any) => {
                setDadosEventos([]);
                setLoading(false);
            })
    }

    async function buscar(){
        setLoading(true);
        let params = new Array();
        if(eventoRef.current?.value !== undefined){
            params.push(`evento_titulo=${eventoRef.current?.value}`);
        }
        console.log(ufRef.current?.value)
        if(ufRef.current?.value !== undefined){
            params.push(`uf=${ufRef.current?.value}`);
        }
        if(statusRef.current?.value !== undefined){
            params.push(`status_string=${statusRef.current?.value}`);
        }
        
        setBuscaParametros(params.join("&"))
        setDadosEventos([]);
    
    }

    useEffect(() =>{
        if((session !== null && session.access_token.access_token !== undefined && session.access_token.access_token !== "") || buscaParametros !== ""){
            buscaEventos(buscaParametros);
        } 
    },[session,buscaParametros])
 
    return (<>
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
                        <div style={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'center', width: '95%' }}>
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
                                    className={classes.textFieldMoeda}
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
                                    <option value={'PR'}> PR </option>
                                    <option value={'SC'}> SC </option>
                                    <option value={'RS'}> RS </option>
                                    <option value={'SP'}> SP </option>
                                    <option value={'RJ'}> RJ </option>
                                </TextField>
                                <TextField
                                    className={classes.textFieldMoeda}
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
                                    <option value={'Aberto'}> Aberto </option>
                                    <option value={'Encerrado'}> Encerrado </option>
                                    <option value={'Cancelado'}> Cancelado </option>
                                    <option value={'Esgotado'}>  Esgotado </option>

                                </TextField>
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
            </div>
        </>)

}

export default Eventos;
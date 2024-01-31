import { TextField, Box, Paper, Select , Button, Snackbar, Alert, Backdrop, CircularProgress, AlertTitle } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import api from '../../../services/api';
import useStyles from './styles';
import ISessaoParametros from '../../../shared/interfaces/ISessaoParametros'
import IEventoDetalhesParam from '../../../shared/interfaces/IEventoDetalhesParam'
import EventoDetalheIsolado from '../../../Components/EventoDetalheIsolado';
import AlertCustom from '../../../Components/AlertCustom';

const style = {
    marginTop:'50vh',
    marginLeft:'50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    height: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

const ShowEvento = () => {
    
    const params = useParams();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [dadosEventos, setDadosEventos] = useState<IEventoDetalhesParam>({});
    const [tipo, setTipo] = useState("");
    const session = useSelector( (state:ISessaoParametros) => state.session );


    async function buscaEventos(uuidEvento?:string){
        setLoading(true)
        if(uuidEvento==="") return;
        
        return await api.get( `/eventos/${uuidEvento}`,
            { headers: {
                'Authorization': `Bearer ${session.access_token.access_token}`
            } }).then( (result:any) => {
                if(result.data.data && result.data.status !== false){
                    setDadosEventos(result.data.data);     
                }  
                setLoading(false)
                
                
            }).catch( (error:any) => {
                setDadosEventos({});
                setLoading(false);
            })
    }
    
    useEffect(() => {
        if(params.uid !== undefined){
            buscaEventos(params.uid)
        }
        
    },[]);

    return (<>
            <AlertCustom key={session.user.id}/>
            <div style={{  display:'flex', flexDirection: 'column', height: '42vh', marginTop:'2%', marginLeft: '2%', width: '95%', justifyContent:'center', alignItems:'center' }}>
                <div className={classes.info} style={{ flexDirection: 'column',  justifyContent:'center', alignItems:'center', overflow: 'auto', width: '100%' }} >
                    <div>Detalhes do evento</div>
                </div>
                <Paper className={classes.paper}>      
                    { (dadosEventos !== null && dadosEventos !== undefined && Object.keys(dadosEventos).length > 0) || (tipo !== undefined && tipo.trim() !== "") ? 
                        (<><EventoDetalheIsolado key={1} eventoDetalhes={dadosEventos} tipo={tipo} /></>) : 
                        (<>
                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems:'center', height: '100%'}} >
                                { loading ? (<CircularProgress color="inherit" />) : (<>
                                    <div> 
                                    Evento não encontrado.
                                </div>
                                <div>
                                    <Button 
                                        className={classes.buttonBuscar}
                                        variant="contained" size="small" onClick={() => window.location.href = '/eventos' }  
                                    >
                                        Voltar
                                    </Button>
                                </div>
                                </>) }
                                
                                
                                
                            </div>    
                        </>)
                    }  
                </Paper>
            </div>
        </>)
}

export default ShowEvento;
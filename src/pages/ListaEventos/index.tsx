import { Backdrop, CircularProgress, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

const ListaEventos = () => {
    const classes = useStyles();
    const session = useSelector( (state:ISessaoParametros) => state.session );
    const [dadosEventos, setDadosEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    async function buscaEventos(){
        return await api.get('/eventos',
            { headers: {
                'Authorization': `Bearer ${session.access_token.access_token}`
            } }).then( (result:any) => {
                if(result.data.data){
                    if(result.data.status !== false){
                        setDadosEventos(result.data.data);
                        setLoading(false)
                    }
                }
            }).catch( (error:any) => {
                
            })
    }
    useEffect(() =>{
        if(session !== null && session.access_token.access_token !== undefined && session.access_token.access_token !== ""){
            buscaEventos();
        } 
    },[session])
 
    return (<>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div style={{  display:'flex', flexDirection: 'column', marginTop: '5%', height: '75%', width: '100%', justifyContent:'center', alignItems:'center', overflow: 'auto' }} >
                <Paper style={{ display:'flex', flexDirection: 'column', alignItems: 'center', padding: 10, minHeight: '50vh', height: '75% !important', width: '95vw', margin: 5 , overflow: 'auto' }}>
                    <div className={classes.info} >
                        <div>Calendário de Eventos Esportivos</div>
                    </div>
                    <div style={{ display:'flex', flexDirection: 'column', alignItems: 'center', width: '93vw',height: '75vh', padding: 10}} >
                        {dadosEventos !== null && dadosEventos !== undefined && Object.keys(dadosEventos).length > 0 
                            && dadosEventos !== undefined  ? 
                            (<TabelaResultado arDados={dadosEventos}/>) : 
                            (<><div> Nenhuma evento encontrada.</div></>)
                        } 
                    </div>
                </Paper>
                
                
            </div>
        </>)

}

export default ListaEventos;
import React, { useEffect, useState, useCallback } from 'react';
import { TextField, Paper, Select , Button, Snackbar, Alert, Backdrop, CircularProgress, AlertTitle } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';
import ISessaoParametros from '../../shared/interfaces/ISessaoParametros'
import ITipoCorridas from '../../shared/interfaces/ITipoCorridas'
import IFonteCorridas from '../../shared/interfaces/IFonteCorridas'

import { setTipoCorridas } from '../../store/actions/TipoCorridas.action';
import { setFonteCorridas } from '../../store/actions/FonteCorridas.action';
import { setStatus } from '../../store/actions/Status.action';
import { setEstados } from '../../store/actions/Estados.action';

import Chart from 'react-apexcharts'

import api from '../../services/api'

interface EventoUfParam {
    labels?: [string],
    series?: [number]
}

const Home = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [loadingDash, setLoadingDash] = useState(true);
    const [firstTime, setFirstTime] = useState(false);
    const [ultimosEventos, setUltimosEventos] = useState([]);
    const [proximosEventos, setProximosEventos] = useState([]);
    const [eventosPorUf, setEventosPorUf] = useState<EventoUfParam>({});
    const session = useSelector( (state:ISessaoParametros) => state.session );
    const tipoCorridas = useSelector( (state:ITipoCorridas) => state.tipoCorridas );
    const fonteCorridas = useSelector( (state:IFonteCorridas) => state.fonteCorridas );
    const status = useSelector( (state:any) => state.status );
    const estados = useSelector( (state:any) => state.estados );
    
    useEffect(() => {

        if(!firstTime && session.access_token.access_token && session.access_token.access_token !== undefined){
            buscaTipoCorridas(session.access_token.access_token);
            buscaFontes(session.access_token.access_token);
            buscaStatus(session.access_token.access_token);
            buscaEstados(session.access_token.access_token);
            setFirstTime(true);
        } 
       
       
    },[firstTime, session])
    useEffect(() =>{
        if(session && session.access_token.access_token && session.access_token.access_token !== undefined){
            buscaUltimosEventos(session.access_token.access_token);
            buscaProximosEventos(session.access_token.access_token);
            buscaEventosPorUf(session.access_token.access_token);
        } 
        
    }, [session]);

    const buscaTipoCorridas = useCallback( async (token?:string) => {
        setLoading(true);
        let _token = token != undefined ? token :  session.access_token.access_token 
        return await api.get( `/tipos/`,
          { headers: {
              'Authorization': `Bearer ${token}`
          } }).then( (result:any) => {
         
              if(result.data.status){
                dispatch(setTipoCorridas(result.data.data));
                setLoading(false);
              }
              
          }).catch( (error:any) => { 
                if(error.response.status === 401){
                    const domain = window.location.protocol + "//" + window.location.host;
                    sessionStorage.clear();
                    localStorage.clear();
                    window.location.href = `${domain}/login`
                }

          })
    },[])
  
    const buscaFontes = useCallback( async (token?:string) => {
        setLoading(true);
        let _token = token != undefined ? token :  session.access_token.access_token
        return await api.get( `/fontes/`,
            { headers: {
                'Authorization': `Bearer ${token}`
            } }).then( (result:any) => {
                if(result.data.status){
                    dispatch(setFonteCorridas(result.data.data));
                    setLoading(false);
                }
                
            }).catch( (error:any) => { })
    },[])
    
    const buscaStatus = useCallback( async (token?:string) => {
        setLoading(true);
        let _token = token != undefined ? token :  session.access_token.access_token
        return await api.get( `/status/`,
            { headers: {
                'Authorization': `Bearer ${token}`
            } }).then( (result:any) => {
                if(result.data.status){
                    dispatch(setStatus(result.data.data));
                    setLoading(false);
                }
                
            }).catch( (error:any) => { })
    },[])

    const buscaEstados = useCallback( async (token?:string) => {
        setLoading(true);
        let _token = token != undefined ? token :  session.access_token.access_token
        return await api.get( `/estados?only=uf`,
            { headers: {
                'Authorization': `Bearer ${token}`
            } }).then( (result:any) => {
                if(result.data.status){
                    dispatch(setEstados(result.data.data));
                    setLoading(false);
                }
                
            }).catch( (error:any) => { })
    },[])

    const buscaUltimosEventos = useCallback( async (token?:string) => {
        setLoadingDash(true);
        let _token = token != undefined ? token :  session.access_token.access_token
        return await api.get( `/dashboard/eventos/ultimos`,
            { headers: {
                'Authorization': `Bearer ${token}`
            } }).then( (result:any) => {
                if(result.data.status){
                    setUltimosEventos(result.data.data);
                    setLoadingDash(false);
                }
                
            }).catch( (error:any) => { console.log(error) })
    },[])

    const buscaProximosEventos = useCallback( async (token?:string) => {
        setLoadingDash(true);
        let _token = token != undefined ? token :  session.access_token.access_token
        return await api.get( `/dashboard/eventos/proximos`,
            { headers: {
                'Authorization': `Bearer ${token}`
            } }).then( (result:any) => {
                if(result.data.status){
                    setProximosEventos(result.data.data);
                    setLoadingDash(false);
                }
                
            }).catch( (error:any) => { console.log(error) })
    },[])

    const buscaEventosPorUf = useCallback( async (token?:string) => {
        setLoadingDash(true);
        let _token = token != undefined ? token :  session.access_token.access_token
        let series:any = []
        let labels:any = []
        return await api.get( `/dashboard/eventos/group-by-uf`,
            { headers: {
                'Authorization': `Bearer ${token}`
            } }).then( (result:any) => {
                if(result.data.status && result.data.data != undefined){
                    
                    Object.entries(result.data.data).map((val, key) => {
                        labels.push(`${val[0]} (${val[1]})`)
                        series.push(val[1])
                    })
                    setEventosPorUf({labels: labels, series : series});
                    setLoadingDash(false);
                }
                
            }).catch( (error:any) => { console.log(error) })
            
    },[])
    
    function replaceStr(texto:string){
        return texto.length > 50 ?  `${texto.substring(0,50)} [...]` : texto
    }
    return (<>
            {
             <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop> }
            <div className={classes.divPrincipal}>
                <div style={{  display:'flex', flexDirection: 'row', justifyContent:'center',  width: '95%', height: '40vh' }}>
                    <Paper style={{ width: '50%', margin: '10px', padding: '10px', border: '1px #000 solid', height: '40vh'  }} >
                        <div className={classes.info} >
                            <div>Últimos Eventos Registrados no Sistema</div>
                        </div>
                        { loadingDash ? (
                            <div style={{  display:'flex', flexDirection: 'row', justifyContent:'center', alignItems:'center', height: '85%' }} >
                                <CircularProgress size={'50px'} color="inherit" />
                            </div>
                            
                        ) : (
                        <div style={{ overflow: 'auto', height: '90%', fontSize: '12px'}}>
                            { ultimosEventos && Object.values(ultimosEventos).map((eventos:any, k) => {
                                return (<>
                                            <div style={{padding: '2px'}} title={eventos.evento_titulo} key={k}>
                                                { `${eventos.evento_data_realizacao_formatada} - ${replaceStr(eventos.evento_titulo)} - (${eventos.uf} - ${eventos.cidade})` }
                                            </div>
                                        </>
                                        )
                             }) }
                            
                        </div>
                        ) }
                        
                    </Paper>
                    <Paper style={{ width: '50%', margin: '10px', padding: '10px', border: '1px #000 solid', height: '40vh' }} >
                        <div className={classes.info} >
                            <div>Próximos Eventos</div>
                        </div>
                        { loadingDash ? (
                            <div style={{  display:'flex', flexDirection: 'row', justifyContent:'center', alignItems:'center', height: '85%' }} >
                                <CircularProgress size={'50px'} color="inherit" />
                            </div>
                            
                        ) : (
                        <div style={{ overflow: 'auto', height: '90%', fontSize: '12px'}}>
                            { proximosEventos && Object.values(proximosEventos).map((eventos:any, k) => {
                                return (<>
                                            <div style={{padding: '2px'}} title={eventos.evento_titulo} key={k}>
                                                { `${eventos.evento_data_realizacao_formatada} - ${replaceStr(eventos.evento_titulo)} - (${eventos.uf} - ${eventos.cidade})` }
                                            </div>
                                        </>
                                        )
                             }) }
                            
                        </div>
                        ) }
                    </Paper>
                </div>
                <div style={{  display:'flex', flexDirection: 'row', justifyContent:'center',  width: '95%', height: '40vh', marginTop: '10px' }}>
                    <Paper style={{ width: '50%', margin: '10px', padding: '10px', border: '1px #000 solid', height: '40vh'  }} >
                        <div className={classes.info} >
                            <div>Corridas em Aberto por UF</div>
                        </div>
                        { loadingDash ? (
                            <div style={{  display:'flex', flexDirection: 'row', justifyContent:'center', alignItems:'center', height: '80%' }} >
                                <CircularProgress size={'50px'} color="inherit" />
                            </div>
                            
                        ) : 
                        (
                            <> 
                            { eventosPorUf.series && eventosPorUf.labels ? 
                            (<>
                                <Chart options={{
                                                    chart: { type: 'pie' },
                                                    stroke: { colors: ['#fff'] },
                                                    fill: { opacity: 0.8 },
                                                    responsive: [{
                                                        breakpoint: 480,
                                                        options: {
                                                            chart: { width: 200 },
                                                            legend: { position: 'bottom' } 
                                                        }
                                                    }],
                                                    labels: eventosPorUf.labels,
                                                }} 
                                                series={ eventosPorUf.series }
                                                type="pie" width={600} height={300} />
                            </>) : 
                                (<>
                                    <div style={{  display:'flex', flexDirection: 'row', justifyContent:'center', alignItems:'center', height: '80%' }} >
                                        Informação não disponível
                                    </div>
                                </>)}
                            </>
                        ) }
                    </Paper>
                </div>
            </div>
            </>)

}

export default Home;
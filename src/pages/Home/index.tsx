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

import api from '../../services/api'

const Home = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [firstTime, setFirstTime] = useState(false);
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
              
          }).catch( (error:any) => { })
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


    return (<>
            {
             <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop> }
            <div className={classes.divPrincipal} >
                
            </div>
            </>)

}

export default Home;
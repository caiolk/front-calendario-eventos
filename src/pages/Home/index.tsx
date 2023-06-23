import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';
import ISessaoParametros from '../../shared/interfaces/ISessaoParametros'
import ITipoCorridas from '../../shared/interfaces/ITipoCorridas'
import IFonteCorridas from '../../shared/interfaces/IFonteCorridas'

import { setTipoCorridas } from '../../store/actions/TipoCorridas.action';
import { setFonteCorridas } from '../../store/actions/FonteCorridas.action';

import api from '../../services/api'

const Home = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [firstTime, setFirstTime] = useState(false);
    const session = useSelector( (state:ISessaoParametros) => state.session );
    const tipoCorridas = useSelector( (state:ITipoCorridas) => state.tipoCorridas );
    const fonteCorridas = useSelector( (state:IFonteCorridas) => state.fonteCorridas );

    useEffect(() => {

        if(!firstTime && session.access_token.access_token && session.access_token.access_token !== undefined){
            buscaTipoCorridas(session.access_token.access_token);
            buscaFontes(session.access_token.access_token);
        } 
       
    },[firstTime, session])
    const buscaTipoCorridas = useCallback( async (token?:string) => {
        let _token = token != undefined ? token :  session.access_token.access_token 
        return await api.get( `/tipos/`,
          { headers: {
              'Authorization': `Bearer ${token}`
          } }).then( (result:any) => {
         
              if(result.data.status){
                dispatch(setTipoCorridas(result.data.data));
              }
              
          }).catch( (error:any) => { })
    },[])
  
    const buscaFontes = useCallback( async (token?:string) => {
        let _token = token != undefined ? token :  session.access_token.access_token
        return await api.get( `/fontes/`,
            { headers: {
                'Authorization': `Bearer ${token}`
            } }).then( (result:any) => {
                if(result.data.status){
                    dispatch(setFonteCorridas(result.data.data));
                }
                
            }).catch( (error:any) => { })
    },[])
  
    console.log('tipoCorridas',tipoCorridas, fonteCorridas);
    return (<>
            {/* <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop> */}
            <div className={classes.divPrincipal} >
                
            </div>
            </>)

}

export default Home;
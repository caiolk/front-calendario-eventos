import React, { useEffect, useState } from 'react';
import { TextField, Paper, Select , Button, Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';
import NumberFormatCustom from '../../Components/NumberFormatCustom';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';

import api from '../../services/api'

interface IParametrosResultado{
    strFormaPagamento: string,
    strMoedaDestino: string,
    strMoedaOrigem: string,
    flTaxaConversao: number,
    flTaxaPagamento: number,
    flValorCompradoMoedaDestino: number,
    flValorConversao: number,
    flValorMoedaDestinoConversao: number,
    flValorUtilizadoConversao: number,
} 

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

const Home = () => {
    const classes = useStyles();
    const [objMoedaOrigem,setObjMoedasOrigem] = useState({});
    const [objMoedaDestino,setObjMoedasDestino] = useState({});
    const [objTipoPagamento,setObjTipoPagamento] = useState({});
    const [moedaOrigem,setMoedaOrigem] = useState();
    const [moedaDestino,setMoedaDestino] = useState();
    const [tipoPagamento,setTipoPagamento] = useState();
    const [valorConversao,setValorConversao] = useState();
    const [msgErro,setMsgErro] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [buttonConverter,setButtonConverter] = useState(false);
    const [alertData, setAlertData] = useState({strMensagem:'',strType:''});
    const [busca,setBusca] = useState(false);
    const [resultadoConversao,setResultadoConversao] = useState<IParametrosResultado>();
    const session = useSelector( (state:ISessaoParametros) => state.session );
    
    const handleCloseLoading = () => {
        setLoading(false);
    };

    const handleClose = (event:any, reason:any) => {
        if (reason === 'clickaway') {
          return;
        }
       
        setOpen(false);
    };
    
    async function buscaMoedas(){
        let _moedasOrigem = new Array()
        let _moedasDestino = new Array()
        
        return await api.get('api/moeda', { headers: {
                'Authorization': `Bearer ${session.access_token.access_token}`
            } }).then( (result:any) => {
                if(result.data){

                    Object.values(result.data).map( (moedas:any) => {
                        if(moedas.blOrigem === 1){
                            _moedasOrigem.push(  { id: moedas.id, strSiglaMoeda: moedas.strSiglaMoeda } )
                        }else{
                            _moedasDestino.push( { id: moedas.id, strSiglaMoeda: moedas.strSiglaMoeda } )
                        }
                        
                    } )
                    
                    setObjMoedasOrigem(_moedasOrigem)
                    setObjMoedasDestino(_moedasDestino)
                 
                }else{
                    
                }
                
            }).catch( (error:any) => {
                
            })

    }

    async function buscaTipoPagamentos(){
        let _tipoPagamento = new Array()
        return await api.get('api/tipo-pagamento', { headers: {
                'Authorization': `Bearer ${session.access_token.access_token}`
            } }).then( (result:any) => {
                if(result.data){
                    
                    Object.values(result.data).map( (tipopagamentos:any) => {
                        _tipoPagamento.push({ id: tipopagamentos.id, strTipoPagamento: tipopagamentos.strTipoPagamento })
                    } )
                    setObjTipoPagamento(_tipoPagamento)
                   
                }else{
                    
                }
                
            }).catch( (error:any) => {
                
            })
    }

    useEffect( () => {

        
        setLoading(false)
    },[objMoedaOrigem,objMoedaDestino,objTipoPagamento])
   
    useEffect( () => {
        if(tipoPagamento!==0 && moedaDestino!==0 && moedaOrigem !== 0 && valorConversao !== null){
            setButtonConverter(true);
        }
        
    },[tipoPagamento,moedaDestino,moedaOrigem,valorConversao])

 
    async function converterValores(){
        setLoading(true)
        let message = '';
        let countError = 0;

        if(!tipoPagamento){
            message += "Selecione uma forma de pagamento.\n";
            countError++;
        }
        if(!moedaDestino){
            message += "Selecione uma moeda destino.\n";
            countError++;
        }
        if(!moedaOrigem){
            message += "Selecione uma moeda origem.\n";
            countError++;
        }
        if(!valorConversao){
            message += "Digite um valor para conversão.\n";
            countError++;
        }else{
            if(valorConversao<1000||valorConversao>100000){
                message += "O valor para conversão deve estar entre R$ 1.000,00 e R$ 100.000,00.\n";
                countError++;
            }
            
        }
        if(countError>0){
            setAlertData( { strMensagem:message, strType:'error' } )
            
            setMsgErro(true)
            setBusca(false)
            setLoading(false)
            return false;
        }
        return await api.post('api/realizar-conversao',
        { 
            idUsuario: session.user.id,
            idTipoPagamento: tipoPagamento,
            idMoedaDestino: moedaDestino,
            idMoedaOrigem: moedaOrigem,
            flValorConversao: valorConversao
        },
        { headers: {
            'Authorization': `Bearer ${session.access_token.access_token}`
        } }).then( (result:any) => {
            if(result.data){
                
                setResultadoConversao(result.data)
                setLoading(false)

            }else{
                
            }
            
        }).catch( (error:any) => {
            
        })
    }

    return (<>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
                <div className={classes.divPrincipal} >
                    <Paper className={classes.paper}>
                        <div className={classes.info} >
                            <div>
                                Realizar Conversão
                            </div>
                        </div>
                        <div className={classes.paperDiv} >
                            <div className={classes.divMoeda} >
                                <TextField
                                    className={classes.textFieldMoeda}
                                    id={`idMoedaOrigem`}
                                    select
                                    label="Moeda Origem"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    value={ ( moedaOrigem ? moedaOrigem : "" ) }
                                    onChange={(event:any) => {
                                        setMoedaOrigem(event.target.value);
                                    }} 
                                >
                                    <option value={''}> Selecione </option>
                                    { Object.keys(objMoedaOrigem).length > 0 ? 
                                        Object.values(objMoedaOrigem).map( (moedaOrigem:any, k:any) => {
                                            return (<option key={k} value={moedaOrigem.id}> { moedaOrigem.strSiglaMoeda } </option>)
                                        } )
                                        :
                                        (<></>)
                                    }
                                </TextField>
                                <TextField
                                    className={classes.textFieldMoeda}
                                    id={`idMoedaDestino`}
                                    select
                                    label="Moeda Destino"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    value={ ( moedaDestino ? moedaDestino : "" ) }
                                    onChange={(event:any) => {
                                        setMoedaDestino(event.target.value);
                                    }}
                                    
                                >
                                    <option value={''}> Selecione </option>
                                    { Object.keys(objMoedaDestino).length > 0 ? 
                                        Object.values(objMoedaDestino).map( (moedaDestino:any, k:any) => {
                                            return (<option key={k} value={moedaDestino.id}> { moedaDestino.strSiglaMoeda } </option>)
                                        } )
                                        :
                                        (<></>)
                                    }
                                </TextField>
                            </div>
                            <div className={classes.divMoeda} >
                                <TextField
                                    label="Valor Conversão"
                                    autoComplete='false'
                                    className={classes.divValor}
                                    value={valorConversao}
                                    onChange={(event:any) => {
                                    
                                        setValorConversao(event.target.value);
                                    }}
                                    id={`flValorConversao`}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    InputProps={{
                                        inputComponent: NumberFormatCustom,
                                        inputProps: { decimalScale: 2, maxLength: 10 , style: { textAlign: 'right'} }
                                    }}
                                    inputProps={{ maxLength: 20 }}
                                    required
                                />
                            </div>
                            <div className={classes.divMoeda}>
                                <TextField
                                    className={classes.divValor}
                                    id={`tipoPagamento`}
                                    label="Tipo Pagamento"
                                    select
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    value={ ( tipoPagamento ? tipoPagamento : "" ) }
                                    onChange={(event:any) => {
                                        setTipoPagamento(event.target.value)
                                    }}
                                >
                                <option value={''}> Selecione </option>
                                { Object.keys(objTipoPagamento).length > 0 ? 
                                        Object.values(objTipoPagamento).map( (tipoPagamento:any,k:number) => {
                                            return (<option key={k} value={tipoPagamento.id} > { tipoPagamento.strTipoPagamento } </option>)
                                        } )
                                        :
                                        (<></>)
                                    }
                                </TextField>
                            </div>
                            <Button 
                                style={{ 
                                    width:'25vw',
                                    height:'35px',
                                    background: '#04ccb9',
                                    color:'#fff',
                                    fontSize: '12px'
                                } }
                                variant="contained" 
                              
                                size="small"
                                onClick={() => ( buttonConverter ? converterValores() : '' )} >
                                Converter
                            </Button>
                        </div>
                    </Paper>
                    
                    { resultadoConversao !== null && resultadoConversao !== undefined ? (
                        <>
                            
                            <Paper className={classes.paper}>
                                <div className={classes.info} >
                                    <div>
                                    Resultado Conversão
                                    </div>
                                </div>
                                <div className={classes.divResultadoPrincipal} >
                                    <div className={classes.divResultado}>
                                        <div>Moeda de Origem:</div> 
                                        <div>{resultadoConversao?.strMoedaOrigem}</div>
                                    </div>
                                    <div className={classes.divResultado}>
                                        <div>Moeda de destino:</div> 
                                        <div>{resultadoConversao?.strMoedaDestino}</div>
                                    </div>
                                    <div className={classes.divResultado}>
                                        <div>Valor para conversão:</div> 
                                        <div>{resultadoConversao?.flValorConversao.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} </div>
                                    </div>
                                    <div className={classes.divResultado}>
                                        <div>Forma de Pagamento:</div> 
                                        <div>{resultadoConversao?.strFormaPagamento}</div>
                                    </div>
                                    <div className={classes.divResultado}>
                                        <div>Valor da Moeda Destino usado para conversão:</div> 
                                        <div >{resultadoConversao?.flValorMoedaDestinoConversao.toFixed(2).replace('.',',')}</div>
                                    </div>
                                    <div className={classes.divResultado}>
                                        <div>Valor comprado em "Moeda de destino":</div> 
                                        <div>{resultadoConversao?.flValorCompradoMoedaDestino.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</div>
                                    </div>
                                    <div className={classes.divResultado}>
                                        <div>Taxa de pagamento:</div> 
                                        <div>{resultadoConversao?.flTaxaPagamento.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</div>
                                    </div>
                                    <div className={classes.divResultado}>
                                        <div>Taxa de conversão:</div> 
                                        <div>{resultadoConversao?.flTaxaConversao.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</div>
                                    </div>
                                    <div className={classes.divResultado}>
                                        <div>Valor utilizado para conversão:</div> 
                                        <div>{resultadoConversao?.flValorUtilizadoConversao.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</div>
                                    </div>
                
                                </div>
                            </Paper>
                        </>
                    ) : 
                    (<></>)}
                    
                    <div>
                        <Snackbar open={msgErro} autoHideDuration={5000}  onClose={() => { setMsgErro(false) } } >
                            <div>
                                { alertData.strMensagem!== "" ? 
                                    alertData.strMensagem.split("\n").map( (mensagens:any) => {
                                        return (mensagens !== "" ? 
                                        (<>
                                            <Alert onClose={() => setMsgErro(false)} severity="error" sx={{ width: '100%' }}>
                                                {mensagens}
                                            </Alert>
                                        </>)
                                        : '' )
                                        
                                    } )
                                    : ''
                                }
                                
                            </div>
                        </Snackbar>
                    </div>
                </div>
            </>)

}

export default Home;
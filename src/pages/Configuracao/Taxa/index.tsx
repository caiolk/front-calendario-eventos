import { Alert, Backdrop, Button, CircularProgress, Paper, Snackbar, TextField } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import NumberFormatCustom from '../../../Components/NumberFormatCustom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../services/api';
import useStyles from './styles'

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
interface IParametrosTaxa{
    id: number,
    flTaxa: number
}
const Taxa = () => {
    const classes = useStyles();
    const session = useSelector( (state:ISessaoParametros) => state.session );
    const [taxas,setTaxas] = useState<any>([]);
    const [blMensagem,setBlMensagem] = useState(false);
    const [alertData, setAlertData] = useState({strMensagem:'',strType:''});
    const [loading, setLoading] = useState(true);

    async function buscarTaxas(){
        let _dadosTaxa = new Array();
        return await api.get('api/taxa',
            { headers: {
                'Authorization': `Bearer ${session.access_token.access_token}`
            } }).then( (result:any) => {
                if(result.data){
                 
                    if(result.data.status !== false){

                        setTaxas(result.data);
                        setLoading(false)
                        Object.values(result.data).map( (taxas:any) => {
                            _dadosTaxa.push( { id: taxas.id, flTaxa: taxas.flTaxa } )
                        })
                        
                    }

                }
                
            }).catch( (error:any) => {
                
            })

    }

    async function salvarTaxa(idTaxa:number,objTaxa:any){
        setLoading(true)
        if(idTaxa !== null ){
            return await api.put(`api/taxa/${idTaxa}`,
                {...objTaxa},
                { headers: {
                    'Authorization': `Bearer ${session.access_token.access_token}`
                } }).then( (result:any) => {
                    if(result.data){
                        setLoading(false)
                        setAlertData({strType: 'success', strMensagem: 'Taxa salva com sucesso.'})
                        setBlMensagem(true)
                    }
                    
                }).catch( (error:any) => {
                    
                })
        }
        

    }

    useEffect(() =>{
        if(session !== null && session.access_token.access_token !== ""){
            buscarTaxas();
        }

    },[session])

  
    console.log(taxas)
    return (<>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className={classes.divPrincipal} >
                <Paper className={classes.paper}>
                    <div className={classes.info} >
                        Configurar Taxas
                    </div>
                    <div className={classes.divTaxa} >
                        {taxas !== null && taxas !== undefined && Object.keys(taxas).length > 0 
                            && taxas !== undefined  ? 
                            (<>
                                {Object.values(taxas).map( (_taxa:any,k:number) => {
                                    return (<>
                                            <div key={k} className={classes.divTaxaResultado}>
                                                <div className={classes.divTaxaResultado2} >
                                                    <div>
                                                        {(_taxa.tipopagamentos !== null ? 
                                                            _taxa.tipopagamentos.strTipoPagamento : 
                                                            `Valor Conversão de ${_taxa.flValorMinTaxa.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} ~ ${_taxa.flValorMaxTaxa.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
                                                        )}
                                                    </div>
                                                    <div>
                                                        <TextField 
                                                            label="Taxa"
                                                            className={classes.textField}
                                                            value={_taxa.flTaxa}
                                                            id={`flTaxa`}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            InputProps={{
                                                                inputComponent: NumberFormatCustom,
                                                                inputProps: { decimalScale: 2, maxLength: 5,  style: {  textAlign: 'right', fontSize: 18, padding: 10}  }
                                                            }}
                                                            size={'medium'}
                                                            margin={'dense'}
                                                            inputProps={{  maxlenght: 5 }}
                                                            required
                                                            onChange={ (element:any) => {
                                                                let _elementos = new Array();
                                                                taxas.map( (taxa:IParametrosTaxa) => {
                                                                    if(taxa.id=== _taxa.id){
                                                                        _elementos.push({ ...taxa , flTaxa: Number(element.target.value)})
                                                                    }else{
                                                                        _elementos.push({...taxa})
                                                                    }                                                                    
                                                                })
                                                                setTaxas(_elementos)
                                                           
                                                            }} 
                                               
                                                        />
                                                    </div>
                                                    <div>
                                                        <Button  style={{  
                                                                    width:'10vw',
                                                                    height:'35px',
                                                                    background: '#04ccb9',
                                                                    color:'#fff',
                                                                    fontSize: '12px' }}
                                                            onClick={ () => salvarTaxa(_taxa.id,_taxa) } 
                                                        > 
                                                            Salvar 
                                                        </Button>
                                                    </div>
                                                </div >
                                            </div>
                                            <hr className={classes.hr}/>
                                        </>)
                                })}
                            </>) : 
                            (<><div> Nenhuma taxa cadastrada.</div></>)
                        } 
                    </div>
                </Paper>
                <div>
                    <Snackbar open={blMensagem} autoHideDuration={5000}  onClose={() => { setBlMensagem(false) } } >
                        <div>
                            { alertData.strMensagem!== "" ? 
                                alertData.strMensagem.split("\n").map( (mensagens:any) => {
                                    return (mensagens !== "" ? 
                                    (<>
                                        {alertData.strType === 'error' ? (<Alert onClose={() => setBlMensagem(false)} severity='error' sx={{ width: '100%' }}>{mensagens}</Alert>) : (<></>)}
                                        {alertData.strType === 'success' ? (<Alert onClose={() => setBlMensagem(false)} severity='success' sx={{ width: '100%' }}>{mensagens}</Alert>) : (<></>)}
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

export default Taxa;
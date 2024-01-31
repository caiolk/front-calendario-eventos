import React,{ useState, useEffect, useCallback, useRef } from 'react';

import { Paper, TextField, Button, Snackbar, Alert,Backdrop, CircularProgress } from '@mui/material';

import useStyles from './styles'
import api from '../../services/api'

interface LoginParams{
    visualizar: boolean
}

const Login = (props:LoginParams) => {
    
    const { visualizar } = props;
    const classes = useStyles();
    const loginRef = useRef<HTMLInputElement>(null);
    const senhaRef = useRef<HTMLInputElement>(null);
    const [loginErro,setLoginErro] = useState(false);
    const [senhaErro,setSenhaErro] = useState(false);
    const [blMensagem,setBlMensagem] = useState(false);
    const [alertData, setAlertData] = useState({strMensagem:'',strType:''});
    const [update,setUpdate] = useState(false);
    const [btnSalvar,setBtnSalvar] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect( () => {
        
        if(update){
            if( !loginErro && !senhaErro){
                setBtnSalvar(true);
            }else{
                setBtnSalvar(false);
            }
        }
        
        
    },[loginErro,senhaErro,update])



    const login = useCallback( async () => {
        setLoading(true);
        const _login =  loginRef.current?.value;
        const _senha =  String(senhaRef.current?.value)

        return await api.post('/login',
                { 'email' : _login,
                  'password'   : _senha
                }).then( (result:any) => {
      
                    if(result.data.data){
                        
                        localStorage.setItem('_data', JSON.stringify(result.data.data));
                        window.location.href = '/'
                        setBlMensagem(false)
                    }else{
                        setAlertData({ strType: "error", strMensagem: "Login ou senha inválidos."})
                        setBlMensagem(true)
                        
                    }
                    setLoading(false);
                }).catch( (error:any) => {
                    
                    setLoading(false);
                    setAlertData({ strType: "error", strMensagem: "Login ou senha inválidos."})
                    setBlMensagem(true)
                })
    },[])

    const handleClose = (event:any, reason:any) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    
    return (<>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div   className={classes.root} >
                <div className={classes.container}>
                    <form>
                        <div className={classes.divInputs} >

                            <TextField 
                            style={{ margin: 10}}
                                id="login" 
                                inputRef={loginRef}
                                label="Login" 
                                type="text"
                                error={loginErro}
                                helperText={ (loginErro ? "Campo obrigatório." : "") }
                                autoComplete="off"
                                inputProps={{ maxLength: 40 }}
                                className={classes.intputLogin}
                                onChange={ (value:any) => {
                                    setLoginErro((value.target.value=="" ? true :  false)) 
                                    setUpdate(true);     
                                }}
                                onBlur={(value:any) => 
                                    {
                                        setLoginErro((value.target.value=="" ? true :  false));
                                        setUpdate(true);
                                    }
                                 }
                                 required
                            />
                            <TextField 
                                id="senha" 
                                style={{ margin: 10}}
                                inputRef={senhaRef}
                                error={senhaErro}
                                helperText={(senhaErro ? "Campo obrigatório." : "")}
                                label="Senha" 
                                type="password"
                                autoComplete="off"
                                className={classes.intputSenha}
                                inputProps={ { maxLength: 40 } }
                                onChange={ (value:any) => {
                                    setSenhaErro((value.target.value=="" ? true :  false));
                                    setUpdate(true)
                                }}
                                onBlur={(value:any) => {
                                            setSenhaErro((value.target.value=="" ? true :  false));
                                            setUpdate(true);
                                        }}
                                required
                            />
                            <Button 
                                style={{ 
                                    margin: 10,
                                    width:'32vw',
                                    height:'35px',
                                    background: '#04ccb9',
                                    color:'#fff',
                                    fontSize: '12px'
                                } }
                                className={ (btnSalvar ? classes.btnSalvar : classes.btnSalvarDesabilitado) }
                                onClick={ ( btnSalvar ? login : undefined  ) }
                                >
                                Logar
                            </Button>
                        </div>
                    </form>
                </div>
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
        </>
        )

}


export default Login;
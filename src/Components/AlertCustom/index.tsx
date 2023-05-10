import { TextField, Paper, Select , Button, Snackbar, Alert, Backdrop, CircularProgress, AlertTitle } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const AlertCustom = () => {
    const [msgErro,setMsgErro] = useState(true);
    const [alertData, setAlertData] = useState({strMensagem:'teste\nteste\nteste\nteste\nteste\nteste\n', strType:'error'});

    return (
        <>
            <Snackbar open={msgErro} autoHideDuration={10000}  onClose={() => { setMsgErro(false) } } >
                <div>
                    <Alert onClose={() => setMsgErro(false)} severity="error" sx={{ width: '100%' }}>
                        <AlertTitle><strong>Erro</strong></AlertTitle>
                        { alertData.strMensagem!== "" ? 
                            alertData.strMensagem.split("\n").map( (mensagens:any) => {
                                return (mensagens !== "" ?  (<><div>-{mensagens}.</div></>) : '' )
                                
                            } )
                            : ''
                        }
                        </Alert>
                </div>
            </Snackbar>
        </>
    )


}


export default AlertCustom;
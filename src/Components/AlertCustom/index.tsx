import { TextField, Paper, Select , Button, Snackbar, Alert, Backdrop, CircularProgress, AlertTitle } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IAlertCustomParm from '../../shared/interfaces/IAlertCustomParm'

const AlertCustom = () => {
    const alertCustom = useSelector( (state:IAlertCustomParm) => state.alertCustom );
    const dispatch = useDispatch();
    const [openAlert,setOpenAlert] = useState(false);
    const [menssage,setMessage] = useState('');
    const [type,setType] = useState("warning");
    
    useEffect(() => {
        setOpenAlert(alertCustom.openAlert)
        setMessage(alertCustom.strMensagem)
    },[alertCustom])

    return (
        <>
            <Snackbar open={openAlert} autoHideDuration={5000}  onClose={() => { setOpenAlert(false) } } >
                <div>
                    <Alert onClose={() => setOpenAlert(false)} severity="error" sx={{ width: '100%' }}>
                        <AlertTitle><strong>Erro</strong></AlertTitle>
                        { menssage }
                        </Alert>
                </div>
            </Snackbar>
        </>
    )


}


export default AlertCustom;
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IAlertCustomParm from '../../shared/interfaces/IAlertCustomParm'

const AlertCustom = (key?:any) => {
    const alertCustom = useSelector( (state:IAlertCustomParm) => state.alertCustom );
    const dispatch = useDispatch();
    const [open,setOpen] = useState(false);
    const [mensagens,setMensagens] = useState([]);
    const [tipo,setTipo] = useState("info");
    const [titulo,setTitulo] = useState("");
    
    useEffect(() => {
        setOpen(alertCustom.open);
        setMensagens(alertCustom.mensagens);
        setTitulo(alertCustom.title);
        setTipo(alertCustom.type);
    },[alertCustom])

    function tipoAlert(type:string){    
        switch (type) {
            case 'info':
                return <Alert severity="info" sx={{ width: '100%' }} onClose={() => setOpen(false)} > 
                            <AlertTitle><strong>{titulo}</strong></AlertTitle> 
                            { mensagens.length > 0 ? mensagens.map( ( mensagem:string ) => { return (<><div> - {mensagem} </div></>) }) : '' } 
                        </Alert>
            case 'success':
                return <Alert severity="success" sx={{ width: '100%' }} onClose={() => setOpen(false)} > 
                            <AlertTitle><strong>{titulo}</strong></AlertTitle> 
                            { mensagens.length > 0 ? mensagens.map( ( mensagem:string ) => { return (<><div> - {mensagem} </div></>) }) : '' } 
                        </Alert>
            case 'warning':
                return <Alert severity="warning" sx={{ width: '100%' }} onClose={() => setOpen(false)} > 
                            <AlertTitle><strong>{titulo}</strong></AlertTitle> 
                            { mensagens.length > 0 ? mensagens.map( ( mensagem:string ) => { return (<><div> - {mensagem} </div></>) }) : '' } 
                        </Alert>
            case 'error':
                return <Alert severity="error" sx={{ width: '100%' }} onClose={() => setOpen(false)} > 
                            <AlertTitle><strong>{titulo}</strong></AlertTitle> 
                            { mensagens.length > 0 ? mensagens.map( ( mensagem:string ) => { return (<><div> - {mensagem} </div></>) }) : '' } 
                        </Alert>
            default:
                return <Alert severity="info" sx={{ width: '100%' }} onClose={() => setOpen(false)} > 
                            <AlertTitle><strong>{titulo}</strong></AlertTitle> 
                            { mensagens.length > 0 ? mensagens.map( ( mensagem:string ) => { return (<><div> - {mensagem} </div></>) }) : '' } 
                        </Alert>
        }
    }
    return (
        <>
            <Snackbar key={key} open={open} autoHideDuration={5000}  onClose={() => { setOpen(false) } } >
                <div> {tipoAlert(tipo)} </div>
            </Snackbar>
        </>
    )


}


export default AlertCustom;
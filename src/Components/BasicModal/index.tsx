import React, { useEffect, useState,  useCallback, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import { TextField, Box, Paper, Select , Button, Snackbar, Alert, Backdrop, CircularProgress, Tabs, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Modal from '@mui/material/Modal';
import api from '../../services/api';
import ISessaoParametros from '../../shared/interfaces/ISessaoParametros'
import IEventoDetalhesParam from '../../shared/interfaces/IEventoDetalhesParam'
import useStyles from './styles';
import EventoDetalhes from '../EventoDetalhes';
import InscricaoCard from '../InscricaoCard';

const style = {
  marginTop:'50vh',
  marginLeft:'50%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '85vw',
  height: '85vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export interface IModalHandles {
  openModal: (uuid?:string, tipoModal?:string) => void;
  closeModal : () => void;
}

const BasicModal: React.ForwardRefRenderFunction<IModalHandles> = (props, ref) => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [uuidEvento, setUuidEvento] = useState("");
  const [tipo, setTipo] = useState("");
  const [dadosEventos, setDadosEventos] = useState<IEventoDetalhesParam>({});
  const session = useSelector( (state:ISessaoParametros) => state.session );
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const openModal = useCallback( (uuid?:string, tipoModal?:string) => {
        setDadosEventos({});
        
        if(tipoModal===undefined){
          setLoading(true);  
          if(uuid!==""){
              buscaEventos(uuid)
          }
        }else{
          setTipo(tipoModal);
          setLoading(false);  
        }
        setOpen(true);
  },[] );

  const closeModal = useCallback( () => {
    setUuidEvento("");
    setOpen(false);
    setDadosEventos({});
  },[] );

  useImperativeHandle(ref, () => {
      return{
        openModal,
        closeModal
      }
  });

  async function buscaEventos(uuidEvento?:string){
    
    if(uuidEvento==="") return;
    
    return await api.get( `/eventos/${uuidEvento}`,
        { headers: {
            'Authorization': `Bearer ${session.access_token.access_token}`
        } }).then( (result:any) => {
            if(result.data.data && result.data.status !== false){
                setDadosEventos(result.data.data);     
            }  
            setLoading(false)
        }).catch( (error:any) => {
            setDadosEventos({});
            setLoading(false);
        })
  }

  return (
    <div>
      <Modal
        open={open}
        
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Button   variant="text" size="small" onClick={handleClose}  style={{ background: 'rgb(211 34 34)', color:'#fff', fontSize: 10, borderRadius: 2, position: "absolute", top: "-0", right: "-0"}}>
              Fechar X
            </Button>
            <div className={classes.info} style={{ flexDirection: 'column',  justifyContent:'center', alignItems:'center', overflow: 'auto', width: '100%' }} >
                <div>Detalhes do evento</div>
            </div>
            <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Evento" value="1" />
                <Tab label="Inscrições" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className={classes.divPrincipal} >      
                      { (dadosEventos !== null && dadosEventos !== undefined && Object.keys(dadosEventos).length > 0) || (tipo !== undefined && tipo !== "") ? 
                        (<><EventoDetalhes eventoDetalhes={dadosEventos} tipo={tipo} /></>) : 
                        (<><div> Detalhe não disponível.</div></>)
                      }  
                  </div>
            </TabPanel>
            <TabPanel value="2">
              <InscricaoCard eventoUid={(dadosEventos.uuid ? dadosEventos.uuid : "")}/>
            </TabPanel>
          </TabContext>
            
        </Box>
      </Modal>
    </div>
  );
}

export default forwardRef(BasicModal);
import React, { useEffect, useState,  useCallback, forwardRef, useImperativeHandle } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import api from '../../services/api';

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
  openModal: (uuid:string) => void;
  closeModal : () => void;
}

// interface IPropsParam{
//   arPeriodo: {
//     dtInicio: string,
//     dtFim: string,
//     dtInicioFormatado: string,
//     dtFimFormatado: string
//   }
// }

const BasicModal: React.ForwardRefRenderFunction<IModalHandles> = (props, ref) => {

  const [open, setOpen] = useState(false);
  const [uuidEvento, setUuidEvento] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const openModal = useCallback( (uuid:string) => {
        if(uuid!==""){
            setUuidEvento(uuid);
        }
      setOpen(true);
  },[] );

  const closeModal = useCallback( () => {
    setUuidEvento("");
    setOpen(false);
  },[] );

  useImperativeHandle(ref, () => {
      return{
        openModal,
        closeModal
      }
  });

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <>asdfasdf</>
        </Box>
      </Modal>
    </div>
  );
}

export default forwardRef(BasicModal);
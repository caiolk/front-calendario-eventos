import React, { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';

const ChipCustom = (props:any) => {
    const { desc } = props;
    
    switch (desc) {
        case 'Aberto':
            return <Chip style={{ fontSize:"10px" }} label={desc} size="small" color="success" />;
        case 'Encerrado':
            return <Chip style={{ fontSize:"10px" }} label={desc} size="small" color="warning" />;
        case 'Esgotado':
            return <Chip style={{ fontSize:"10px" }} label={desc} size="small" color="warning" />;
        case 'Cancelado':
            return <Chip style={{ fontSize:"10px" }} label={desc} size="small" color="error" />;
        default:
            return <Chip style={{ fontSize:"10px" }} label="N/D" size="small" color="default" />;
    }
    
  }

  export default ChipCustom;
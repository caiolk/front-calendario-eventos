import React, { useState, useEffect } from 'react';
import { TextField, Paper, Select , Button, Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';
import NumberFormatCustom from '../../Components/NumberFormatCustom';
import useStyles from './styles';

const SearchBar = (props:any) => {
    const classes = useStyles();
    const [evento,setEvento] = useState('');
    const { desc } = props;
    
    return (
        <div className={classes.divPrincipal} >
            <Paper className={classes.paper}>
                    <div className={classes.divMoeda} >
                        <TextField
                            label="Evento"
                            autoComplete='false'
                            className={classes.divValor}
                            value={evento}
                            onChange={(event:any) => setEvento(event.value)}
                            id={`flValorConversao`}
                            InputLabelProps={{
                                shrink: true
                            }}
                            InputProps={{ }}
                            inputProps={{ maxLength: 35 }}
                        />
                        <TextField
                            className={classes.textFieldMoeda}
                            id={`uf`}
                            select
                            label="UF"
                            InputLabelProps={{
                                shrink: true
                            }}
                            SelectProps={{
                                native: true,
                            }}
                            value={ ""}
                            onChange={(event:any) => {
                                
                            }} 
                        >
                            <option value={''}> Todos </option>
                            <option value={'PR'}> PR </option>
                            <option value={'SC'}> SC </option>
                            <option value={'RS'}> RS </option>
                            <option value={'SP'}> SP </option>
                            <option value={'RJ'}> RJ </option>
                        </TextField>
                        <TextField
                            className={classes.textFieldMoeda}
                            id={`uf`}
                            select
                            label="Status"
                            InputLabelProps={{ shrink: true }}
                            SelectProps={{ native: true }}
                            value={""}
                            onChange={(event:any) => { }} 
                        >
                            <option value={''}> Todos </option>
                            <option value={'Aberto'}> Aberto </option>
                            <option value={'Encerrado'}> Encerrado </option>
                            <option value={'Cancelado'}> Cancelado </option>
                            <option value={'Esgotado'}>  Esgotado </option>

                        </TextField>
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
                            onClick={() => {}} >
                            Buscar
                        </Button>   
                    </div>
            </Paper>
        </div>
    )
    
  }

  export default SearchBar;
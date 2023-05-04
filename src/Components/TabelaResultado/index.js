import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import ChipCustom from '../ChipCustom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';

import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from './styles'
import { visuallyHidden } from '@mui/utils';
import BasicModal from '../../Components/BasicModal';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {

  const stabilizedThis = array.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    
    const order = comparator(a[0], b[0]);
    
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'evento_titulo', numeric: false, disablePadding: true, label: 'Corrida', },
  { id: 'cidade', numeric: false, disablePadding: true, label: 'Cidade', },
  { id: 'uf', numeric: false, disablePadding: false, label: 'UF', },
  { id: 'organizador.nome_fantasia', numeric: false, disablePadding: true, label: 'Organizador', },
  { id: 'evento_data_realizacao', numeric: false, disablePadding: true, label: 'Realização', },
  { id: 'url_pagina', numeric: false, disablePadding: true, label: 'Inscrição', },
  { id: 'status_string', numeric: false, disablePadding: true, label: 'Status', },
  { id: 'created_at', numeric: false, disablePadding: true, label: 'Registrado', },
  { id: 'acoes', numeric: false, disablePadding: true, label: 'Ações', },
];

function EnhancedTableHead(props) {
  const {  order, orderBy, numSelected, rowCount, onRequestSort } =
    props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  
  return (
    
    <TableHead >
      <TableRow>
        <TableCell padding="checkbox">
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ fontWeight: 'bold' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


export default function EnhancedTable(props) {

  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(1000);
  const [loading,setLoading] = useState(true);
  const [data,setData] = useState([]);
  const { arDados, arPeriodo, tipo } = props;
  const modalRef = useRef(null);
  let intTotal = 0;
  
  useEffect(() => {
        setData(arDados) 
  },[arDados])

  useEffect(() => {
    if(data.length > 0) {
      setLoading(false)
    }
  },[data])
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  function openModalRef(uuid){
  
    modalRef.current?.openModal(uuid);
    
  }

  return (
    <>
    { loading === true ?
        (<><div><Backdrop className={classes.backdrop} open={loading} >
              <CircularProgress color="inherit" />
          </Backdrop></div></>) : 
        (<>
          
          <hr style={{ width: '99%' }} />
          <div style={{ width: '99%',  height: '95%' }}>
            <Box sx={{ width: '99%', overflow: 'auto', height: '95%' }}>
              <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                  <Table
                    sx={{ minWidth: 600 }}
                    aria-labelledby="tableTitle"
                    size={dense ? 'small' : 'medium'}
                    
                  >
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={data.length}
                      arPeriodo={arPeriodo}
                      tipo={tipo}
                      
                    />
                    <TableBody  >
                      {stableSort(data, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                          let data =  (row.created_at).split('T')
                          let _data = data[0].split('-').reverse().join('/')
                          let _realizacao = row.evento_data_realizacao.split('-').reverse().join('/')
                          intTotal++;
                          const labelId = `enhanced-table-checkbox-${index}`;
                          return (
                            <TableRow
                              hover
                              style={{ fontSize: '10px !important' }}
                              role="checkbox"
                              tabIndex={-1}
                              key={index}
                            >
                              <TableCell padding="checkbox"></TableCell>
                              <TableCell align="left"   className={classes.tableFont}> {String(row.evento_titulo)} </TableCell>
                              <TableCell align="center" className={classes.tableFont}> {String(row.cidade)} </TableCell>
                              <TableCell align="center" className={classes.tableFont}> {String(row.uf)} </TableCell>
                              <TableCell align="center" className={classes.tableFont}> {String(row.organizador.nome_fantasia)} </TableCell>
                              <TableCell align="center" className={classes.tableFont}> {String(_realizacao)} </TableCell>
                              <TableCell align="center" className={classes.tableFont}> <a target={'_blank'} href={String(row.url_pagina)}><LinkIcon/></a> </TableCell>
                              <TableCell align="center" className={classes.tableFont}> <ChipCustom desc={String(row.status_string)}/></TableCell>
                              <TableCell align="center" className={classes.tableFont}> {`${_data}`} </TableCell>
                              <TableCell align="center" className={classes.tableFont}> 
                                <div style={{display:'flex', flexDirection: 'row', justifyContent:'space-evenly'}}> 
                                  <Button 
                                      style={{ background: 'rgb(64 144 213)' }}
                                      variant="contained" 
                                      size="small"
                                      onClick={() => {openModalRef(row.uuid)} } >
                                      <EditIcon  style={{fontSize : '16px'}}/>
                                  </Button>
                                  <Button 
                                      style={{ width: '12px', background: 'rgb(205 17 17)' }}
                                      variant="contained" 
                                      size="small"
                                      onClick={() => {}} >
                                      <DeleteIcon style={{fontSize : '16px'}}/>
                                  </Button>  
                                </div>
                              </TableCell> 
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: (dense ? 33 : 53) * emptyRows,
                          }}
                        >
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          <hr style={{ width: '99%' }} />
          <div style={{ width: '100%', marginLeft: '-1%'}} >
          { intTotal>0 ? 
              (<div style={{display:'flex', flexDirection: 'column', fontWeight: '100',}} >
                <div style={{display:'flex', flexDirection: 'row', justifyContent:'flex-end', padding : 5}} >
                  <div style={{ fontWeight:'bold', marginRight: 15 }} >Total Registros: </div>
                  <div>{intTotal} </div>
                </div>
              </div>) : 
              (<></>) 
            }
          </div>
          </div>
          <BasicModal ref={modalRef}  />
          </>
        )}
    </>
  );
}

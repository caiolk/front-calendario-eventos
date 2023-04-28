import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';


import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from './styles'
import { visuallyHidden } from '@mui/utils';



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
  { id: 'strMoedaOrigem', numeric: false, disablePadding: true, label: 'Moeda Ori.', },
  { id: 'strMoedaDestino', numeric: false, disablePadding: true, label: 'Moeda Dest.', },
  { id: 'strFormaPagamento', numeric: false, disablePadding: true, label: 'Forma Pgto.', },
  { id: 'flValorConversao', numeric: true, disablePadding: true, label: 'VL Conversão', },
  { id: 'flTaxaPagamento', numeric: true, disablePadding: true, label: 'Taxa Pagamento', },
  { id: 'flTaxaConversao', numeric: true, disablePadding: true, label: 'Taxa Conversão', },
  { id: 'flValorMoedaDestinoConversao', numeric: true, disablePadding: true, label: 'VL Moeda Destino Conversão', },
  { id: 'flValorUtilizadoConversao', numeric: true, disablePadding: true, label: 'VL Utilizado Conversão', },
  { id: 'flValorCompradoMoedaDestino', numeric: true, disablePadding: true, label: 'VL Comprado Moeda Destino', },
  { id: 'created_at', numeric: true, disablePadding: true, label: 'Data', },
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
            align={ headCell.style !== ""  ? headCell.style : ( headCell.numeric ? 'right' : 'left' )
               }
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
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
  let intTotalHistoricos = 0;
  
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
  
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <>
    { loading === true ?
        (<><div><Backdrop className={classes.backdrop} open={loading} >
              <CircularProgress color="inherit" />
          </Backdrop></div></>) : 
        (<>
          
          <hr style={{ width: '99%' }} />
          <div style={{ width: '99%',  height: '95%' }}>
            <Box sx={{ width: '99%', overflow: 'auto', height: '92%' }}>
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
                          let hora = data[1].split('.')
                          hora = hora[0]
                          intTotalHistoricos++;
                          const labelId = `enhanced-table-checkbox-${index}`;
                          console.log(row)
                          return (
                            <TableRow
                              hover
                              style={{ fontSize: '10px !important' }}
                              role="checkbox"
                              tabIndex={-1}
                              key={index}
                            >
                              <TableCell padding="checkbox">
                              </TableCell>
                              <TableCell align="left" className={classes.tableFont} >
                                {String(row.strMoedaOrigem)}
                              </TableCell>
                              <TableCell align="left" className={classes.tableFont} >
                                {String(row.strMoedaDestino)}
                              </TableCell>
                              <TableCell align="left" className={classes.tableFont} >
                                {String(row.strFormaPagamento)}
                              </TableCell>
                              <TableCell align="left" className={classes.tableFont} >
                                {row.flValorConversao.toFixed(2).replace('.',',')}
                              </TableCell>
                              <TableCell align="left" className={classes.tableFont} >
                                {row.flTaxaConversao.toFixed(2).replace('.',',')}
                              </TableCell>
                              <TableCell align="left" className={classes.tableFont} >
                                {row.flTaxaPagamento.toFixed(2).replace('.',',')}
                              </TableCell>
                              <TableCell align="left" className={classes.tableFont} >
                                {row.flValorMoedaDestinoConversao.toFixed(2).replace('.',',')}
                              </TableCell>
                              <TableCell align="left" className={classes.tableFont} >
                                {row.flValorUtilizadoConversao.toFixed(2).replace('.',',')}
                              </TableCell>
                              <TableCell align="left" className={classes.tableFont} >
                                {row.flValorCompradoMoedaDestino.toFixed(2).replace('.',',')}
                              </TableCell>
                              <TableCell align="0" className={classes.tableFont} >
                                {`${_data} ${hora}`}
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
          { intTotalHistoricos>0 ? 
              (<div style={{display:'flex', flexDirection: 'column', fontWeight: '100',}} >
                <div style={{display:'flex', flexDirection: 'row', justifyContent:'flex-end', padding : 5}} >
                  <div style={{ fontWeight:'bold', marginRight: 15 }} >Total Registros: </div>
                  <div>{intTotalHistoricos} </div>
                </div>
              </div>) : 
              (<></>) 
            }
          </div>
          </div>
          </>
        )}
    </>
  );
}

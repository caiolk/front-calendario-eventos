import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	divPrincipal:{
    display:'flex', 
    flexDirection: 'row', 
    height: '75%', 
    width: '100%', 
    justifyContent: 'center'
  },
  divPrincipalLote:{
    display:'flex', 
    flexDirection: 'column', 
    height: '75%', 
    width: '100%', 
    justifyContent: 'center'
  },
  paper:{
    display:'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent:'space-evenly', 
    padding: 5, 
    height: '75% !important', 
    width: '95vw'
  },
  divCampos:{
    display:'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent:'space-evenly', 
    width: '100%', 
    padding: 5
  },
  divButton:{
    display:'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent:'end', 
    width: '100%', 
    padding: 5
  },
  buttonBuscar:{
    width:'10vw',
    height:'35px',
    background: '#04ccb9',
    color:'#fff',
    fontSize: '12px'
  },
  textFieldMoeda:{
    width:'12.5vw', 
    margin:2
  },
  divValor:{
    width:'25vw', 
    margin:2
  },
  resize: {
    fontSize: 10
	},
  btnSalvar:{
    width:'50px',
    height:'35px',
  },
  btnSalvarAtivo:{
      width:'10px',
      height:'35px',
      background: '#04ccb9',
      color:'#fff',
      '&:hover': {
        backgroundColor: '#07ebd5',
        color: '#fff'
      },
      fontSize: '8px'
  },

  info:{
    display:'flex', 
    flexDirection: 'row', 
    marginBottom: 10, 
    justifyContent: 'space-around',
    backgroundColor: 'rgb(28, 67, 99)',
    borderRadius:'5px',
    width: '96%',
    padding: 5,
    color: '#fff',
    fontWeight: 'bold'
  },
  addIcon:{
    width:'1px',
    height:'30px',
    color:'#fff',
    fontSize: '12px'
  },

  btnSalvarDesabilitado:{
    width:'40px',
    height:'35px',
    background:'#61b0a8',
    borderColor:'#61b0a8',
    color:'#fff',    
  },
}));

export default useStyles;

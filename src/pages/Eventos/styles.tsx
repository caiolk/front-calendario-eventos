import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	divPrincipal:{
    display:'flex', 
    flexDirection: 'row', 
    height: '75%', 
    width: '100%', 
    justifyContent:'space-evenly', 
    alignItems:'center'
  },
  paper:{
    display:'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent:'space-evenly', 
    padding: 10, 
    height: '75% !important', 
    width: '95vw', 
    margin: 5
  },
  divMoeda:{
    display:'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent:'space-evenly', 
    width: '100%', 
    padding: 5
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
    stparc: {
      fontSize: '10px'
    },
    listaParcelas: { 
      display:'flex', 
      alignItems:'flex-end',
      justifyContent:'space-around'
    },
    info:{
      display:'flex', 
      flexDirection: 'row', 
      marginBottom: 10, 
      justifyContent: 'space-around',
      backgroundColor: 'rgb(28, 67, 99)',
      borderRadius:'5px',
      width: '95%',
      padding: 5,
      color: '#fff',
      fontWeight: 'bold'
    }
    
}));

export default useStyles;

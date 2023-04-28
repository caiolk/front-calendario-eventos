import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    info:{
      display:'flex', 
      flexDirection: 'row', 
      marginBottom: 10, 
      justifyContent: 'space-around',
      backgroundColor: 'rgb(28, 67, 99)',
      borderRadius:'5px',
      width: '99%',
      padding: 5,
      color: '#fff',
      fontWeight: 'bold'
    },
    divPrincipal:{
      display:'flex', 
      flexDirection: 'column', 
      marginTop: '5%', 
      height: '75%', 
      width: '100%', 
      justifyContent:'center', 
      alignItems:'center'
    },
    paper:{
      display:'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: 10, 
      height: '75% !important', 
      width: '75vw', 
      margin: 5
    },
    paperDiv:{
      display:'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      width: '25vw', 
      padding: 10
    },
    divMoeda:{
      display:'flex', 
      flexDirection: 'row', 
      alignItems: 'center', 
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
    divResultado:{
      display:'flex', 
      flexDirection: 'row', 
      alignItems: 'center', 
      width: '100%', 
      padding: 2, 
      justifyContent: 'space-between'
    },
    divResultadoPrincipal:{
      display:'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      width: '75%', 
      padding: 10,
      fontWeight:400
    }
    
}));

export default useStyles;

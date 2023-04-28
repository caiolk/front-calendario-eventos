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
    buttonSalvar: {
      width:'10vw',
      height:'35px',
      background: '#04ccb9',
      color:'#fff',
      fontSize: '12px'

    },
    textField:{
      width:'10vw', 
      alignItems: 'right', 
      padding:5, 
      margin:10

    },
    hr:{
      border:'0.001px solid #c6c6c6', 
      width: '100%'
    },
    paper:{
      display:'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: 10
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
    divTaxa:{
      display:'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      width: '92vw'
    },
    divTaxaResultado:{
      display: 'flex', 
      flexDirection:'row', 
      color: '#000', 
      height: '17vh',
      fontWeight: 400, 
      width: '60vw', 
      alignItems:'center', justifyContent:'center', alignContent:'center'
    },
    divTaxaResultado2:{
      display: 'flex', 
      flexDirection:'column', 
      justifyContent:'center', 
      alignItems: 'center'
    }
   
}));

export default useStyles;

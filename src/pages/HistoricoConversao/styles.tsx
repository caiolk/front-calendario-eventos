import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	
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
      width: '99%',
      padding: 5,
      color: '#fff',
      fontWeight: 'bold'
    }
    
}));

export default useStyles;

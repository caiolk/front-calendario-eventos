import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    status_a:{
      color: 'green !important',
      fontWeight: 'bold'
    },
    status_i:{
      color: 'red !important',
      fontWeight: 'bold'
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
    },
    tableFont:{
      fontSize: 10,
      textTransform: 'capitalize'
    }
  }));


  export default useStyles;
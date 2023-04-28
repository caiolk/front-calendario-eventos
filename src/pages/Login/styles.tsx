import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme:any) => ({
	root:{
		display:'flex',
		flexDirection:'row',
		justifyContent:'center',
		width:'100vw',
		height:'90vh'
	},
	container:{
		display:'flex',                   
		alignSelf:'center',
		boxShadow:'0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)'
	},
	divLogo:{
		display:'flex',
		justifyContent:'center',
		background:'rgb(28, 67, 99)',
		width:'25vw',
		height:'45vh', 
	},
	divInputs:{
		display:'flex',
		flexDirection:'column',
		background:'white',
		width:'45vw',
		height:'45vh',
		padding: 15,
		justifyContent:'center',
		alignItems:'center'
	},
	btnSalvar:{
		margin:'15px',
		width:'70%',
		background:'#009688',
		borderColor:'#009688',
		color:'#fff',
	
	},
	btnSalvarDesabilitado:{
		margin:'15px',
		width:'70%',
		background:'#61b0a8',
		borderColor:'#61b0a8',
		color:'#fff',
		
		
	},
	intputLogin:{
		width:'75%'
	},
	intputSenha:{
		width:'75%',
		margin:'5px'
	},
	imgLogo:{
		alignSelf:'center'
	}
}));

export default useStyles;
import React,{  useEffect, useState } from 'react';
import clsx from 'clsx';
import { Router, Route, Link, Routes, BrowserRouter, Navigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserHistory } from "history";

import { withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, IconButton, Tooltip, Switch,Button, Paper, MenuItem } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import Icon from '@mdi/react';
import { mdiLogout } from '@mdi/js';
import { IsAuthenticated } from './auth'


import { setSession } from './store/actions/Session.action';

import Home from './pages/Home';
import Taxa from './pages/Configuracao/Taxa';
import Login from './pages/Login';
import HistoricoConversao from './pages/HistoricoConversao';

interface ISessaoParametros{
  session:{
    user:{
      id:number,
      nome:string,
      email:string,
      blAdmin:number
    },
    access_token:{
      access_token: string,
      expires_in: string,
      token_type: string
    }
  }
  
}

const { REACT_APP_HOST } = process.env;

const history = createBrowserHistory();

function logout(){
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = `${REACT_APP_HOST}/login`
}

function PrivateRoute({ children}:any) {
  
  const auth = IsAuthenticated().auth;
  return auth ? children  : <Navigate to="/login" />;
}


const MyToolbar = withStyles({
    root: {
      display: 'flex',
      flexDirection: 'column'
      
    },
    textUserName:{
      marginRight: '10px',
      fontSize: '12px'
    }
    
  })(
    ({ classes, title, onMenuClick, strNomeUsuario, objData }:any) => (

      strNomeUsuario !== null && strNomeUsuario !== '' && strNomeUsuario !== undefined ? (<>
      <BrowserRouter>
        <AppBar style={styles.toolbar} className={classes.aboveDrawer}>  
              
        <IconButton
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="Menu"
                  onClick={onMenuClick}
                >
                  <MenuIcon />
                </IconButton>
            
              <Toolbar  disableGutters={true}  >
                <span className={classes.textUserName} >
                  { strNomeUsuario !== '' ? strNomeUsuario : ''}
                </span>
                <Tooltip title='Sair'>
                  <Toolbar  disableGutters={false}  onClick={() => { logout() }} style={{background:'#009688', cursor: 'pointer', height: '100%'}} >
                    <IconButton
                      color="inherit">
                          <Icon path={mdiLogout}
                              size={0.89}
                              vertical
                              rotate={0}
                              color="white"/>
                      </IconButton>
                  </Toolbar>
                </Tooltip>
            </Toolbar>
          
        </AppBar>
        </BrowserRouter>
        <div className={classes.toolbarMargin} />
      </>) : (<></>)
      
    )
  );

  const MyDrawer = withStyles({
    root: {
      display: 'flex',
      flexDirection: 'column'
    },
  })(
    ({ classes, variant, open, onClose, onItemClick }:any) => (
        <>
          <BrowserRouter >  
          <Drawer  variant={variant} open={open} onClose={onClose}
                        classes={{
                        paper: classes.drawerPaper
                        }}
                >
                    <div 
                    className={clsx({
                        [classes.toolbarMargin]: variant === 'persistent'
                    })}
                    />
                  <List style={{color:'#fff'}} >
                    <ListItem 
                      button 
                      component={Link} 
                      to={`/`} 
                      onClick={onItemClick('Home')}>
                        <ListItemText>Home</ListItemText>
                    </ListItem>
                    <ListItem 
                      button 
                      component={Link} 
                      to={`/historico-conversao`} 
                      onClick={onItemClick('HistoricoConversao')}>
                        <ListItemText>Histórico das Conversão</ListItemText>
                    </ListItem>
                    <ListItem 
                      button 
                      component={Link} 
                      to={`/taxa`} 
                      onClick={onItemClick('Taxa')}>
                        <ListItemText>Taxas</ListItemText>
                    </ListItem>
                   
                  </List>
                
                </Drawer>  
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/taxa"
                element={
                  <PrivateRoute>
                    <Taxa />
                  </PrivateRoute>
                }
              />
              <Route
                path="/historico-conversao"
                element={
                  <PrivateRoute>
                    <HistoricoConversao />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<Login visualizar={true} />} />
            </Routes>
          </BrowserRouter>
        </>
    )
  );

const AllRoutes = ({ classes, variant }:any) => {    
    const [drawer, setDrawer] = useState(false);
    const [title, setTitle] = useState('Home');
    const [nomeUsuario, setNomeUsuario] = useState(null);
    const dispatch = useDispatch();
    const session = useSelector( (state:ISessaoParametros) => state.session );
    const data = useSelector( (state:any) => state.data );
    const monName = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "dezembro"]
    var now = new Date();
    const mesAnoAtual = monName[now.getMonth()];

    const toggleDrawer = () => {
      setDrawer(!drawer);
    };
    
    const onItemClick = (title:any) => () => {
      setTitle(title);
      setDrawer(variant === 'temporary' ? false : drawer);
      setDrawer(!drawer);
    };
 
    useEffect(() => {
        if(IsAuthenticated().session!== null){
          dispatch(setSession(IsAuthenticated().session));
       
        }
       
     
    },[dispatch])

   
   
    return (
      <div  className={classes.root}>
        <MyToolbar 
          title='' 
          onMenuClick={toggleDrawer} 
          strNomeUsuario={session.user.nome}
          objData={data} />
        <MyDrawer
          open={drawer}
          onClose={toggleDrawer}
          onItemClick={onItemClick}
          variant={variant}
        />
      </div>
    );


}

const styles = ({
    toolbar : {
        display: 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between',
        background: '#1C4363',
        minHeight: '15px',
        height: '45px',
    }
});

export default withStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      paddindg: 0
    },
  })(AllRoutes);
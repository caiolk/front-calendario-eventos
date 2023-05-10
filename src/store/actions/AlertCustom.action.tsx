export function getAlertCustom(){
    return {
        type: 'GET_ALERT_CUSTOM'
    }
}

export function setAlertCustom( state:any){
    return{
        type: 'SET_ALERT_CUSTOM',
        payload: state
    }
}
export function getTipoCorridas(){
    return {
        type: 'GET_TIPO_CORRIDAS'
    }
}

export function setTipoCorridas(state:any){
    return{
        type: 'SET_TIPO_CORRIDAS',
        payload: state
    }
}
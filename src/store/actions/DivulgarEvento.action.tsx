export function getDivulgarEvento(){
    return {
        type: 'GET_DIVULGAR_EVENTO'
    }
}

export function setDivulgarEvento(state:any){
    return{
        type: 'SET_DIVULGAR_EVENTO',
        payload: state
    }
}
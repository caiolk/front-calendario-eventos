export function getEstados(){
    return {
        type: 'GET_ESTADOS'
    }
}

export function setEstados(state:any){
    return{
        type: 'SET_ESTADOS',
        payload: state
    }
}
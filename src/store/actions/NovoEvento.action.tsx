export function getNovoEvento(){
    return {
        type: 'GET_NOVO_EVENTO'
    }
}

export function setNovoEvento(state:any){
    return{
        type: 'SET_NOVO_EVENTO',
        payload: state
    }
}
export function getStatus(){
    return {
        type: 'GET_STATUS'
    }
}

export function setStatus(state:any){
    return{
        type: 'SET_STATUS',
        payload: state
    }
}
export function getSession(){
    return {
        type: 'GET_SESSION'
    }
}

export function setSession(state:any){
    return{
        type: 'SET_SESSION',
        payload: state
    }
}
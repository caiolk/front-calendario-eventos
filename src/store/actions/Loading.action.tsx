export function getLoading(){
    return {
        type: 'GET_LOADING'
    }
    
}

export function setLoading( state:any){
    return{
        type: 'SET_LOADING',
        payload: state
    }

}
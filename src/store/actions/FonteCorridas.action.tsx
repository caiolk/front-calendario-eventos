export function getFonteCorridas(){
    return {
        type: 'GET_FONTE_CORRIDAS'
    }
}

export function setFonteCorridas(state:any){
    return{
        type: 'SET_FONTE_CORRIDAS',
        payload: state
    }
}
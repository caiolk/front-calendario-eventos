const INITIAL_STATE = {  strMensagem:'', openAlert: false, strType:'' };

export default function alertCustom (state:any = INITIAL_STATE, action: any){

    switch (action.type) {
        case 'SET_ALERT_CUSTOM':
            return action.payload
        case 'GET_ALERT_CUSTOM':
            return state
        default:
            return state;
    }

}
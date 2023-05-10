const INITIAL_STATE = false

export default function loading (state : any = INITIAL_STATE, action: any){

    switch (action.type) {
        case 'SET_ALERT_CUSTOM':
            return action.payload
        case 'GET_ALERT_CUSTOM':
            return state
        default:
            return state;
    }

}
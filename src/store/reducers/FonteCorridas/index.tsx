const INITIAL_STATE = [{}];

export default function fonteCorridas (state:any = INITIAL_STATE, action: any){

    switch (action.type) {
        case 'SET_FONTE_CORRIDAS':
            return action.payload
        case 'GET_FONTE_CORRIDAS':
            return state
        default:
            return state;
    }

}
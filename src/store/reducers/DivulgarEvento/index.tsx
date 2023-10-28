const INITIAL_STATE = { uuidEvento: null, statusDivulgar: false };

export default function divulgarEvento(state:any = INITIAL_STATE, action: any){

    switch (action.type) {
        case 'SET_DIVULGAR_EVENTO':
            return action.payload
        case 'GET_DIVULGAR_EVENTO':
            return state
        default:
            return state;
    }

}
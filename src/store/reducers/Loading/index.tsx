const INITIAL_STATE = false

export default function loading (state : any = INITIAL_STATE, action: any){

    switch (action.type) {
        case 'SET_LOADING':
            return action.payload
        case 'GET_LOADING':
            return state
        default:
            return state;
    }

}
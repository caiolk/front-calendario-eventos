const INITIAL_STATE = [{}];

export default function estados (state:any = INITIAL_STATE, action: any){

    switch (action.type) {
        case 'SET_ESTADOS':
            return action.payload
        case 'GET_ESTADOS':
            return state
        default:
            return state;
    }

}
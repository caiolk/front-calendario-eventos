const INITIAL_STATE = [{}];

export default function status (state:any = INITIAL_STATE, action: any){

    switch (action.type) {
        case 'SET_STATUS':
            return action.payload
        case 'GET_STATUS':
            return state
        default:
            return state;
    }

}
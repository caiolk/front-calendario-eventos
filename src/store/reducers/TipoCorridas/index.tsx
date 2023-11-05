const INITIAL_STATE = [{}];

export default function tipoCorridas (state:any = INITIAL_STATE, action: any){

    switch (action.type) {
        case 'SET_TIPO_CORRIDAS':
            return action.payload
        case 'GET_TIPO_CORRIDAS':
            return state
        default:
            return state;
    }

}
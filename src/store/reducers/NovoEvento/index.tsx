const INITIAL_STATE = { evento: { novo : false } };

export default function novoEvento (state:any = INITIAL_STATE, action: any){

    switch (action.type) {
        case 'SET_NOVO_EVENTO':
            return action.payload
        case 'GET_NOVO_EVENTO':
            return state
        default:
            return state;
    }

}
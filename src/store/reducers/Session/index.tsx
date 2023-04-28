const INITIAL_STATE = {
    user: {
        id: null,
        nome: null,
        email: null,
        blAdmin: null,
    },
    access_token : {}
}

export default function session (state : any = INITIAL_STATE, action: any){

    switch (action.type) {
        case 'SET_SESSION':
            return action.payload
        case 'GET_SESSION':
            return state
        default:
            return state;
    }

}

export const IsAuthenticated = () =>  {
    const session = ( localStorage.getItem('_data') !== null 
        ? 
        (typeof localStorage.getItem('_data') === 'string' 
        &&  localStorage.getItem('_data')  !== null ? JSON.parse(String(localStorage.getItem('_data'))) : '' )
        :
            {}
    )
   
    if(session!==null && session.user !==null && session.user !== undefined){

        return {
            auth: true,
            session: session
        };

    }

    return {
        auth: false,
        session: null
    };
}
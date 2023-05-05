export default interface ISessaoParametros{
    session:{
        user:{
            id:number,
            nome:string,
            email:string,
            blAdmin:number
        },
        access_token:{
            access_token: string,
            expires_in: string,
            token_type: string
        }
    }
}
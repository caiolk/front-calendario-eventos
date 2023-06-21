export default interface IEventoDetalhesParam{
    uuid?: string,
    evento_titulo?: string,
    cidade?: string,
    uf?: string,
    organizador_uuid?: string,
    url_pagina?: string,
    evento_data_realizacao?: string,
    status_string?: string,
    inscricao_aberta?: number,
    ativo?: number,
    created_at?: string,
    organizador?: {
        uuid: string,
        nome_fantasia: string,
        site: string
    },
    categoria?: [],
    fonte_uuid?: string,
    fonte?:{
        uuid: string,
        nome: string
    },
    tipo_evento_uuid?: string,
    tipo?:{
        uuid: string,
        nome: string
    }

}
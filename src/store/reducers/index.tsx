import { combineReducers } from 'redux';

import session from './Session';
import loading from './Loading';
import alertCustom from './AlertCustom';
import tipoCorridas from './TipoCorridas';
import fonteCorridas from './FonteCorridas';
import estados from './Estados';
import status from './Status';
import divulgarEvento from './DivulgarEvento';
import novoEvento from './NovoEvento';

export default combineReducers({
    session,
    loading,
    alertCustom,
    tipoCorridas,
    fonteCorridas,
    estados,
    status,
    divulgarEvento,
    novoEvento
})
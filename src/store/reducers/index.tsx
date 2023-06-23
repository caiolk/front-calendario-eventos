import { combineReducers } from 'redux';

import session from './Session';
import loading from './Loading';
import alertCustom from './AlertCustom';
import tipoCorridas from './TipoCorridas';

export default combineReducers({
    session,
    loading,
    alertCustom,
    tipoCorridas
})
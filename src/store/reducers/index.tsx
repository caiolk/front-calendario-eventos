import { combineReducers } from 'redux';

import session from './Session';
import loading from './Loading';
import alertCustom from './AlertCustom';

export default combineReducers({
    session,
    loading,
    alertCustom
})
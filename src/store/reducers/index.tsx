import { combineReducers } from 'redux';

import session from './Session';
import loading from './Loading';
import alert from './AlertCustom';

export default combineReducers({
    session,
    loading,
    alert
})
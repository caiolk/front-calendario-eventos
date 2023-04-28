import { combineReducers } from 'redux';

import session from './Session';
import loading from './Loading';

export default combineReducers({
    session,
    loading
})
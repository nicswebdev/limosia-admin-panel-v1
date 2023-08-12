import { useContext } from 'react';

import { AuthContext } from '../AuthContext';
import { AuthContextValue } from '../types';

export const useAuthContext = (): AuthContextValue => useContext(AuthContext);

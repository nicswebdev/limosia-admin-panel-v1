import { useState } from 'react';
import { useSelector } from 'react-redux';

import { IRootState } from '@/store';

export const useLoginAuth = () => {
    const user = useSelector((state: IRootState) => state.auth);

    const [emailField, setEmailField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    return {
        user,
        emailField,
        passwordField,

        setEmailField,
        setPasswordField,
    };
};

import { FC, createContext, ReactNode, useState, useEffect } from 'react';

import { AuthContextValue } from './types';
import { User } from '@/src/types/entities';
import { httpClient } from '@/src/shared/utils';
import { useDispatch } from 'react-redux';
import { setError, setUser as setUserSlice } from '@/store/authSlice';
import { useRouter } from 'next/router';
import { authConfig } from '@/src/shared/config';

type Props = {
    children: ReactNode;
};

const INITIAL_VALUE: AuthContextValue = {
    user: null,
    loading: true,

    setUser: () => undefined,
    setLoading: () => undefined,
};

// ** Create Context
export const AuthContext = createContext<AuthContextValue>(INITIAL_VALUE);

// ** Provider Component
export const AuthProvider: FC<Props> = ({ children }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [user, setUser] = useState<User | null>(INITIAL_VALUE.user);
    const [loading, setLoading] = useState(INITIAL_VALUE.loading);

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            const storedToken = window.localStorage.getItem(authConfig.storageTokenName);

            if (!storedToken) {
                window.localStorage.removeItem(authConfig.storageUserData);
                window.localStorage.removeItem(authConfig.storageTokenName);

                setUser(null);
                setLoading(false);

                return;
            }

            try {
                const response = await httpClient.get('users/me', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
                const userData = { ...response.data };

                setUser(userData);
                dispatch(setUserSlice(userData));
                window.localStorage.setItem(authConfig.storageUserData, JSON.stringify(userData));
            } catch (error) {
                localStorage.removeItem(authConfig.storageUserData);
                localStorage.removeItem(authConfig.storageTokenName);

                setUser(null);

                router.replace('/');
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const value: AuthContextValue = {
        user,
        loading,

        setUser,
        setLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { FC, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAuthContext } from '@/contexts/AuthContext/hooks';
import { IRootState } from '@/store';
import { useSelector } from 'react-redux';

type Props = {
    children: ReactNode;
};

export const AuthGuard: FC<Props> = (props) => {
    const { children } = props;
    const { user } = useSelector((state: IRootState) => state.auth);
    const router = useRouter();
    const auth = useAuthContext();

    useEffect(() => {
        if (!router.isReady) return;

        if (user === null || (user !== null && user.user_role.role.name !== 'admin')) {
            if (router.asPath !== '/' && router.asPath !== '/logout') {
                router.replace({
                    pathname: '/',
                    query: { returnUrl: router.asPath },
                });
            } else {
                router.replace('/');
            }
        }
    }, [auth, router, user]);

    // if guard success, then next()
    return <>{children}</>;
};

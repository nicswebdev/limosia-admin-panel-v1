import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';

import { AppDispatch } from '@/store';
import { doLogout } from '@/store/userSlice';
import { useAuthContext } from '@/contexts/AuthContext/hooks';

const LogoutPage = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { setLoading } = useAuthContext();

    useEffect(() => {
        setLoading(true);

        dispatch(doLogout());
        router.replace('/');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <></>;
};

LogoutPage.authGuard = false;
LogoutPage.guestGuard = true;

export default LogoutPage;

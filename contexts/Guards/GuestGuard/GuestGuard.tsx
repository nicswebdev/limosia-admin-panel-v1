import { FC, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authConfig } from '@/src/shared/config';

type Props = {
    children: ReactNode;
};

export const GuestGuard: FC<Props> = (props) => {
    const { children } = props;
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        if (window.localStorage.getItem(authConfig.storageUserData)) {
            router.replace('/admin/dashboard');
        }
    }, [router]);

    return <>{children}</>;
};

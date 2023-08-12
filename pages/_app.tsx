import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import Head from 'next/head';

import { Provider } from 'react-redux';
import { appWithI18Next } from 'ni18n';
import { ni18nConfig } from 'ni18n.config.ts';
import { PersistGate } from 'redux-persist/integration/react';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';

import { persistor, store, wrapper } from '../store/index';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { AuthProvider } from '@/contexts';
import { AuthGuard, GuestGuard } from '@/contexts/Guards';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type ExtendedAppProps = AppProps & {
    Component: NextPage;
};

// type AppPropsWithLayout = AppProps & {
//     Component: NextPageWithLayout;
// };

const Guard = ({ children, authGuard, guestGuard }: any) => {
    if (guestGuard) {
        return <GuestGuard>{children}</GuestGuard>;
    } else if (!guestGuard && !authGuard) {
        return <>{children}</>;
    } else {
        return <AuthGuard>{children}</AuthGuard>;
    }
};

const App = ({ Component, pageProps }: ExtendedAppProps) => {
    // Variables
    const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);
    const authGuard = Component.authGuard ?? true;
    const guestGuard = Component.guestGuard ?? false;

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Head>
                    <title>Limosia - At your Service</title>
                    <meta charSet="UTF-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="description" content="Limosia Admin Panel" />
                    <link rel="icon" href="/assets/images/logo/limosia-logo.png" />
                </Head>

                <Guard authGuard={authGuard} guestGuard={guestGuard}>
                    <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
                </Guard>
            </PersistGate>
        </Provider>
    );
};

export default appWithI18Next(wrapper.withRedux(App), ni18nConfig);

import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactElement, ReactNode, useEffect } from 'react';
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

    useEffect(() => {
        console.log('runsss');
        const loadScript = (src: string) => {
            const existingScript = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
            if (existingScript) {
                return;
            }
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.async = true;
            document.body.appendChild(script);
        };

        (window as any).googleMapsScriptLoaded = () => {
            if ((window as any).initAutocomplete) {
                (window as any).initAutocomplete();
            }
            if ((window as any).initMap) {
                (window as any).initMap();
            }
        };

        loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDv7zbUva4oy7ni_A7sKFYTpuE7yBhlz1E&libraries=places&callback=googleMapsScriptLoaded');
    }, []);

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Head>
                    <title>Quicco - At your Service</title>
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

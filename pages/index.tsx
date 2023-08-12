import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import BlankLayout from '@/components/Layouts/BlankLayout';
import { useLoginAuth } from '@/components/Pages/Login';
import { doUserLogin } from '@/store/userSlice';
import { useAuthContext } from '@/contexts/AuthContext/hooks';
import { setPageTitle } from '@/store/themeConfigSlice';
import { NextPage } from 'next';
import { AppDispatch, IRootState } from '@/store';

type Props = {};
type LoginForm = {
    email: string;
    password: string;
};

const defaultValues: LoginForm = {
    email: '',
    password: '',
};

const schema = yup.object().shape({
    email: yup.string().required('Email is required.').email('Must be a valid email.'),
    password: yup.string().required('Password is required.').min(8, 'Password must be at least 8 characters.'),
});

const LoginCover: NextPage<Props> = (props) => {
    const {} = props;
    const { error } = useSelector((state: IRootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const { emailField, passwordField, setEmailField, setPasswordField } = useLoginAuth();
    const authContext = useAuthContext();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid, isSubmitting },
    } = useForm<LoginForm>({
        defaultValues,
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const registerEmail = register('email', { required: true });
    const registerPassword = register('password', { required: true });

    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        setIsDisabled(!isDirty || !isValid || isSubmitting);
    }, [isDirty, isSubmitting, isValid]);

    useEffect(() => {
        dispatch(setPageTitle('Login - Welcome to Limosia Dashboard'));
    }, [dispatch]);

    const submitForm = async (e: any) => {
        e.preventDefault();

        const data = {
            email: emailField,
            password: passwordField,
        };

        try {
            const response = await dispatch(doUserLogin(data)).unwrap();
            const { user } = response;

            authContext.setUser(user);

            const returnUrl = router.query.returnUrl as string;
            const redirectURL = returnUrl && returnUrl !== '/admin/dashboard' ? returnUrl : '/admin/dashboard';

            router.replace(redirectURL);

            // router.push(redirectURL);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="hidden min-h-screen w-1/2 flex-col  items-center justify-center bg-gradient-to-t from-[#ff1361bf] to-[#44107A] p-4 text-white dark:text-black lg:flex">
                <div className="mx-auto mb-5 w-full">
                    <Image alt="login icon" src="/assets/images/auth-cover.svg" width={0} height={0} className="mx-auto h-full w-full lg:max-w-[370px] xl:max-w-[500px]" />
                </div>
            </div>
            <div className="relative flex w-full items-center justify-center lg:w-1/2">
                <div className="w-full max-w-[480px] p-5 md:p-10">
                    <h2 className="mb-3 text-3xl font-bold">Sign In</h2>
                    <p className="mb-7">Enter your email and password to login</p>
                    <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                {...registerEmail}
                                id="email"
                                type="email"
                                className="form-input"
                                placeholder="Enter Email"
                                value={emailField}
                                onChange={(e) => {
                                    registerEmail.onChange(e);
                                    setEmailField(e.target.value);
                                }}
                            />
                            <p className="mt-1 min-h-[16px] text-xs text-red-400" role="alert">
                                {errors.email && errors.email?.message}
                            </p>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                {...registerPassword}
                                id="password"
                                type="password"
                                className="form-input"
                                placeholder="Enter Password"
                                value={passwordField}
                                onChange={(e) => {
                                    registerPassword.onChange(e);
                                    setPasswordField(e.target.value);
                                }}
                            />
                            <p className="mt-1 min-h-[16px] text-xs text-red-400" role="alert">
                                {errors.password && errors.password?.message}
                            </p>
                        </div>
                        <div>
                            <label className="cursor-pointer">
                                <input type="checkbox" className="form-checkbox" />
                                <span className="text-white-dark">Remember me</span>
                            </label>
                        </div>
                        {error && (
                            <p className="mt-1 min-h-[16px] text-xs text-red-400" role="alert">
                                {error.message}
                            </p>
                        )}
                        <button type="submit" className="btn btn-primary w-full" onClick={submitForm} disabled={isDisabled}>
                            SIGN IN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
LoginCover.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
LoginCover.guestGuard = true;
export default LoginCover;

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { setPageTitle } from '@/store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import { addAirportSchema, initialValues } from '@/src/shared/const/Airport.const';
import { AirportType } from '@/src/types/Airport.type';
import InputErrorMessage from '@/components/InputErrorMessage';
import { useRouter } from 'next/navigation';
import { authConfig } from '@/src/shared/config';

export default function CreateAirport() {
    const dispatch = useDispatch();
    const MySwal = withReactContent(Swal);
    const router = useRouter();

    const SubmitForm = async (values: AirportType) => {
        const token = localStorage.getItem(authConfig.storageTokenName);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}airports`, values, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                MySwal.fire({
                    title: 'Airport Added.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-success`,
                    },
                });

                router.push('/admin/airport');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Create Airport Data'));
    });

    return (
        <>
            <div>
                <Breadcrumb />

                <div className="min-h-screen pt-5">
                    <div className="panel h-full">
                        <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <h5 className="text-lg font-semibold dark:text-white-light">Create Airport Data</h5>
                            <Link href="/admin/airport" className="btn btn-primary gap-2">
                                Go Back
                            </Link>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-black">
                            <Formik initialValues={initialValues} validationSchema={addAirportSchema} onSubmit={SubmitForm}>
                                <Form className="space-y-5">
                                    <div>
                                        <label htmlFor="name">Airport Name</label>
                                        <Field id="name" className="form-input" name="name" />
                                        <ErrorMessage name="name" render={(msg) => <InputErrorMessage message={msg} />} />
                                    </div>
                                    <div>
                                        <label htmlFor="latitude">Latitude</label>
                                        <Field id="latitude" className="form-input" name="latitude" />
                                        <ErrorMessage name="latitude" render={(msg) => <InputErrorMessage message={msg} />} />
                                    </div>
                                    <div>
                                        <label htmlFor="longitude">Longitude</label>
                                        <Field id="longitude" className="form-input" name="longitude" />
                                        <ErrorMessage name="longitude" render={(msg) => <InputErrorMessage message={msg} />} />
                                    </div>
                                    <div>
                                        <button type="submit" className="btn btn-primary !mt-6">
                                            Submit
                                        </button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

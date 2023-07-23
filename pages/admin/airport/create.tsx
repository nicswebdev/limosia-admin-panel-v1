import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';

export default function CreateAirport() {
    const dispatch = useDispatch();

    const initialValues = {
        name: '',
        latitude: '',
        longitude: '',
    };

    const SubmitForm = async (values: {}) => {
        console.log(values);
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
                        <div className="mb-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Create Airport Data</h5>
                            <Link href="/admin/airport" className="btn btn-primary gap-2">
                                Go Back
                            </Link>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-black">
                            <Formik initialValues={initialValues} onSubmit={SubmitForm}>
                                <Form className="space-y-5">
                                    <div>
                                        <label htmlFor="name">Airport Name</label>
                                        <Field id="name" className="form-input" name="name" />
                                    </div>
                                    <div>
                                        <label htmlFor="latitude">Latitude</label>
                                        <Field id="latitude" className="form-input" name="latitude" />
                                    </div>
                                    <div>
                                        <label htmlFor="longitude">Longitude</label>
                                        <Field id="longitude" className="form-input" name="longitude" />
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

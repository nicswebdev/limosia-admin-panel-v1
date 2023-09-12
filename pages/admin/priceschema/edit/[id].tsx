/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useId, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { setPageTitle } from '@/store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import InputErrorMessage from '@/components/InputErrorMessage';
import { useRouter } from 'next/router';
import { optionType, PriceSchemaType } from '@/src/types/PriceSchema.type';
import { addPriceSchemaValidation, initialValues as blankValues } from '@/src/shared/const/PriceSchema.const';
import Select from 'react-select';
import { NumericFormat } from 'react-number-format';
import { authConfig } from '@/src/shared/config';

export default function UpdatePriceSchema() {
    const dispatch = useDispatch();
    const MySwal = withReactContent(Swal);
    const router = useRouter();

    const [initialValues, setInitialValues] = useState(blankValues);
    const [airports, setAirports] = useState<optionType[]>([]);
    const [carClasses, setCarClasses] = useState<optionType[]>([]);

    const SubmitForm = async (values: PriceSchemaType) => {
        const token = localStorage.getItem(authConfig.storageTokenName);
        const price = values.base_price.toString();

        let data = {
            ...values,
            base_price: Number(price.replace(/[$,.]/g, '')),
        };

        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}price-schema/${router.query.id}`, data, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                MySwal.fire({
                    title: 'Price Schema Updated.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-success`,
                    },
                });

                router.push('/admin/priceschema');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                MySwal.fire({
                    title: error.response?.data.message,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-danger`,
                    },
                });
            }
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Update Price Schema Data'));
    });

    useEffect(() => {
        let source = axios.CancelToken.source();

        const fetchData = async () => {
            try {
                const airportsURL = `${process.env.NEXT_PUBLIC_API_URL}airports?page=1&limit=100&sortBy=ASC`;
                const carClassURL = `${process.env.NEXT_PUBLIC_API_URL}car-class?page=1&limit=100&sortBy=ASC`;
                const priceSchemaURL = `${process.env.NEXT_PUBLIC_API_URL}price-schema/${router.query.id}`;

                const [priceSchema, airports, carClasses] = await Promise.allSettled([
                    axios.get(priceSchemaURL, {
                        cancelToken: source.token,
                    }),
                    axios.get(airportsURL, {
                        cancelToken: source.token,
                    }),
                    axios.get(carClassURL, {
                        cancelToken: source.token,
                    }),
                ]);

                if (priceSchema.status === 'fulfilled' && airports.status === 'fulfilled' && carClasses.status === 'fulfilled') {
                    setInitialValues({
                        ...initialValues,
                        tier_name: priceSchema.value.data.tier_name,
                        airport_id: priceSchema.value.data.airport.id,
                        car_class_id: priceSchema.value.data.car_class.id,
                        base_price: priceSchema.value.data.base_price,
                        from_range_km: priceSchema.value.data.from_range_km,
                        to_range_km:priceSchema.value.data.to_range_km
                    });
                    setAirports(
                        airports.value.data.items.map((airport: any) => ({
                            label: airport.name,
                            value: airport.id,
                        }))
                    );

                    setCarClasses(
                        carClasses.value.data.items.map((carClass: any) => ({
                            label: carClass.name,
                            value: carClass.id,
                        }))
                    );
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (router.query.id) {
            fetchData();
        }

        return () => {
            source.cancel();
        };
    }, [router]);

    return (
        <>
            <div>
                <Breadcrumb />

                <div className="min-h-screen pt-5">
                    <div className="panel h-full">
                        <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <h5 className="text-lg font-semibold dark:text-white-light">Edit Price Schema</h5>
                            <Link href="/admin/priceschema" className="btn btn-primary gap-2">
                                Go Back
                            </Link>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-black">
                            <Formik initialValues={initialValues} validationSchema={addPriceSchemaValidation} onSubmit={SubmitForm} enableReinitialize>
                                {({ values }) => (
                                    <Form className="space-y-5">
                                        <div>
                                            <label htmlFor="tier_name">Tier Name</label>
                                            <Field id="tier_name" className="form-input" name="tier_name" />
                                            <ErrorMessage name="tier_name" render={(msg) => <InputErrorMessage message={msg} />} />
                                        </div>
                                        <div>
                                            <label htmlFor="airport">Airport</label>
                                            <Field name="airport_id">
                                                {({ form }: any) => {
                                                    const { setFieldValue } = form;

                                                    const defaultValue = airports.find((airport) => Number(airport.value) === values.airport_id);

                                                    if (defaultValue) {
                                                        return (
                                                            <Select
                                                                placeholder="Select Airport"
                                                                options={airports}
                                                                onChange={(e) => setFieldValue('airport_id', e?.value)}
                                                                id="airport"
                                                                defaultValue={defaultValue}
                                                            />
                                                        );
                                                    }
                                                }}
                                            </Field>
                                            <ErrorMessage name="airport_id" render={(msg) => <InputErrorMessage message={msg} />} />
                                        </div>
                                        <div>
                                            <label htmlFor="carclass">Car Class</label>
                                            <Field name="car_class_id">
                                                {({ form }: any) => {
                                                    const { setFieldValue } = form;

                                                    const defaultValue = carClasses.find((car) => Number(car.value) === values.car_class_id);

                                                    if (defaultValue) {
                                                        return (
                                                            <Select
                                                                name="car_class_id"
                                                                placeholder="Select Car Class"
                                                                options={carClasses}
                                                                onChange={(e) => setFieldValue('car_class_id', e?.value)}
                                                                id="carclass"
                                                                defaultValue={defaultValue}
                                                            />
                                                        );
                                                    }
                                                }}
                                            </Field>
                                            <ErrorMessage name="car_class_id" render={(msg) => <InputErrorMessage message={msg} />} />
                                        </div>
                                        <div>
                                            <label htmlFor="from_range_km">From Range KM</label>
                                            <Field id="from_range_km" className="form-input" name="from_range_km" type="number" />
                                            <ErrorMessage name="from_range_km" render={(msg) => <InputErrorMessage message={msg} />} />
                                        </div>
                                        <div>
                                            <label htmlFor="to_range_km">to Range KM</label>
                                            <Field id="to_range_km" className="form-input" name="to_range_km" type="number" />
                                            <ErrorMessage name="to_range_km" render={(msg) => <InputErrorMessage message={msg} />} />
                                        </div>
                                        <div>
                                            <label htmlFor="base_price">Base Price</label>
                                            <Field name="base_price">
                                                {({ form }: any) => {
                                                    const { setFieldValue } = form;

                                                    return (
                                                        <NumericFormat
                                                            onChange={(e) => setFieldValue('base_price', e.target.value)}
                                                            className="form-input"
                                                            thousandSeparator
                                                            value={values.base_price}
                                                        />
                                                    );
                                                }}
                                            </Field>
                                            <ErrorMessage name="base_price" render={(msg) => <InputErrorMessage message={msg} />} />
                                        </div>
                                        <div>
                                            <button type="submit" className="btn btn-primary !mt-6">
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

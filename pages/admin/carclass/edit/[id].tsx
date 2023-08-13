/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import axios from 'axios';
import { CarClassType } from '@/src/types/CarClass.type';
import InputErrorMessage from '@/components/InputErrorMessage';
import { initialValues as blankValues, addCarClassSchema } from '@/src/shared/const/CarClass.const';
import { authConfig } from '@/src/shared/config';

export default function UpdateCarClass() {
    const dispatch = useDispatch();
    const router = useRouter();
    const MySwal = withReactContent(Swal);

    const [images, setImages] = useState<any>([]);
    const [initialValues, setInitialValues] = useState(blankValues);
    const maxNumber = 69;

    const SubmitForm = async (values: CarClassType) => {
        const token = localStorage.getItem(authConfig.storageTokenName);

        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}car-class/${router.query.id}`, values, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                MySwal.fire({
                    title: 'Car Class Updated.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-success`,
                    },
                });

                router.push('/admin/carclass');
            }
        } catch (error) {
            console.log(error);

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

    const onImageChange = (imageList: ImageListType) => {
        setImages(imageList as never[]);
    };

    useEffect(() => {
        dispatch(setPageTitle('Create Airport Data'));
    });

    useEffect(() => {
        let source = axios.CancelToken.source();

        const fetchCarClassDetail = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL}car-class/${router.query.id}`;

                const response = await axios.get(url, {
                    cancelToken: source.token,
                });

                setInitialValues(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        if (router.query.id) {
            fetchCarClassDetail();
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
                            <h5 className="text-lg font-semibold dark:text-white-light">Create Car Class Data</h5>
                            <Link href="/admin/carclass" className="btn btn-primary gap-2">
                                Go Back
                            </Link>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-black">
                            <Formik initialValues={initialValues} validationSchema={addCarClassSchema} onSubmit={SubmitForm} enableReinitialize>
                                {({ values }) => (
                                    <Form className="space-y-5" encType="multipart/form-data">
                                        <div>
                                            <label htmlFor="name">Car Class Name</label>
                                            <Field id="name" className="form-input" name="name" />
                                            <ErrorMessage name="name" render={(msg) => <InputErrorMessage message={msg} />} />
                                        </div>

                                        <div>
                                            <label htmlFor="description">Description</label>
                                            <Field name="description">
                                                {({ form }: any) => {
                                                    const { setFieldValue, values } = form;

                                                    return (
                                                        <textarea
                                                            id="description"
                                                            rows={3}
                                                            value={values.description}
                                                            className="form-textarea"
                                                            placeholder="Enter Description"
                                                            onChange={(event) => setFieldValue('description', event.target.value)}
                                                        ></textarea>
                                                    );
                                                }}
                                            </Field>
                                        </div>

                                        <div>
                                            <label htmlFor="maxGuest">Max Guesst</label>
                                            <Field id="maxGuest" className="form-input" name="max_guest" type="number" />
                                        </div>

                                        <div>
                                            <label htmlFor="maxSuitecase">Max Suitcase</label>
                                            <Field id="maxSuitecase" className="form-input" name="max_suitcase" type="number" />
                                        </div>

                                        {values.image.length !== 0 && values.image.length > 1 ? (
                                            <div>
                                                <label>Current Car Image</label>
                                                <img src={values.image as string} alt="previous_image" style={{ width: '200px', height: 'auto' }} />
                                            </div>
                                        ) : (
                                            ''
                                        )}

                                        <div className="custom-file-container" data-upload-id="myFirstImage">
                                            <div className="label-container">
                                                <label>Car Image </label>
                                                <button
                                                    type="button"
                                                    className="custom-file-container__image-clear"
                                                    title="Clear Image"
                                                    onClick={() => {
                                                        setImages([]);
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <label className="custom-file-container__custom-file"></label>
                                            <input type="file" className="custom-file-container__custom-file__custom-file-input" accept="image/*" />

                                            <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />

                                            <Field name="image">
                                                {({ form }: any) => {
                                                    const { setFieldValue } = form;

                                                    return (
                                                        <>
                                                            <ImageUploading
                                                                value={images}
                                                                onChange={(val) => {
                                                                    onImageChange(val);
                                                                    setFieldValue('image', val[0].file);
                                                                }}
                                                                maxNumber={maxNumber}
                                                            >
                                                                {({ imageList, onImageUpload }) => (
                                                                    <div className="upload__image-wrapper">
                                                                        <button type="button" className="custom-file-container__custom-file__custom-file-control" onClick={onImageUpload}>
                                                                            Choose File...
                                                                        </button>
                                                                        &nbsp;
                                                                        {imageList.map((image, index) => (
                                                                            <div key={index} className="custom-file-container__image-preview relative">
                                                                                <img src={image.dataURL} alt="img" className="m-auto" />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </ImageUploading>

                                                            {images.length === 0 ? <img src="/assets/images/file-preview.svg" className="m-auto w-full max-w-md" alt="" /> : ''}
                                                        </>
                                                    );
                                                }}
                                            </Field>

                                            <ErrorMessage name="image" render={(msg) => <InputErrorMessage message={msg} />} />
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

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import { setPageTitle } from '@/store/themeConfigSlice';

import dayjs from 'dayjs';
import Link from 'next/link';
import { AppDispatch, IRootState } from '@/store';
import { fetchSingleOrder } from '@/store/orderSlice';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function OrderDetail() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { order, meta } = useSelector((state: IRootState) => state.order);
    const MySwal = withReactContent(Swal);

    const id = router.query.id as string;

    const [data, setData] = useState<any>({});

    const dateFormatter = (date: string) => {
        const dateTime = new Date(date);

        const formattedDateTime = dateTime.toLocaleString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        });

        return formattedDateTime;
    };

    useEffect(() => {
        dispatch(setPageTitle('Update Airport Data'));

        if (!id) {
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await dispatch(fetchSingleOrder({ id })).unwrap();
            } catch (error: any) {
                console.log(error);

                MySwal.fire({
                    title: error.message!,
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
        };
        fetchOrders();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, id, router]);

    // useEffect(() => {
    //     const id = router.query.id;

    //     if (id) {
    //         const order = Orders.find((order) => order.id === id);
    //         console.log(order);
    //         setData({ ...order });
    //     }
    // }, [router]);

    return (
        <>
            <div>
                <Breadcrumb />

                <div className="min-h-screen pt-5">
                    <div className="my-2 w-full">
                        <Link className="btn btn-primary w-fit gap-2" href="/admin/orders">
                            Go Back
                        </Link>
                    </div>
                    <div className="mb-5 mt-0 flex flex-col gap-3 lg:mb-0 lg:mt-5 lg:flex-row">
                        <h2 className="my-2 break-words text-2xl font-bold">Order: #{order.order_no}</h2>
                        {order.payment_status.name === 'Completed' && <span className="badge badge-outline-success flex w-fit items-center">Completed</span>}
                    </div>
                    <div className="mb-5">
                        <span>
                            Order placed at: <strong>{dateFormatter(order.created_at)}</strong>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
                        <div className="panel h-full">
                            <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                                <h5 className="text-lg font-semibold dark:text-white-light">Customer</h5>
                            </div>
                            <div>
                                <div className="rounded-lg bg-white dark:bg-black">
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Full Name</span>
                                        <span>
                                            {order.f_name} {order.l_name}
                                        </span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Email</span>
                                        <span>{order.email}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Phone Number</span>
                                        <span>{order.phone}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Date of Birth</span>
                                        <span>{dayjs(new Date(order.dob)).format('D MMMM YYYY')}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Address</span>
                                        <span>{order.address}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">City</span>
                                        <span>{order.city}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">State</span>
                                        <span>{order.state}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Zip Code</span>
                                        <span>{order.zip_code}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel h-full">
                            <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                                <h5 className="text-lg font-semibold dark:text-white-light">Order Summary</h5>
                            </div>
                            <div>
                                <div className="rounded-lg bg-white dark:bg-black">
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Order No.</span>
                                        <span>{order.order_no}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Destination Point</span>
                                        <span>{order.destination_point}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Pickup Point</span>
                                        <span>{order.pickup_point}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Pickup Date</span>
                                        <span>{dayjs(new Date(order.pickup_date)).format('D MMMM YYYY')}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Pickup Time</span>
                                        <span>{order.pickup_time}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Flight Number</span>
                                        <span className="break-words">{order.flight_number}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Range</span>
                                        <span>{order.range}KM</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Total Guest(s)</span>
                                        <span>{order.total_guest} Person</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Total Suitcase(s)</span>
                                        <span>{order.total_suitcase} Suitcase(s)</span>
                                    </div>
                                    <hr className="my-6 border-[#e0e6ed] dark:border-[#1b2e4b]" />
                                    <div className="mb-2 flex w-full items-center justify-between gap-5 text-lg">
                                        <span className="text-white-dark">Total Price</span>
                                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.total_price)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

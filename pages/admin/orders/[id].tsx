import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import { setPageTitle } from '@/store/themeConfigSlice';
import Orders from '@/src/data/Orders.json';
import dayjs from 'dayjs';
import Link from 'next/link';

export default function OrderDetail() {
    const dispatch = useDispatch();
    const router = useRouter();

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
    });

    useEffect(() => {
        const id = router.query.id;

        if (id) {
            const order = Orders.find((order) => order.id === id);
            console.log(order);
            setData({ ...order });
        }
    }, [router]);

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
                        <h2 className="my-2 break-words text-2xl font-bold">Order: #{data?.id}</h2>
                        {data.payment_status === 'complete' && <span className="badge badge-outline-success flex w-fit items-center">Complete</span>}
                    </div>
                    <div className="mb-5">
                        <span>{dateFormatter(data.created_at)}</span>
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
                                            {data.f_name} {data.l_name}
                                        </span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Email</span>
                                        <span>{data.email}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Phone Number</span>
                                        <span>{data.phone}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Address</span>
                                        <span>{data.address}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">City</span>
                                        <span>{data.city}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">State</span>
                                        <span>{data.state}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Zip Code</span>
                                        <span>{data.zip_code}</span>
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
                                        <span className="text-white-dark">Pickup Point</span>
                                        <span>{data.pickup_point}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Pickup Date</span>
                                        <span>{dayjs(new Date(data.pickup_date)).format('D MMMM YYYY')}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Pickup Time</span>
                                        <span>{data.pickup_time}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Flight Number</span>
                                        <span className="break-words">{data.flight_number}</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Range</span>
                                        <span>{data.range}KM</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Total Guest(s)</span>
                                        <span>{data.total_guest} Person</span>
                                    </div>
                                    <div className="mb-2 flex w-full items-center justify-between gap-5">
                                        <span className="text-white-dark">Destination Point</span>
                                        <span>{data.destination_point}</span>
                                    </div>
                                    <hr className="my-6 border-[#e0e6ed] dark:border-[#1b2e4b]" />
                                    <div className="mb-2 flex w-full items-center justify-between gap-5 text-lg">
                                        <span className="text-white-dark">Total Price</span>
                                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.total_price)}</span>
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

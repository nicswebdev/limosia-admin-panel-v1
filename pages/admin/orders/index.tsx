import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import { DataTable } from 'mantine-datatable';
import { Group } from '@mantine/core';
import { EyeIcon } from '@/src/assets/icons/Eye.icon';
import Link from 'next/link';
import Orders from '@/src/data/Orders.json';
import { AppDispatch, IRootState } from '@/store';
import { fetchOrdersList } from '@/store/orderSlice';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Order } from '@/src/types/entities';
import { C } from '@fullcalendar/core/internal-common';

export default function OrderIndex() {
    const PAGE_SIZE = 10;

    const dispatch = useDispatch<AppDispatch>();
    const MySwal = withReactContent(Swal);
    const { orders, meta } = useSelector((state: IRootState) => state.order);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState<string | undefined>();
    const [records, setRecords] = useState(Orders.slice(0, PAGE_SIZE));

    useEffect(() => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        setRecords(Orders.slice(from, to));
    }, [page]);

    useEffect(() => {
        dispatch(setPageTitle('Orders Data'));

        const debounceTimeout = setTimeout(() => {
            const fetchOrders = async () => {
                const params = {
                    limit: PAGE_SIZE,
                    page,
                    sort: 'ASC',
                    search: search ? search : null,
                };

                try {
                    const response = await dispatch(fetchOrdersList(params)).unwrap();

                    console.log({ response });
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
        }, 300);

        return () => clearTimeout(debounceTimeout);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, page, search]);

    return (
        <>
            <div>
                <Breadcrumb />

                <div className="min-h-screen pt-5">
                    <div className="panel h-full">
                        <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <h5 className="text-lg font-semibold dark:text-white-light">Orders Data</h5>
                            <div className="ltr:ml-auto rtl:mr-auto">
                                <input type="text" className="form-input w-auto" placeholder="Search Order No..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <div className="rounded-lg bg-white dark:bg-black">
                                <DataTable
                                    columns={[
                                        { accessor: 'order_no', title: 'Order No' },
                                        { accessor: 'f_name', title: 'First Name' },
                                        { accessor: 'l_name', title: 'Last Name' },
                                        { accessor: 'email', title: 'Email' },
                                        {
                                            accessor: 'payment_status',
                                            title: 'Payment Status',
                                            render: ({ payment_status }: Order) => {
                                                switch (payment_status?.name) {
                                                    case 'Completed':
                                                        return <span className="badge bg-success">{payment_status.name}</span>;

                                                    case 'Pending':
                                                        return <span className="badge bg-pending">{payment_status.name}</span>;

                                                    case 'Refunded':
                                                        return <span className="badge bg-refunded">{payment_status.name}</span>;

                                                    case 'Denied':
                                                        return <span className="badge bg-failed">{payment_status.name}</span>;

                                                    default:
                                                        return <span className="badge bg-slate-600">{payment_status?.name ?? <i>[Status not set]</i>}</span>;
                                                }
                                            },
                                        },
                                        {
                                            accessor: 'order_status',
                                            title: 'Order Status',
                                            render: ({ order_status }: Order) => {
                                                switch (order_status?.name) {
                                                    case 'Completed':
                                                    case 'Payment Completed':
                                                        return <span className="badge bg-success">{order_status.name}</span>;

                                                    case 'Cancelled':
                                                        return <span className="badge bg-cancelled">{order_status.name}</span>;

                                                    case 'In Progress':
                                                    case 'Refunded':
                                                    case 'Payment Refunded':
                                                    case 'Booking Confirmed':
                                                        return <span className="badge bg-refunded">{order_status.name}</span>;

                                                    case 'Payment Pending':
                                                        return <span className="badge bg-pending">{order_status.name}</span>;

                                                    case 'Expired':
                                                    case 'Payment Denied':
                                                        return <span className="badge bg-failed">{order_status.name} Pending</span>;

                                                    default:
                                                        return <span className="badge bg-slate-600">{order_status?.name ?? <i>[Status not set]</i>}</span>;
                                                }
                                            },
                                        },
                                        {
                                            accessor: 'actions',
                                            title: 'Actions',
                                            textAlignment: 'right',
                                            render: ({ id }: any) => (
                                                <Group spacing={10} position="right" noWrap>
                                                    <Link href={`orders/${id}`} className="text-success">
                                                        <EyeIcon className=" aspect-square h-5" />
                                                    </Link>
                                                </Group>
                                            ),
                                        },
                                    ]}
                                    records={orders}
                                    totalRecords={meta.totalItems}
                                    recordsPerPage={PAGE_SIZE}
                                    page={page}
                                    onPageChange={(p) => setPage(p)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

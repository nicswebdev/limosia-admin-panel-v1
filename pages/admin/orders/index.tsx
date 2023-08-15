import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import { DataTable } from 'mantine-datatable';
import { ActionIcon, Group } from '@mantine/core';
import { PencilIcon } from '@/src/assets/icons/Pencil.icon';
import { EyeIcon } from '@/src/assets/icons/Eye.icon';
import TrashIcon from '@/src/assets/icons/Trash.icon';
import { PlusIcon } from '@/src/assets/icons/Plus.icon';
import Link from 'next/link';
import Orders from '@/src/data/Orders.json';

export default function OrderIndex() {
    const PAGE_SIZE = 10;

    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const [records, setRecords] = useState(Orders.slice(0, PAGE_SIZE));

    useEffect(() => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        setRecords(Orders.slice(from, to));
    }, [page]);

    useEffect(() => {
        dispatch(setPageTitle('Orders Data'));
    });

    return (
        <>
            <div>
                <Breadcrumb />

                <div className="min-h-screen pt-5">
                    <div className="panel h-full">
                        <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <h5 className="text-lg font-semibold dark:text-white-light">Orders Data</h5>
                        </div>
                        <div>
                            <div className="rounded-lg bg-white dark:bg-black">
                                <DataTable
                                    columns={[
                                        { accessor: 'f_name', title: 'First Name' },
                                        { accessor: 'l_name', title: 'Last Name' },
                                        { accessor: 'email', title: 'Email' },
                                        {
                                            accessor: 'payment_status',
                                            title: 'Payment Status',
                                            render: ({ payment_status }) => {
                                                switch (payment_status) {
                                                    case 'complete':
                                                        return <span className="badge bg-success">Complete</span>;
                                                        break;

                                                    case 'pending':
                                                        return <span className="badge bg-warning">Pending Payment</span>;
                                                        break;
                                                }
                                            },
                                        },
                                        {
                                            accessor: 'actions',
                                            title: 'Actions',
                                            textAlignment: 'right',
                                            render: () => (
                                                <Group spacing={10} position="right" noWrap>
                                                    <ActionIcon color="green">
                                                        <EyeIcon className="aspect-square h-5 text-ingfo" />
                                                    </ActionIcon>
                                                    <ActionIcon color="blue">
                                                        <PencilIcon className="aspect-square h-5 text-info" />
                                                    </ActionIcon>
                                                    <ActionIcon color="red">
                                                        <TrashIcon className="aspect-square h-5 text-danger" />
                                                    </ActionIcon>
                                                </Group>
                                            ),
                                        },
                                    ]}
                                    records={records}
                                    totalRecords={Orders.length}
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

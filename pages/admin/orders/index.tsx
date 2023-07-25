import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import { DataTable } from 'mantine-datatable';
import { ActionIcon, Group } from '@mantine/core';
import { PencilIcon } from '@/src/assets/icons/Pencil.icon';
import TrashIcon from '@/src/assets/icons/Trash.icon';
import { PlusIcon } from '@/src/assets/icons/Plus.icon';
import Link from 'next/link';

export default function OrderIndex() {
    const PAGE_SIZE = 10;

    const dispatch = useDispatch();

    // const [page, setPage] = useState(1);
    // const [records, setRecords] = useState(Airports.slice(0, PAGE_SIZE));

    // useEffect(() => {
    //     const from = (page - 1) * PAGE_SIZE;
    //     const to = from + PAGE_SIZE;
    //     setRecords(Airports.slice(from, to));
    // }, [page]);

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
                                {/* <DataTable
                                    columns={[
                                        { accessor: 'id' },
                                        { accessor: 'name', title: 'Airport Name' },
                                        { accessor: 'latitude' },
                                        { accessor: 'longitude' },
                                        {
                                            accessor: 'actions',
                                            title: 'Actions',
                                            textAlignment: 'right',
                                            render: () => (
                                                <Group spacing={10} position="right" noWrap>
                                                    <ActionIcon color="green">Info</ActionIcon>
                                                    <ActionIcon color="blue">
                                                        <PencilIcon className="h-5 aspect-square text-info" />
                                                    </ActionIcon>
                                                    <ActionIcon color="red">
                                                        <TrashIcon className="h-5 aspect-square text-danger" />
                                                    </ActionIcon>
                                                </Group>
                                            ),
                                        },
                                    ]}
                                    records={records}
                                    totalRecords={Airports.length}
                                    recordsPerPage={PAGE_SIZE}
                                    page={page}
                                    onPageChange={(p) => setPage(p)}
                                /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

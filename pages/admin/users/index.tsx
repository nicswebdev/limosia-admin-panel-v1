import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import { DataTable } from 'mantine-datatable';
import Users from '@/src/data/Users.json';
import { ActionIcon, Group } from '@mantine/core';
import { PencilIcon } from '@/src/assets/icons/Pencil.icon';
import TrashIcon from '@/src/assets/icons/Trash.icon';
import Link from 'next/link';
import { PlusIcon } from '@/src/assets/icons/Plus.icon';
import { fetchUsersList } from '@/store/userSlice';
import { AppDispatch, IRootState } from '@/store';

export default function UsersIndex() {
    const PAGE_SIZE = 5;

    const dispatch = useDispatch<AppDispatch>();
    const { users } = useSelector((state: IRootState) => state.user);

    const [page, setPage] = useState(1);
    const [records, setRecords] = useState(Users.slice(0, PAGE_SIZE));

    useEffect(() => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;

        setRecords(Users.slice(from, to));
    }, [page]);

    useEffect(() => {
        dispatch(setPageTitle('Users Data'));

        const fetchUsers = async () => {
            try {
                const response = await dispatch(fetchUsersList()).unwrap();
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, [dispatch]);

    return (
        <>
            <div>
                <Breadcrumb />

                <div className="min-h-screen pt-5">
                    <div className="panel h-full">
                        <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <h5 className="text-lg font-semibold dark:text-white-light">Users Data</h5>
                            <Link href="carclass" className="btn btn-primary gap-2">
                                <PlusIcon className="aspect-square h-5" />
                                Add New
                            </Link>
                        </div>
                        <div>
                            <div className="rounded-lg bg-white dark:bg-black">
                                <DataTable
                                    columns={[
                                        { accessor: 'id' },
                                        { accessor: 'f_name', title: 'First Name' },
                                        { accessor: 'l_name', title: 'Last Name' },
                                        { accessor: 'Email' },
                                        { accessor: 'user_role.role.name', title: 'Role' },
                                        { accessor: 'guest.phone', title: 'Phone' },
                                        { accessor: 'guest.dob', title: 'Date of Birth' },
                                        { accessor: 'guest.city', title: 'City' },
                                        { accessor: 'guest.state', title: 'State' },
                                        { accessor: 'guest.zip_code', title: 'Zip Code' },
                                        {
                                            accessor: 'created_at',
                                            render: () =>
                                                new Date().toLocaleString('en-US', {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    timeZoneName: 'short',
                                                    hour12: true,
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                }),
                                        },
                                        {
                                            accessor: 'updated_at',
                                            render: () =>
                                                new Date().toLocaleString('en-US', {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    timeZoneName: 'short',
                                                    hour12: true,
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                }),
                                        },
                                        {
                                            accessor: 'actions',
                                            title: 'Actions',
                                            textAlignment: 'right',
                                            render: () => (
                                                <Group spacing={10} position="right" noWrap>
                                                    <ActionIcon color="green">Info</ActionIcon>
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
                                    records={users}
                                    totalRecords={users.length}
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

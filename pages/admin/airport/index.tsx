import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import { DataTable } from 'mantine-datatable';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { ActionIcon, Group } from '@mantine/core';
import { PencilIcon } from '@/src/assets/icons/Pencil.icon';
import TrashIcon from '@/src/assets/icons/Trash.icon';
// import Airports from '@/src/data/Airports.json';
import { PlusIcon } from '@/src/assets/icons/Plus.icon';
import { CustomModal } from '@/components/CustomModal';
import { authConfig } from '@/src/shared/config';

export default function AirportIndex() {
    const PAGE_SIZE = 10;

    const dispatch = useDispatch();
    const router = useRouter();
    const MySwal = withReactContent(Swal);

    const [page, setPage] = useState(1);
    const [airports, setAirports] = useState({
        items: [],
        message: '',
        meta: {
            currentPage: 0,
            itemCount: 0,
            itemsPerPage: 0,
            totalItems: 0,
            totalPages: 0,
        },
        statusCode: 0,
    });
    const [records, setRecords] = useState(airports.items.slice(0, PAGE_SIZE));
    const [deleteModal, setDeleteModal] = useState(false);
    const [id, setID] = useState('');

    const deleteCarClass = async () => {
        const token = localStorage.getItem(authConfig.storageTokenName);

        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}airports/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            MySwal.fire({
                title: 'Data Deleted.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: {
                    popup: `color-danger`,
                },
            });

            router.reload();
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Airports Data'));
    });

    useEffect(() => {
        let source = axios.CancelToken.source();

        const fetchCarClasses = async () => {
            const from = (page - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE;

            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL}airports?page=1&limit=10&sortBy=ASC`;

                const response = await axios.get(url, {
                    cancelToken: source.token,
                });

                setAirports(response.data);
                setRecords(response.data.items.slice(from, to));
            } catch (error) {
                console.log(error);
            }
        };

        fetchCarClasses();

        return () => {
            source.cancel();
        };
    }, []);

    useEffect(() => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        setRecords(airports.items.slice(from, to));
    }, [page]);

    return (
        <>
            <div>
                <Breadcrumb />

                <div className="min-h-screen pt-5">
                    <div className="panel h-full">
                        <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <h5 className="text-lg font-semibold dark:text-white-light">Airport Data</h5>

                            <Link href="airport/create" className="btn btn-primary gap-2">
                                <PlusIcon className="aspect-square h-5" />
                                Add New
                            </Link>
                        </div>
                        <div>
                            <div className="rounded-lg bg-white dark:bg-black">
                                <DataTable
                                    columns={[
                                        { accessor: 'id' },
                                        { accessor: 'name', title: 'Airport Name' },
                                        { accessor: 'latitude' },
                                        { accessor: 'longitude' },
                                        {
                                            accessor: 'actions',
                                            title: 'Actions',
                                            textAlignment: 'right',
                                            render: (airport: any) => (
                                                <Group spacing={10} position="right" noWrap>
                                                    <Link href={`airport/edit/${airport.id}`}>
                                                        <PencilIcon className="aspect-square h-5 text-info" />
                                                    </Link>
                                                    <ActionIcon
                                                        color="red"
                                                        onClick={() => {
                                                            setDeleteModal(true);
                                                            setID(airport.id);
                                                        }}
                                                    >
                                                        <TrashIcon className="aspect-square h-5 text-danger" />
                                                    </ActionIcon>
                                                </Group>
                                            ),
                                        },
                                    ]}
                                    records={records}
                                    totalRecords={airports.meta?.totalItems}
                                    recordsPerPage={PAGE_SIZE}
                                    page={page}
                                    onPageChange={(p) => setPage(p)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CustomModal title="Are you sure?" modal={deleteModal} setModal={setDeleteModal} action={deleteCarClass}>
                Your action cannot be undone.
            </CustomModal>
        </>
    );
}

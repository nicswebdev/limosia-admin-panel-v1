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
import { PlusIcon } from '@/src/assets/icons/Plus.icon';
import { CustomModal } from '@/components/CustomModal';
import { authConfig } from '@/src/shared/config';

export default function PriceSchemaIndex() {
    const PAGE_SIZE = 10;

    const dispatch = useDispatch();
    const router = useRouter();
    const MySwal = withReactContent(Swal);

    const [page, setPage] = useState(1);
    const [priceSchemas, setPriceSchemas] = useState({
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

    const [records, setRecords] = useState(priceSchemas.items);
    const [deleteModal, setDeleteModal] = useState(false);
    const [id, setID] = useState('');

    const deletePriceSchema = async () => {
        const token = localStorage.getItem(authConfig.storageTokenName);

        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}price-schema/${id}`, {
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

            setDeleteModal(false);
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Price Schema Data'));
    });

    useEffect(() => {
        let source = axios.CancelToken.source();

        const fetchPriceSchemas = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL}price-schema?page=${page}&limit=${PAGE_SIZE}&sortBy=ASC`;

                const response = await axios.get(url, {
                    cancelToken: source.token,
                });

                setPriceSchemas(response.data);
                setRecords(response.data.items);
            } catch (error) {
                console.log(error);
            }
        };
        fetchPriceSchemas();

        return () => {
            source.cancel();
        };
    }, [page]);

    return (
        <>
            <div>
                <Breadcrumb />

                <div className="min-h-screen pt-5">
                    <div className="panel h-full">
                        <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <h5 className="text-lg font-semibold dark:text-white-light">Price Schema Data</h5>

                            <Link href="priceschema/create" className="btn btn-primary gap-2">
                                <PlusIcon className="aspect-square h-5" />
                                Add New
                            </Link>
                        </div>
                        <div>
                            <div className="rounded-lg bg-white dark:bg-black">
                                <DataTable
                                    columns={[
                                        { accessor: 'id' },
                                        { accessor: 'tier_name', title: 'Tier Name' },
                                        { accessor: 'car_class.name', title: 'Car Class Name' },
                                        { accessor: 'airport.name', title: 'Airport' },
                                        { accessor: 'range_km', title: 'Range (in KM)' },
                                        {
                                            accessor: 'base_price',
                                            title: 'Base Price',
                                            render: ({ base_price }) => <span>{new Intl.NumberFormat('en-US').format(base_price)}</span>,
                                        },
                                        {
                                            accessor: 'actions',
                                            title: 'Actions',
                                            textAlignment: 'right',
                                            render: (priceSchemas: any) => (
                                                <Group spacing={10} position="right" noWrap>
                                                    <Link href={`priceschema/edit/${priceSchemas.id}`}>
                                                        <PencilIcon className="aspect-square h-5 text-info" />
                                                    </Link>
                                                    <ActionIcon
                                                        color="red"
                                                        onClick={() => {
                                                            setDeleteModal(true);
                                                            setID(priceSchemas.id);
                                                        }}
                                                    >
                                                        <TrashIcon className="aspect-square h-5 text-danger" />
                                                    </ActionIcon>
                                                </Group>
                                            ),
                                        },
                                    ]}
                                    records={records}
                                    totalRecords={priceSchemas.meta?.totalItems}
                                    recordsPerPage={PAGE_SIZE}
                                    page={page}
                                    onPageChange={(p) => setPage(p)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CustomModal title="Are you sure?" modal={deleteModal} setModal={setDeleteModal} action={deletePriceSchema}>
                Your action cannot be undone.
            </CustomModal>
        </>
    );
}

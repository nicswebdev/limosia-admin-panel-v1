import { useEffect, useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import { DataTable } from 'mantine-datatable';
import Image from 'next/image';
import { ActionIcon, Group } from '@mantine/core';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import TrashIcon from '@/src/assets/icons/Trash.icon';
import { PencilIcon } from '@/src/assets/icons/Pencil.icon';
import { PlusIcon } from '@/src/assets/icons/Plus.icon';
import { CustomModal } from '@/components/CustomModal';

const CarClassIndex = () => {
    const PAGE_SIZE = 10;
    const BEHost = String(process.env.NEXT_PUBLIC_BACKEND_HOST);
    const dispatch = useDispatch();
    const router = useRouter();
    const MySwal = withReactContent(Swal);

    const [page, setPage] = useState(1);
    const [carClasses, setCarClasses] = useState({
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
    const [records, setRecords] = useState(carClasses.items.slice(0, PAGE_SIZE));
    const [deleteModal, setDeleteModal] = useState(false);
    const [id, setID] = useState('');

    const deleteCarClass = async () => {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}car-class/${id}`);

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
        dispatch(setPageTitle('Car Class Data'));
    });

    useEffect(() => {
        let source = axios.CancelToken.source();

        const fetchCarClasses = async () => {
            const from = (page - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE;

            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL}car-class?page=1&limit=10&sortBy=ASC`;

                const response = await axios.get(url, {
                    cancelToken: source.token,
                });

                setCarClasses(response.data);
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
        setRecords(carClasses.items.slice(from, to));
    }, [page]);

    return (
        <>
            <div>
                <Breadcrumb />

                <div className="min-h-screen pt-5">
                    <div className="panel h-full">
                        <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <h5 className="text-lg font-semibold dark:text-white-light">Car Classes Data</h5>
                            <Link href="carclass/create" className="btn btn-primary gap-2">
                                <PlusIcon className="aspect-square h-5" />
                                Add New
                            </Link>
                        </div>
                        <div>
                            <div className="rounded-lg bg-white dark:bg-black">
                                <DataTable
                                    columns={[
                                        { accessor: 'id' },
                                        { accessor: 'name', title: 'Name' },
                                        { accessor: 'description' },
                                        { accessor: 'max_guest', title: 'Max Guest' },
                                        { accessor: 'max_suitcase', title: 'Max Suitcase' },
                                        {
                                            accessor: 'image',
                                            title: 'Image',
                                            render: ({ image }: { image: string }) => {
                                                return <Image src={image} width={100} height={100} style={{ width: 'auto', height: 'auto' }} alt="" priority />;
                                            },
                                        },
                                        {
                                            accessor: 'actions',
                                            title: 'Actions',
                                            textAlignment: 'right',
                                            render: (car: any) => (
                                                <Group spacing={10} position="right" noWrap>
                                                    <Link href={`carclass/edit/${car.id}`}>
                                                        <PencilIcon className="aspect-square h-5 text-info" />
                                                    </Link>

                                                    <ActionIcon
                                                        color="red"
                                                        onClick={() => {
                                                            setDeleteModal(true);
                                                            setID(car.id);
                                                        }}
                                                    >
                                                        <TrashIcon className="aspect-square h-5 text-danger" />
                                                    </ActionIcon>
                                                </Group>
                                            ),
                                        },
                                    ]}
                                    records={records}
                                    totalRecords={carClasses.meta?.totalItems}
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
};

export default CarClassIndex;

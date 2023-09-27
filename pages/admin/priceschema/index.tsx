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

export default function PriceSchemaIndex({ airportData, carData }: { airportData: any; carData: any }) {
    // console.log(airportData.items)
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

    // console.log(records);
    const [filter, setFilter] = useState({
        airport: '',
        car: '',
    });
    const [filteredRecord, setFilteredRecord] = useState(records);

    useEffect(() => {
        if (filter.airport === '' && filter.car === '') {
            return;
        }

        if (filter.airport && filter.car) {
            const filtered = records.filter((item: any) => {
                return item.airport.id == filter.airport && item.car_class.id == filter.car;
            });
            setFilteredRecord(filtered);
            return;
        }
        if (filter.airport) {
            const filtered = records.filter((item: any) => {
                return item.airport.id == filter.airport;
            });
            setFilteredRecord(filtered);
            return;
        }
        if (filter.car) {
            const filtered = records.filter((item: any) => {
                return item.car_class.id == filter.car;
            });
            setFilteredRecord(filtered);
            return;
        }
        // setRecords(filtered);
    }, [filter]);
    return (
        <>
            <div>
                <Breadcrumb />

                <div className="min-h-screen pt-5">
                    <div className="panel h-full">
                        <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div className="grid grid-cols-3 gap-2">
                                <h5 className="text-lg font-semibold dark:text-white-light">Price Schema Data</h5>
                                <select
                                    className="rounded-lg border border-2 px-2 py-1 font-bold hover:cursor-pointer"
                                    onChange={(event) => {
                                        setFilter((prev) => ({ ...prev, airport: event.target.value }));
                                        // console.log(filterAirport)
                                    }}
                                    value={filter.airport}
                                >
                                    <option value={''}>Filter Airport</option>
                                    {airportData.items.map((airport: any) => {
                                        return (
                                            <option key={airport.id} value={airport.id}>
                                                {airport.name}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select
                                    className="rounded-lg border border-2 px-2 py-1 font-bold hover:cursor-pointer"
                                    onChange={(event) => {
                                        setFilter((prev) => ({ ...prev, car: event.target.value }));
                                        // console.log(filterAirport)
                                    }}
                                    value={filter.car}
                                >
                                    <option value={''}>Filter Car</option>
                                    {carData.items.map((car: any) => {
                                        return (
                                            <option key={car.id} value={car.id}>
                                                {car.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

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
                                        { accessor: 'airport.name', title: 'Airport Name' },
                                        { accessor: 'from_range_km', title: 'From Range', render: ({ from_range_km }) => <>{from_range_km} km</> },
                                        { accessor: 'to_range_km', title: 'To Range', render: ({ to_range_km }) => <>{to_range_km} km</> },
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
                                    records={filter.airport || filter.car ? filteredRecord : records}
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
export async function getServerSideProps() {
    const getAirportsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}airports?page=1&limit=9999999&sortBy=ASC`);
    const airportData = getAirportsResponse.data;

    const getAllCarResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}car-class?page=1&limit=9999999&sortBy=ASC`);
    const carData = getAllCarResponse.data;
    return {
        props: {
            airportData,
            carData,
        },
    };
}

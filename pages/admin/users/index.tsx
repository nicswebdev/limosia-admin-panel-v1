import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import { DataTable } from 'mantine-datatable';
import Users from '@/src/data/Users.json';
import { ActionIcon, Group } from '@mantine/core';
import { PencilIcon } from '@/src/assets/icons/Pencil.icon';
import TrashIcon from '@/src/assets/icons/Trash.icon';
import Link from 'next/link';
import { PlusIcon } from '@/src/assets/icons/Plus.icon';

export default function UsersIndex() {
  const PAGE_SIZE = 5;

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(Users.slice(0, PAGE_SIZE));

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;

    setRecords(Users.slice(from, to));
  }, [page]);

  useEffect(() => {
    dispatch(setPageTitle('Users Data'));
  });

  return (
    <>
      <div>
        <Breadcrumb />

        <div className="min-h-screen pt-5">
          <div className="panel h-full">
            <div className="mb-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">Users Data</h5>
              <Link href="carclass" className="btn btn-primary gap-2">
                <PlusIcon className="h-5 aspect-square" />
                Add New
              </Link>
            </div>
            <div>
              <div className="rounded-lg bg-white dark:bg-black">
                <DataTable
                  columns={[
                    { accessor: 'id' },
                    { accessor: 'firstName', title: 'First Name' },
                    { accessor: 'lastName', title: 'Last Name' },
                    { accessor: 'phone' },
                    { accessor: 'role' },
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
                  totalRecords={Users.length}
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

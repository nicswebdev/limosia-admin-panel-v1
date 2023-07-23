import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';
import { DataTable } from 'mantine-datatable';
import Image from 'next/image';
import { ActionIcon, Group } from '@mantine/core';
import Link from 'next/link';
import TrashIcon from '@/src/assets/icons/Trash.icon';
import { PencilIcon } from '@/src/assets/icons/Pencil.icon';
import { PlusIcon } from '@/src/assets/icons/Plus.icon';
import CarClasses from '@/src/data/CarClass.json';

export default function CarClassIndex() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Car Class Data'));
  });

  return (
    <>
      <div>
        <Breadcrumb />

        <div className="min-h-screen pt-5">
          <div className="panel h-full">
            <div className="mb-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">Car Classes Data</h5>
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
                    { accessor: 'class_name', title: 'Name' },
                    {
                      accessor: 'class_image',
                      title: 'Image',
                      render: ({ class_image }) => <Image src={class_image} width={100} height={100} style={{ width: 'auto', height: 'auto' }} alt="" priority />,
                    },
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
                  records={CarClasses}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

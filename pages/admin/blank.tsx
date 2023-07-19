import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { setPageTitle } from '../../store/themeConfigSlice';
import Breadcrumb from '@/components/Layouts/Breadcrumb';

const AdminDashboard = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Admin Dashboard'));
    });

    return (
        <>
            <div>
                <Breadcrumb />

                <div className="min-h-screen pt-5"></div>
            </div>
        </>
    );
};

export default AdminDashboard;

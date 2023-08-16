import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Breadcrumb() {
    const router = useRouter();

    const currentPage = router.asPath.split('/');

    return (
        <ul className="flex space-x-2 rtl:space-x-reverse">
            {currentPage.includes('admin') ? (
                <li>
                    <Link href="/admin/dashboard" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
            ) : (
                <li>
                    <Link href="/" className="text-primary hover:underline">
                        Home
                    </Link>
                </li>
            )}

            {currentPage.slice(-1).includes('dashboard') ? (
                <> </>
            ) : (
                currentPage.slice(2).map((val, idx) => {
                    return (
                        <li key={`breadcrumb-${idx}`} className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                            <span className="capitalize">{val}</span>
                        </li>
                    );
                })
            )}
        </ul>
    );
}

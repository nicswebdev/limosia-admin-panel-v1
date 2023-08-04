import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MenuItemType } from '@/src/types/MenuItem.type';
import HomeIcon from '@/src/assets/icons/Home.icon';
import BookingIcon from '@/src/assets/icons/Booking.icon';
import DocumentIcon from '@/src/assets/icons/Document.icon';
import UsersIcon from '@/src/assets/icons/Users.icon';
import { BookIcon } from '@/src/assets/icons/Book.icon';
import { DollarIcon } from '@/src/assets/icons/Dollar.icon';

const Sidebar = () => {
  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useState<string>('');
  // const [errorSubMenu, setErrorSubMenu] = useState(false);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? '' : value;
    });
  };

  const AdminMenuItems: MenuItemType[] = [
    {
      label: 'Dashboard',
      hasChildren: false,
      url: '/admin/dashboard',
      icon: <HomeIcon />,
    },
    // {
    //     label: 'Booking',
    //     hasChildren: false,
    //     url: '/admin/carclass',
    //     icon: <BookingIcon />,
    // },
    {
      label: 'Car Class',
      hasChildren: false,
      url: '/admin/carclass',
      icon: <DocumentIcon />,
    },
    {
      label: 'Airport',
      hasChildren: false,
      url: '/admin/airport',
      icon: <DocumentIcon />,
    },
    {
      label: 'Price Schema',
      hasChildren: false,
      url: '/admin/priceschema',
      icon: <DollarIcon />,
    },
    {
      label: 'Orders',
      hasChildren: false,
      url: '/admin/orders',
      icon: <BookIcon />,
    },
    {
      label: 'Users',
      hasChildren: false,
      url: '/admin/users',
      icon: <UsersIcon />,
    },
    // {
    //   label: 'Blank Page',
    //   hasChildren: false,
    //   url: '/admin/blank',
    //   icon: <DocumentIcon />,
    // },
  ];

  useEffect(() => {
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
    if (selector) {
      selector.classList.add('active');
      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
  }, [router.pathname]);

  const setActiveRoute = () => {
    let allLinks = document.querySelectorAll('.sidebar ul a.active');
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i];
      element?.classList.remove('active');
    }
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
    selector?.classList.add('active');
  };

  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}>
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <img className="ml-[5px] w-36 flex-none" src="/assets/images/logo/limosia-logo-long.png" alt="logo" />
            </Link>

            <button
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
              onClick={() => dispatch(toggleSidebar())}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-auto h-5 w-5">
                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
              {AdminMenuItems.map((item) => {
                if (item.hasChildren) {
                  return (
                    <li key={item.label} className="menu nav-item">
                      <button type="button" className={`${currentMenu === item.label ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu(item.label)}>
                        <div className="items-cent]er flex">
                          {/* icon hjere */}
                          <>{item.icon}</>

                          <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t(item.label)}</span>
                        </div>

                        <div className={currentMenu === item.label ? 'rotate-90' : 'rtl:rotate-180'}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </button>

                      <AnimateHeight duration={300} height={currentMenu === item.label ? 'auto' : 0}>
                        <ul className="sub-menu text-gray-500">
                          {item.children?.map((child) => (
                            <li key={child.label}>
                              <Link href={child.url}>{t(child.label)}</Link>
                            </li>
                          ))}
                        </ul>
                      </AnimateHeight>
                    </li>
                  );
                } else {
                  return (
                    <li key={item.label} className="nav-item">
                      <Link href={item.url} className="group">
                        <div className="flex items-center">
                          <>{item.icon}</>
                          <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t(item.label)}</span>
                        </div>
                      </Link>
                    </li>
                  );
                }
              })}
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import BellIcon from '@/src/assets/icons/Bell.icon';
import { CustomModalType } from '@/src/types/CustomModal.type';

export const CustomModal = ({ title, children, modal, setModal, action }: CustomModalType) => {
    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" open={modal} onClose={() => setModal(false)}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0" />
                </Transition.Child>
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-center justify-center px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-center bg-[#fbfbfb] py-2 dark:bg-[#121c2c]">
                                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f2f3] dark:bg-white/10">
                                        <BellIcon />
                                    </span>
                                </div>
                                <div className="p-5">
                                    <h5 className="text-center text-lg font-bold">{title}</h5>
                                    <div className="py-5 text-center text-white-dark">
                                        <p>{children}</p>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        {action ? (
                                            <>
                                                <button type="button" onClick={() => setModal(false)} className="btn btn-outline-secondary">
                                                    Cancel
                                                </button>

                                                <button type="button" onClick={action} className="btn btn-danger ltr:ml-4 rtl:mr-4">
                                                    Delete
                                                </button>
                                            </>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export type CustomModalType = {
    title: string;
    children: React.ReactNode;
    modal: boolean;
    setModal: React.ComponentState;
    action?: React.MouseEventHandler;
};

type MenuType = 'logout' | '';

export type MenuItemType = {
    label: string;
    url: string;
    icon?: JSX.Element;
    hasChildren: boolean;
    children?: Array<{
        label: string;
        url: string;
    }>;
    type?: MenuType;
};

type Guest = {
    dob: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    phone: string | null;
};

type UserRole = {
    role: Role;
};

type Role = {
    name: string;
};

export type User = {
    id: number;
    f_name: string;
    l_name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    delete_row: boolean;
    user_role: UserRole;
    guest: Guest;
};

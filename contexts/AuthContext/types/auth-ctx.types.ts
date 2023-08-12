import { User } from '@/src/types/entities';

export type AuthContextValue = {
    user: User | null;
    loading: boolean;

    setUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
};

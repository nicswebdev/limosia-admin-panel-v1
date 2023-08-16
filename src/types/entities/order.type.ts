type Status = {
    name: string;
    description: null;
};

export type Order = {
    id: number;
    user_id: number;
    order_no: string;
    f_name: string;
    l_name: string;
    email: string;
    phone: string;
    dob: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    pickup_point: string;
    destination_point: string;
    pickup_date: string;
    pickup_time: string;
    flight_number: string;
    total_guest: number;
    total_suitcase: number;
    car_class_name: string;
    airport_name: string;
    range: number;
    total_price: number;
    price_schema_name: string;
    order_currency: string;
    payment_status: Status | null;
    order_status: Status | null;
    created_at: string;
    updated_at: string;
    delete_row: boolean;
};

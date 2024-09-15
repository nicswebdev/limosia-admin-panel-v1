export type optionType = {
    label: string;
    value: string;
};

export type PriceSchemaType = {
    airport_id: number;
    car_class_id: number;
    tier_name: string;
    from_range_km: number;
    to_range_km: number;
    prebook_time_hour_1: number;
    refundable_base_price_1: number;
    non_refundable_base_price_1: number;
    prebook_time_hour_2: number | null;
    refundable_base_price_2: number | null;
    non_refundable_base_price_2: number | null;
};

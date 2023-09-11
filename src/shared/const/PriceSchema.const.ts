import * as Yup from 'yup';
import { PriceSchemaType } from '@/src/types/PriceSchema.type';

export const initialValues: PriceSchemaType = {
    airport_id: 0,
    car_class_id: 0,
    tier_name: '',
    from_range_km: 0,
    to_range_km:0,
    base_price: 0,
};

export const addPriceSchemaValidation = Yup.object().shape({
    tier_name: Yup.string().required('Tier Name is Required'),
    from_range_km: Yup.number().typeError('From Range KM must be a Number').required('From Range KM is required'),
    to_range_km: Yup.number().min(1, 'Put at least 1 KM').typeError('To Range KM must be a Number').required('To Range KM is required'),
    airport_id: Yup.number().min(1, 'Pleae Select a Valid Airport').required('Airport is Required'),
    car_class_id: Yup.number().min(1, 'Please Select a Valid Car Class').required('Car Class is Required'),
    base_price: Yup.string().required('Base Price is Required'),
});

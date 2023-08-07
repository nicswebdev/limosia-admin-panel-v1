import * as Yup from 'yup';
import { PriceSchemaType } from '@/src/types/PriceSchema.type';

export const initialValues: PriceSchemaType = {
    airport_id: 0,
    car_class_id: 0,
    tier_name: '',
    range_km: 0,
    base_price: 0,
};

export const addPriceSchemaValidation = Yup.object().shape({
    tier_name: Yup.string().required('Tier Name is Required'),
    range_km: Yup.number().min(1, 'Put at least 1 KM').typeError('Range KM must be a Number').required('Range KM is required'),
    airport_id: Yup.number().min(1, 'Pleae Select a Valid Airport').required('Airport is Required'),
    car_class_id: Yup.number().min(1, 'Please Select a Valid Car Class').required('Car Class is Required'),
    base_price: Yup.string().required('Base Price is Required'),
});

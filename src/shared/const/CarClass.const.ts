import * as Yup from 'yup';
import { CarClassType } from '@/src/types/CarClass.type';

export const initialValues: CarClassType = {
    name: '',
    image: '' || [],
    description: '',
    max_guest: 0,
    max_suitcase: 0,
    rent_price_per_day: 0,
};

export const addCarClassSchema = Yup.object().shape({
    name: Yup.string().required('Car Class Name is Required'),
    image: Yup.mixed().required('Image is Required'),
});

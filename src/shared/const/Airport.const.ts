import * as Yup from 'yup';
import { AirportType } from '@/src/types/Airport.type';

export const initialValues: AirportType = {
    name: '',
    latitude: '',
    longitude: '',
};

export const addAirportSchema = Yup.object().shape({
    name: Yup.string().required('Airport is Required'),
    latitude: Yup.number().typeError('Latitude must be a Number').required('Latitude is Required'),
    longitude: Yup.number().typeError('Longitude must be a Number').required('Longitude is Required'),
});

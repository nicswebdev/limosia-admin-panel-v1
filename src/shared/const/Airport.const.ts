import * as Yup from 'yup';
import { AirportType } from '@/src/types/Airport.type';

export const initialValues: AirportType = {
    name: '',
    name_from_maps:'',
    place_id:''
};

export const addAirportSchema = Yup.object().shape({
    name: Yup.string().required('Airport Name is Required'),
    name_from_maps: Yup.string().typeError('Latitude must be a String').required('Name From Maps is Required'),
});

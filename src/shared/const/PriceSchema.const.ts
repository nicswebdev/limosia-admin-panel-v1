import * as Yup from 'yup';
import { PriceSchemaType } from '@/src/types/PriceSchema.type';

export const initialValues: PriceSchemaType = {
    airport_id: 0,
    car_class_id: 0,
    tier_name: '',
    from_range_km: 0,
    to_range_km: 0,
    prebook_time_hour_1: 0,
    refundable_base_price_1: 0,
    non_refundable_base_price_1: 0,
    prebook_time_hour_2: null,
    refundable_base_price_2: null,
    non_refundable_base_price_2: null,
};

export const addPriceSchemaValidation = Yup.object().shape({
    tier_name: Yup.string().required('Tier Name is Required'),
    from_range_km: Yup.number().typeError('From Range KM must be a Number').required('From Range KM is required'),
    to_range_km: Yup.number().min(1, 'Put at least 1 KM').typeError('To Range KM must be a Number').required('To Range KM is required'),
    airport_id: Yup.number().min(1, 'Pleae Select a Valid Airport').required('Airport is Required'),
    car_class_id: Yup.number().min(1, 'Please Select a Valid Car Class').required('Car Class is Required'),
    prebook_time_hour_1: Yup.number().min(0, 'Please put at least 0').required('This field is required'),
    refundable_base_price_1: Yup.number().min(0, 'Please put at least 0').required('This field is required'),
    non_refundable_base_price_1: Yup.number().min(0, 'Please put at least 0').required('This field is required'),
    prebook_time_hour_2: Yup.number()
        .nullable()
        .typeError('Must be a number')
        .min(0, 'Please put at least 0')
        .test('null-check', 'Required if other field in this column is provided', function (value) {
            const refundablePrice = this.resolve(Yup.ref('refundable_base_price_2'));
            const nonRefundablePrice = this.resolve(Yup.ref('non_refundable_base_price_2'));
            if ((refundablePrice || nonRefundablePrice) && value === null) {
                return false;
            }
            return true;
        }),
    refundable_base_price_2: Yup.number()
        .typeError('Must be a number')
        .min(0, 'Please put at least 0')
        .nullable()
        .test('null-check', 'Required if other field in this column is provided', function (value) {
            const preBookTimeHour = this.resolve(Yup.ref('prebook_time_hour_2'));
            const nonRefundablePrice = this.resolve(Yup.ref('non_refundable_base_price_2'));
            if ((preBookTimeHour || nonRefundablePrice) && value === null) {
                return false;
            }
            return true;
        }),
    non_refundable_base_price_2: Yup.number()
        .typeError('Must be a number')
        .min(0, 'Please put at least 0 or leave this empty')
        .nullable()
        .test('null-check', 'Required if other field in this column is provided', function (value) {
            const refundablePrice = this.resolve(Yup.ref('refundable_base_price_2'));
            const preBookTimeHour = this.resolve(Yup.ref('prebook_time_hour_2'));
            if ((preBookTimeHour || refundablePrice) && value === null) {
                return false;
            }
            return true;
        }),
});

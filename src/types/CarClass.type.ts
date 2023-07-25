import * as Yup from 'yup';

export type CarClassType = {
    name: string;
    image: File[];
    description: string;
    max_guest: number;
    max_suitcase: number;
};

export const addCarClassSchema = Yup.object().shape({
    name: Yup.string().required('Car Class Name is Required'),
    image: Yup.mixed().required('Image is Required'),
});

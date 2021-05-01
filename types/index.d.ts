import type { Writable } from 'svelte/store';
import type { ObjectSchema } from 'yup';
declare type FormState = {
    [key: string]: {
        _touched?: boolean;
        _errors?: string[];
        [key: string]: any;
    };
};
declare type FormConfigInput<Data = any> = {
    initialValues: Data;
    validationSchema?: ObjectSchema<any>;
    css?: {
        enabled?: boolean;
        validClass?: string;
        invalidClass?: string;
        useValid?: boolean;
        useInvalid?: boolean;
    };
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
};
export declare function createForm<Data>({ initialValues, validationSchema, css: cssConfig, validateOnChange, validateOnBlur }: FormConfigInput<Data>): {
    form: Writable<Data>;
    state: Writable<FormState>;
    isValid: Writable<boolean>;
    isTouched: Writable<boolean>;
    validateForm: (highlight?: 'none' | 'errors' | 'all') => void;
    handleChange: (event: Event) => void;
    updateForm: () => Promise<void>;
    setTouched: (state: boolean) => void;
    formControl: (node: HTMLElement & {
        name: string;
    }, options?: any) => {
        destroy(): void;
    };
};
export {};

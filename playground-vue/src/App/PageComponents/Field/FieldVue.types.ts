import type {
    BasePageCheckFieldProps,
    BasePageColorFieldProps,
    BasePageFileFieldProps,
    BasePageNumberFieldProps,
    BasePageTextFieldProps,
} from "@thewaver/ss-playground/App/PageComponents/Field/Field.types";

export type PageNumberFieldProps = BasePageNumberFieldProps;

export type PageTextFieldProps = BasePageTextFieldProps;

export type PageCheckFieldProps = BasePageCheckFieldProps;

export type PageColorFieldProps = BasePageColorFieldProps;

export type PageFileFieldProps = BasePageFileFieldProps;

export type PageSelectFieldProps<T> = {
    id?: string;
    value: T;
    values: readonly T[];
    width?: number;
    isDisabled?: boolean;
    ariaLabel?: string;
    computeLabel?: (value: T) => string;
    onChange: (value: T) => void;
};

export type PageGroupedSelectFieldProps<T> = Omit<PageSelectFieldProps<T>, "values"> & {
    groups: readonly (readonly [string, readonly T[]])[];
};

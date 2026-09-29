export type PageNumberFieldProps = {
    id?: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    width?: number;
    isDisabled?: boolean;
    ariaLabel?: string;
    onInput: (value: number) => void;
};

export type PageTextFieldProps = {
    value: string;
    width?: number;
    isDisabled?: boolean;
    ariaLabel?: string;
    placeholder?: string;
    onInput: (value: string) => void;
    onBlur?: () => void;
};

export type PageCheckFieldProps = {
    value: boolean;
    isDisabled?: boolean;
    ariaLabel?: string;
    onChange: (value: boolean) => void;
};

export type PageColorFieldProps = {
    value: string;
    isDisabled?: boolean;
    ariaLabel?: string;
    onInput: (value: string) => void;
};

export type PageFileFieldProps = {
    accept?: string;
    isDisabled?: boolean;
    ariaLabel?: string;
    onPick: (file: File) => void;
};

export type PageSelectFieldProps<T> = {
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

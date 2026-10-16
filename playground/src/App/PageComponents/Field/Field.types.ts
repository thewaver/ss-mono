export type BasePageNumberFieldValues = {
    id?: string;
    value: number;
    resetValue?: number;
    min?: number;
    max?: number;
    step?: number;
    width?: number;
    isDisabled?: boolean;
    ariaLabel?: string;
};

export type BasePageNumberFieldCbs = {
    onInput: (value: number) => void;
};

export type BasePageNumberFieldProps = BasePageNumberFieldValues & BasePageNumberFieldCbs;

export type BasePageTextFieldValues = {
    value: string;
    width?: number;
    isDisabled?: boolean;
    ariaLabel?: string;
    placeholder?: string;
};

export type BasePageTextFieldCbs = {
    onInput: (value: string) => void;
    onBlur?: () => void;
};

export type BasePageTextFieldProps = BasePageTextFieldValues & BasePageTextFieldCbs;

export type BasePageCheckFieldValues = {
    value: boolean;
    resetValue?: boolean;
    isDisabled?: boolean;
    ariaLabel?: string;
};

export type BasePageCheckFieldCbs = {
    onChange: (value: boolean) => void;
};

export type BasePageCheckFieldProps = BasePageCheckFieldValues & BasePageCheckFieldCbs;

export type BasePageColorFieldValues = {
    value: string;
    isDisabled?: boolean;
    ariaLabel?: string;
};

export type BasePageColorFieldCbs = {
    onInput: (value: string) => void;
};

export type BasePageColorFieldProps = BasePageColorFieldValues & BasePageColorFieldCbs;

export type BasePageFileFieldValues = {
    accept?: string;
    isDisabled?: boolean;
    ariaLabel?: string;
};

export type BasePageFileFieldCbs = {
    onPick: (file: File) => void;
};

export type BasePageFileFieldProps = BasePageFileFieldValues & BasePageFileFieldCbs;

import type { AccessorProps, AccessorValues, MaybeAccessor } from "@thewaver/ss-components-solid";
import type {
    BasePageCheckFieldCbs,
    BasePageCheckFieldValues,
    BasePageColorFieldCbs,
    BasePageColorFieldValues,
    BasePageFileFieldCbs,
    BasePageFileFieldValues,
    BasePageNumberFieldCbs,
    BasePageNumberFieldValues,
    BasePageTextFieldCbs,
    BasePageTextFieldValues,
} from "@thewaver/ss-playground/App/PageComponents/Field/Field.types";

export type PageNumberFieldProps = AccessorValues<BasePageNumberFieldValues> & BasePageNumberFieldCbs;

export type PageTextFieldProps = AccessorValues<BasePageTextFieldValues> & BasePageTextFieldCbs;

export type PageCheckFieldProps = AccessorValues<BasePageCheckFieldValues> & BasePageCheckFieldCbs;

export type PageColorFieldProps = AccessorValues<BasePageColorFieldValues> & BasePageColorFieldCbs;

export type PageFileFieldProps = AccessorValues<BasePageFileFieldValues> & BasePageFileFieldCbs;

export type PageSelectFieldProps<T> = {
    value: MaybeAccessor<T>;
    values: MaybeAccessor<readonly T[]>;
    computeLabel?: (value: T) => string;
    onChange: (value: T) => void;
} & AccessorProps<{
    id?: string;
    width?: number;
    isDisabled?: boolean;
    ariaLabel?: string;
}>;

export type PageGroupedSelectFieldProps<T> = Omit<PageSelectFieldProps<T>, "values"> & {
    groups: MaybeAccessor<readonly (readonly [string, readonly T[]])[]>;
};

import type { SignalSource } from "../../Utils/typeUtils";

export type MaskedFieldDefs<T> = {
    getValue: () => T | undefined;
    setValue: (next: T | undefined) => void;
    formatDigits: (digits: string) => string;
    readDigits?: (text: string) => string;
    getDigitCount: () => number | undefined;
    toDigits: (value: T) => string;
    fromDigits: (digits: string) => T | undefined;
    getHasImpossibleDigits: (digits: string) => boolean;
    getIsSame: (a: T | undefined, b: T | undefined) => boolean;
};

export type MaskedFieldHandle<T> = {
    textSignal: SignalSource<string>;
    getDigits: () => string;
    getHasIssue: () => boolean;
    formatValue: (value: T) => string;
    commit: (next: T | undefined) => void;
    refresh: () => void;
    onInput: () => void;
    onBlur: () => void;
};

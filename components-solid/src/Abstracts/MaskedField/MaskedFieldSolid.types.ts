import type { SignalSource } from "../../Utils/typeUtils";

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

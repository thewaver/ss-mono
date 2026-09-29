import type { ValuePair } from "../../Utils/typeUtils.js";
export type MaskedFieldHandle<T> = {
    text: ValuePair<string>;
    getDigits: () => string;
    getHasIssue: () => boolean;
    formatValue: (value: T) => string;
    commit: (next: T | undefined) => void;
    refresh: () => void;
    onInput: () => void;
    onBlur: () => void;
};

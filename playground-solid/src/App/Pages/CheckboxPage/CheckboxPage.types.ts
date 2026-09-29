import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";

export type CheckboxExampleProps = {
    checked: Signal<boolean>;
};

export type CheckboxMixedExampleProps = AccessorProps<{
    all: Signal<boolean>;
    firstChild: Signal<boolean>;
    secondChild: Signal<boolean>;
    isMixed: boolean;
}>;

export type CheckboxRefusedWriteExampleProps = {
    email: Signal<boolean>;
    sms: Signal<boolean>;
};

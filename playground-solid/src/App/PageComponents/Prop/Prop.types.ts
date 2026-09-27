import type { AccessorProps } from "@thewaver/ss-components-solid";

export type PagePropProps = AccessorProps<{
    key: string;
    label: string;
    hint: string;
    defaultValue?: unknown;
}>;

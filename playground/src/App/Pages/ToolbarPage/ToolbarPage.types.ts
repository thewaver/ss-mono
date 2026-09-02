import type { AccessorProps } from "@thewaver/ss-components";

export type ToolbarExampleProps = AccessorProps<{
    gap: number;
    onActivate: (value: string) => void;
}>;

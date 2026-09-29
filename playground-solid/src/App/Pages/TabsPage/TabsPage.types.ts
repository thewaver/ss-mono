import type { AccessorProps } from "@thewaver/ss-components-solid";

export type TabsExampleProps = AccessorProps<{
    selectedValue: string | undefined;
    hasAutoActivation?: boolean;
    onSelectionChange: (value: string) => void;
}>;

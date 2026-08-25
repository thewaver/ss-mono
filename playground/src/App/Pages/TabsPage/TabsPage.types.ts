import type { AccessorProps } from "@thewaver/ss-components";

export type TabsExampleProps = AccessorProps<{
    selectedValue: string | undefined;
    hasAutoActivation?: boolean;
}> & {
    onSelectionChange: (value: string) => void;
};

import type { AccessorProps } from "@thewaver/ss-components";

export type SourceFile = {
    name: string;
    source: string;
};

export type SourceGroup = {
    name: string;
    files: SourceFile[];
    expandedNames: string[];
};

export type SourceViewProps = AccessorProps<{
    path: string;
}>;

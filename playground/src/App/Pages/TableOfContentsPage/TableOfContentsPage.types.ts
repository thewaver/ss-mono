import type { AccessorProps } from "@thewaver/ss-components";

export type TableOfContentsSection = {
    id: string;
    title: string;
    text: string;
    depth?: number;
};

export type TableOfContentsExampleProps = AccessorProps<{
    sections: TableOfContentsSection[];
    ariaLabel: string;
    onCurrentChange: (id: string | undefined) => void;
}>;

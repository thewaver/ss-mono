import type { AccessorProps } from "@thewaver/ss-components-solid";
import type { TableOfContentsSection } from "@thewaver/ss-playground-core/App/Pages/TableOfContentsPage/TableOfContentsSection.types";

export type TableOfContentsExampleProps = AccessorProps<{
    sections: TableOfContentsSection[];
    ariaLabel: string;
    onCurrentChange: (id: string | undefined) => void;
}>;

import type { TableOfContentsSection } from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsSection.types";

export type TableOfContentsExampleProps = {
    sections: TableOfContentsSection[];
    ariaLabel: string;
    onCurrentChange: (id: string | undefined) => void;
};

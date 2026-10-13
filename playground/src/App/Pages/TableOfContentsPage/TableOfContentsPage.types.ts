import type { TableOfContentsSection } from "./TableOfContentsSection.types";

export type BaseTableOfContentsExampleValues = {
    sections: TableOfContentsSection[];
    ariaLabel: string;
};

export type BaseTableOfContentsExampleCbs = {
    onCurrentChange: (id: string | undefined) => void;
};

export type BaseTableOfContentsExampleProps = BaseTableOfContentsExampleValues & BaseTableOfContentsExampleCbs;

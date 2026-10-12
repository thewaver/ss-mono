import type { ApiTable } from "virtual:component-api";
import type { ComponentPublicInstance } from "vue";

export type PageDocsViewProps = {
    name: string;
    description: string;
};

export type PageDocsTableProps = {
    table: ApiTable;
    headingId: string;
    headingRef: (element: Element | ComponentPublicInstance | null) => void;
};

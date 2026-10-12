import type { ApiTable } from "virtual:component-api";

export type PageDocsViewProps = {
    name: string;
    description: string;
};

export type PageDocsTableProps = {
    table: ApiTable;
    headingId: string;
    headingRef: (element: HTMLElement | null) => void;
};

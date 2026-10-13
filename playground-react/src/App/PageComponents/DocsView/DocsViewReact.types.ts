import type { ApiTable } from "virtual:component-api";

import type { BasePageDocsViewProps } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";

export type PageDocsViewProps = BasePageDocsViewProps;

export type PageDocsTableProps = {
    table: ApiTable;
    headingId: string;
    unit: string;
    headingRef: (element: HTMLElement | null) => void;
};

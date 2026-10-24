import type { ApiTable } from "virtual:component-api";

import type { BasePageApiViewProps } from "@thewaver/ss-playground/App/PageComponents/ApiView/ApiView.types";

export type PageApiViewProps = BasePageApiViewProps;

export type PageApiTableProps = {
    table: ApiTable;
    headingId: string;
    unit: string;
    headingRef: (element: HTMLElement | null) => void;
};

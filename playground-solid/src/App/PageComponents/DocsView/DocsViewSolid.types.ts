import type { ApiTable } from "virtual:component-api";

import type { AccessorProps, AccessorValues } from "@thewaver/ss-components-solid";
import type { BasePageDocsViewValues } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";

export type PageDocsViewProps = AccessorValues<BasePageDocsViewValues>;

export type PageDocsTableProps = AccessorProps<{
    table: ApiTable;
    headingId: string;
    unit: string;
}> & {
    headingRef: (element: HTMLElement) => void;
};

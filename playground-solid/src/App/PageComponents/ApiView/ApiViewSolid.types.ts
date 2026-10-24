import type { ApiTable } from "virtual:component-api";

import type { AccessorProps, AccessorValues } from "@thewaver/ss-components-solid";
import type { BasePageApiViewValues } from "@thewaver/ss-playground/App/PageComponents/ApiView/ApiView.types";

export type PageApiViewProps = AccessorValues<BasePageApiViewValues>;

export type PageApiTableProps = AccessorProps<{
    table: ApiTable;
    headingId: string;
    unit: string;
}> & {
    headingRef: (element: HTMLElement) => void;
};

import type { ApiTable } from "virtual:component-api";

import type { AccessorProps } from "@thewaver/ss-components";

export type PageApiViewProps = AccessorProps<{
    name: string;
}>;

export type PageApiTableProps = AccessorProps<{
    table: ApiTable;
}>;

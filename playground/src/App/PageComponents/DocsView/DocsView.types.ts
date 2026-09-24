import type { ApiTable } from "virtual:component-api";

import type { AccessorProps } from "@thewaver/ss-components";

export type PageDocsViewProps = AccessorProps<{
    name: string;
    description: string;
}>;

export type PageDocsTableProps = AccessorProps<{
    table: ApiTable;
}>;

import type { Attachment } from "svelte/attachments";
import type { ApiTable } from "virtual:component-api";

import type { BasePageApiViewProps } from "@thewaver/ss-playground/App/PageComponents/ApiView/ApiView.types";

export type PageApiViewProps = BasePageApiViewProps;

export type PageApiTableProps = {
    table: ApiTable;
    headingId: string;
    unit: string;
    attachHeading: Attachment<HTMLElement>;
};

import type { Attachment } from "svelte/attachments";
import type { ApiTable } from "virtual:component-api";

export type PageDocsViewProps = {
    name: string;
    description: string;
};

export type PageDocsTableProps = {
    table: ApiTable;
    headingId: string;
    attachHeading: Attachment<HTMLElement>;
};

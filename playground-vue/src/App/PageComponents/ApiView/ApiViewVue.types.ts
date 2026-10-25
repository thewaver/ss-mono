import type { ApiTable, ApiText } from "virtual:component-api";
import type { ComponentPublicInstance } from "vue";

import type { BasePageApiViewProps } from "@thewaver/ss-playground/App/PageComponents/ApiView/ApiView.types";

export type PageApiViewProps = BasePageApiViewProps;

export type PageApiTableProps = {
    table: ApiTable;
    headingId: string;
    unit: string;
    headingRef: (element: Element | ComponentPublicInstance | null) => void;
    onFragmentClick: (e: MouseEvent, href: string) => void;
};

export type PageApiTextProps = {
    text: ApiText;
};

import type { Snippet } from "svelte";

import type { TableHeaderContentProps } from "../../StyledComponents/TableContent/TableContent.types";

export type PageTableHeaderProps = TableHeaderContentProps & {
    children?: Snippet;
};

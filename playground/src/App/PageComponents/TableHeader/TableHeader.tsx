import type { ParentProps } from "solid-js";

import { TableHeaderReorder, TableHeaderSort } from "@thewaver/ss-components";

import {
    PageTableHeaderContent,
    PageTableHeaderText,
    PageTableReorderGrip,
    PageTableSortControl,
} from "../../StyledComponents/TableContent/TableContent";
import type { PageTableHeaderProps } from "./TableHeader.types";

export const PageTableHeader = (props: ParentProps<PageTableHeaderProps>) => {
    return (
        <PageTableHeaderContent renderProps={props.renderProps} align={props.align}>
            <TableHeaderReorder renderContent={() => <PageTableReorderGrip />} />

            <PageTableHeaderText>{props.children}</PageTableHeaderText>

            <TableHeaderSort
                renderContent={(getRenderProps) => <PageTableSortControl renderProps={getRenderProps} />}
            />
        </PageTableHeaderContent>
    );
};

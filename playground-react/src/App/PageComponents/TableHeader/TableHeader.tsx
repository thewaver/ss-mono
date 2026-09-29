import type { PropsWithChildren } from "react";

import { TableHeaderReorder, TableHeaderSort } from "@thewaver/ss-components-react";

import {
    PageTableHeaderContent,
    PageTableHeaderText,
    PageTableReorderGrip,
    PageTableSortControl,
} from "../../StyledComponents/TableContent/TableContent";
import type { PageTableHeaderProps } from "./TableHeader.types";

export const PageTableHeader = (props: PropsWithChildren<PageTableHeaderProps>) => {
    return (
        <PageTableHeaderContent renderProps={props.renderProps} align={props.align}>
            <TableHeaderReorder renderContent={() => <PageTableReorderGrip />} />

            <PageTableHeaderText>{props.children}</PageTableHeaderText>

            <TableHeaderSort renderContent={(renderProps) => <PageTableSortControl renderProps={renderProps} />} />
        </PageTableHeaderContent>
    );
};

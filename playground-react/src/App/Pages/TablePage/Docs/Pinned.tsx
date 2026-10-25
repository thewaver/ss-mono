import { useMemo, useState } from "react";

import type { TableSort } from "@thewaver/ss-components-react";
import { Table } from "@thewaver/ss-components-react";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableMarker, PageTableResizer } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../TablePageReact.const";
import type { Part } from "../TablePageReact.types";

export const PinnedDocsExample = () => {
    const sortState = useState<TableSort | undefined>();
    const selectionState = useState<Part[]>([]);
    const widthsState = useState<Record<string, number>>({});
    const orderState = useState<string[]>([]);

    const columns = useMemo(() => createPartColumns({ isPinned: true, isResizable: true, isReorderable: true }), []);

    return (
        <div className={styles.tableFrameCapped}>
            <Table
                columns={columns}
                rows={PARTS}
                sort={sortState}
                selection={selectionState}
                widths={widthsState}
                order={orderState}
                ariaLabel={"Parts with pinned columns"}
                announcements={TABLE_ANNOUNCEMENTS}
                renderResizer={(renderProps) => <PageTableResizer renderProps={renderProps} />}
                renderMarker={() => <PageTableMarker />}
            />
        </div>
    );
};

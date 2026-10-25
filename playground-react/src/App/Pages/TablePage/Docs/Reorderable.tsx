import { useMemo, useState } from "react";

import type { TableSort } from "@thewaver/ss-components-react";
import { Table } from "@thewaver/ss-components-react";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableMarker } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../TablePageReact.const";
import type { Part } from "../TablePageReact.types";

export const ReorderableDocsExample = () => {
    const sortState = useState<TableSort | undefined>();
    const selectionState = useState<Part[]>([]);
    const orderState = useState<string[]>([]);

    const columns = useMemo(() => createPartColumns({ isReorderable: true }), []);

    return (
        <div className={styles.tableFrameShort}>
            <Table
                columns={columns}
                rows={PARTS}
                sort={sortState}
                selection={selectionState}
                order={orderState}
                ariaLabel={"Parts with reorderable columns"}
                announcements={TABLE_ANNOUNCEMENTS}
                renderMarker={() => <PageTableMarker />}
            />
        </div>
    );
};

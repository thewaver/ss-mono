import { useMemo, useState } from "react";

import type { TableSort } from "@thewaver/ss-components-react";
import { Table } from "@thewaver/ss-components-react";
import { PARTS_RESIZABLE_COLUMNS_LABEL } from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableResizer } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../TablePageReact.const";
import type { Part } from "../TablePageReact.types";

export const ResizableDocsExample = () => {
    const sortState = useState<TableSort | undefined>();
    const selectionState = useState<Part[]>([]);
    const widthsState = useState<Record<string, number>>({});

    const columns = useMemo(() => createPartColumns({ isResizable: true }), []);

    return (
        <div className={styles.tableFrameShort}>
            <Table
                columns={columns}
                rows={PARTS}
                sort={sortState}
                selection={selectionState}
                widths={widthsState}
                ariaLabel={PARTS_RESIZABLE_COLUMNS_LABEL}
                renderResizer={(renderProps) => <PageTableResizer renderProps={renderProps} />}
            />
        </div>
    );
};

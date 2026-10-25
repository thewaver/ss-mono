import { useMemo, useState } from "react";

import type { TableSort } from "@thewaver/ss-components-react";
import { Table } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { createPartColumns, createStressParts } from "../TablePageReact.const";
import type { Part, TableVirtualizedDocsExampleProps } from "../TablePageReact.types";

const ESTIMATED_ROW_HEIGHT = 29;

type Props = TableVirtualizedDocsExampleProps;

export const VirtualizedDocsExample = (props: Props) => {
    const sortState = useState<TableSort | undefined>();
    const selectionState = useState<Part[]>([]);

    const columns = useMemo(() => createPartColumns({}), []);
    const rows = useMemo(() => createStressParts(props.count), [props.count]);

    return (
        <div className={styles.tableFrameTall}>
            <Table
                columns={columns}
                rows={rows}
                sort={sortState}
                selection={selectionState}
                ariaLabel={"Every part"}
                computeEstimatedRowHeight={() => ESTIMATED_ROW_HEIGHT}
            />
        </div>
    );
};

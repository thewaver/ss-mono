import { useMemo } from "react";

import { Table } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { createPartColumns } from "../TablePage.const";
import type { Part, TableExampleProps } from "../TablePage.types";

const ESTIMATED_ROW_HEIGHT = 29;

type Props = TableExampleProps & { rows: Part[] };

export const VirtualizedExample = (props: Props) => {
    const columns = useMemo(() => createPartColumns({ isResizable: false }), []);

    return (
        <div className={styles.tableFrameTall}>
            <Table
                columns={columns}
                rows={props.rows}
                sortState={props.sortState}
                selectionState={props.selectionState}
                ariaLabel={"Every part"}
                computeEstimatedRowHeight={() => ESTIMATED_ROW_HEIGHT}
            />
        </div>
    );
};

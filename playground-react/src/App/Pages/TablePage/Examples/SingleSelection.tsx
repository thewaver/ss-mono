import { useMemo } from "react";

import { Table } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/TablePage/TablePage.css";

import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

export const SingleSelectionExample = (props: TableExampleProps) => {
    const columns = useMemo(() => createPartColumns({ isResizable: false }), []);

    return (
        <div className={styles.tableFrameShort}>
            <Table
                columns={columns}
                rows={PARTS}
                sortState={props.sortState}
                selectionState={props.selectionState}
                selectionMode={"single"}
                ariaLabel={"Parts, one at a time"}
            />
        </div>
    );
};

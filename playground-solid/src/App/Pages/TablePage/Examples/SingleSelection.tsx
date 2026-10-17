import { createMemo } from "solid-js";

import { Table } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import type { TableExampleProps } from "../TablePage.types";
import { PARTS, createPartColumns } from "../TablePageSolid.const";

export const SingleSelectionExample = (props: TableExampleProps) => {
    const getColumns = createMemo(() => createPartColumns({ isResizable: false }));

    return (
        <div class={styles.tableFrameShort}>
            <Table
                columns={getColumns}
                rows={PARTS}
                sort={props.sort}
                selection={props.selection}
                selectionMode={"single"}
                ariaLabel={"Parts, one at a time"}
            />
        </div>
    );
};

import { createMemo } from "solid-js";

import { Table } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

export const SingleSelectionExample = (props: TableExampleProps) => {
    const getColumns = createMemo(() => createPartColumns({ isResizable: false }));

    return (
        <div class={styles.tableFrameShort}>
            <Table
                columns={getColumns}
                rows={() => PARTS}
                sortSignal={props.sortSignal}
                selectionSignal={props.selectionSignal}
                selectionMode={"single"}
                ariaLabel={"Parts, one at a time"}
            />
        </div>
    );
};

import { createMemo } from "solid-js";

import { Table } from "@thewaver/ss-components";

import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

import * as styles from "../TablePage.css";

export const DisabledExample = (props: TableExampleProps) => {
    const getColumns = createMemo(() => createPartColumns({ isResizable: false }));

    return (
        <div class={styles.tableFrameShort}>
            <Table
                columns={getColumns}
                rows={() => PARTS}
                sortSignal={props.sortSignal}
                selectionSignal={props.selectionSignal}
                isDisabled={true}
                ariaLabel={"Parts, read only"}
            />
        </div>
    );
};

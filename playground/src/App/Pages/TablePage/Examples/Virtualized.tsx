import { createMemo } from "solid-js";

import type { MaybeAccessor } from "@thewaver/ss-components";
import { Table } from "@thewaver/ss-components";

import { createPartColumns } from "../TablePage.const";
import type { Part, TableExampleProps } from "../TablePage.types";

import * as styles from "../TablePage.css";

const ESTIMATED_ROW_HEIGHT = 29;

type Props = TableExampleProps & { rows: MaybeAccessor<Part[]> };

export const VirtualizedExample = (props: Props) => {
    const getColumns = createMemo(() => createPartColumns({ isResizable: false }));

    return (
        <div class={styles.tableFrameTall}>
            <Table
                columns={getColumns}
                rows={props.rows}
                sortSignal={props.sortSignal}
                selectionSignal={props.selectionSignal}
                ariaLabel={"Every part"}
                computeEstimatedRowHeight={() => ESTIMATED_ROW_HEIGHT}
            />
        </div>
    );
};

import { createMemo } from "solid-js";

import type { MaybeAccessor } from "@thewaver/ss-components-solid";
import { Table } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { createPartColumns } from "../TablePage.const";
import type { Part, TableExampleProps } from "../TablePage.types";

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

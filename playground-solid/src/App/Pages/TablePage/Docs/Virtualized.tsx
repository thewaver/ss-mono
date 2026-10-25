import { createMemo, createSignal } from "solid-js";

import type { TableSort } from "@thewaver/ss-components-solid";
import { Table, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { createPartColumns, createStressParts } from "../TablePageSolid.const";
import type { Part, TableVirtualizedDocsExampleProps } from "../TablePageSolid.types";

const ESTIMATED_ROW_HEIGHT = 29;

type Props = TableVirtualizedDocsExampleProps;

export const VirtualizedDocsExample = (props: Props) => {
    const sortSignal = createSignal<TableSort | undefined>();
    const selectionSignal = createSignal<Part[]>([]);

    const getColumns = createMemo(() => createPartColumns({}));
    const getRows = createMemo(() => createStressParts(access(props.count)));

    return (
        <div class={styles.tableFrameTall}>
            <Table
                columns={getColumns}
                rows={getRows}
                sort={sortSignal}
                selection={selectionSignal}
                ariaLabel={"Every part"}
                computeEstimatedRowHeight={() => ESTIMATED_ROW_HEIGHT}
            />
        </div>
    );
};

import type { Signal } from "solid-js";
import { createMemo } from "solid-js";

import { Table } from "@thewaver/ss-components";

import { PageTableMarker } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

import * as styles from "../TablePage.css";

type Props = TableExampleProps & { orderSignal: Signal<string[]> };

export const ReorderableExample = (props: Props) => {
    const getColumns = createMemo(() => createPartColumns({ isReorderable: true }));

    return (
        <div class={styles.tableFrameShort}>
            <Table
                columns={getColumns}
                rows={() => PARTS}
                sortSignal={props.sortSignal}
                selectionSignal={props.selectionSignal}
                orderSignal={props.orderSignal}
                ariaLabel={"Parts with reorderable columns"}
                renderMarker={() => <PageTableMarker />}
            />
        </div>
    );
};

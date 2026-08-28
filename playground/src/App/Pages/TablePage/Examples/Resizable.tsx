import type { Signal } from "solid-js";
import { createMemo } from "solid-js";

import { Table } from "@thewaver/ss-components";

import { PageTableResizer } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

import * as styles from "../TablePage.css";

type Props = TableExampleProps & { widthsSignal: Signal<Record<string, number>> };

export const ResizableExample = (props: Props) => {
    const getColumns = createMemo(() => createPartColumns({ isResizable: true }));

    return (
        <div class={styles.tableFrameShort}>
            <Table
                columns={getColumns}
                rows={() => PARTS}
                sortSignal={props.sortSignal}
                selectionSignal={props.selectionSignal}
                widthsSignal={props.widthsSignal}
                ariaLabel={"Parts with resizable columns"}
                renderResizer={(getFlags) => <PageTableResizer flags={getFlags} />}
            />
        </div>
    );
};

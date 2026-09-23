import type { Signal } from "solid-js";
import { createMemo } from "solid-js";

import { Table } from "@thewaver/ss-components";

import { TABLE_ANNOUNCEMENTS } from "../../../PageComponents/Announcements/Announcements.const";
import {
    PageTableMarker,
    PageTableReorderGrip,
    PageTableSortControl,
} from "../../../StyledComponents/TableContent/TableContent";
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
                renderSortControl={(getRenderProps) => <PageTableSortControl renderProps={getRenderProps} />}
                renderReorderGrip={() => <PageTableReorderGrip />}
                rows={() => PARTS}
                sortSignal={props.sortSignal}
                selectionSignal={props.selectionSignal}
                orderSignal={props.orderSignal}
                ariaLabel={"Parts with reorderable columns"}
                announcements={TABLE_ANNOUNCEMENTS}
                renderMarker={() => <PageTableMarker />}
            />
        </div>
    );
};

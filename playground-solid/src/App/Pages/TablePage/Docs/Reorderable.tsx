import { createMemo, createSignal } from "solid-js";

import type { TableSort } from "@thewaver/ss-components-solid";
import { Table } from "@thewaver/ss-components-solid";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableMarker } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../TablePageSolid.const";
import type { Part } from "../TablePageSolid.types";

export const ReorderableDocsExample = () => {
    const sortSignal = createSignal<TableSort | undefined>();
    const selectionSignal = createSignal<Part[]>([]);
    const orderSignal = createSignal<string[]>([]);

    const getColumns = createMemo(() => createPartColumns({ isReorderable: true }));

    return (
        <div class={styles.tableFrameShort}>
            <Table
                columns={getColumns}
                rows={PARTS}
                sort={sortSignal}
                selection={selectionSignal}
                order={orderSignal}
                ariaLabel={"Parts with reorderable columns"}
                announcements={TABLE_ANNOUNCEMENTS}
                renderMarker={() => <PageTableMarker />}
            />
        </div>
    );
};

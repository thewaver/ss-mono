import { createMemo, createSignal } from "solid-js";

import type { TableSort } from "@thewaver/ss-components-solid";
import { Table } from "@thewaver/ss-components-solid";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableMarker, PageTableResizer } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../TablePageSolid.const";
import type { Part } from "../TablePageSolid.types";

export const PinnedDocsExample = () => {
    const sortSignal = createSignal<TableSort | undefined>();
    const selectionSignal = createSignal<Part[]>([]);
    const widthsSignal = createSignal<Record<string, number>>({});
    const orderSignal = createSignal<string[]>([]);

    const getColumns = createMemo(() => createPartColumns({ isPinned: true, isResizable: true, isReorderable: true }));

    return (
        <div class={styles.tableFrameCapped}>
            <Table
                columns={getColumns}
                rows={PARTS}
                sort={sortSignal}
                selection={selectionSignal}
                widths={widthsSignal}
                order={orderSignal}
                ariaLabel={"Parts with pinned columns"}
                announcements={TABLE_ANNOUNCEMENTS}
                renderResizer={(getRenderProps) => <PageTableResizer renderProps={getRenderProps} />}
                renderMarker={() => <PageTableMarker />}
            />
        </div>
    );
};

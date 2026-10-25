import { createMemo, createSignal } from "solid-js";

import type { TableSort } from "@thewaver/ss-components-solid";
import { Table } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PARTS, createPartColumns } from "../TablePageSolid.const";
import type { Part, TableBasicDocsExampleProps } from "../TablePageSolid.types";

type Props = TableBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const sortSignal = createSignal<TableSort | undefined>();
    const selectionSignal = createSignal<Part[]>([]);

    const getColumns = createMemo(() => createPartColumns({}));

    return (
        <div class={styles.tableFrameShort}>
            <Table
                columns={getColumns}
                rows={PARTS}
                sort={sortSignal}
                selection={selectionSignal}
                selectionMode={props.selectionMode}
                isDisabled={props.isDisabled}
                ariaLabel={"Parts"}
            />
        </div>
    );
};

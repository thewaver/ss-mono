import type { Signal } from "solid-js";
import { createMemo } from "solid-js";

import { Table } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableResizer } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

type Props = TableExampleProps & { widths: Signal<Record<string, number>> };

export const ResizableExample = (props: Props) => {
    const getColumns = createMemo(() => createPartColumns({ isResizable: true }));

    return (
        <div class={styles.tableFrameShort}>
            <Table
                columns={getColumns}
                rows={() => PARTS}
                sort={props.sort}
                selection={props.selection}
                widths={props.widths}
                ariaLabel={"Parts with resizable columns"}
                renderResizer={(getRenderProps) => <PageTableResizer renderProps={getRenderProps} />}
            />
        </div>
    );
};

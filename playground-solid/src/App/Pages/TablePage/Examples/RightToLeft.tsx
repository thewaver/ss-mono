import type { Signal } from "solid-js";
import { createMemo } from "solid-js";

import { Table } from "@thewaver/ss-components-solid";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableMarker, PageTableResizer } from "../../../StyledComponents/TableContent/TableContent";
import type { TableExampleProps } from "../TablePage.types";
import { PARTS, createPartColumns } from "../TablePageSolid.const";

type Props = TableExampleProps & { widths: Signal<Record<string, number>>; order: Signal<string[]> };

export const RightToLeftExample = (props: Props) => {
    const getColumns = createMemo(() => createPartColumns({ isResizable: true, isReorderable: true }));

    return (
        <div dir={"rtl"} class={styles.tableFrameShort}>
            <Table
                columns={getColumns}
                rows={PARTS}
                sort={props.sort}
                selection={props.selection}
                widths={props.widths}
                order={props.order}
                ariaLabel={"Parts in a right-to-left box"}
                announcements={TABLE_ANNOUNCEMENTS}
                renderResizer={(getRenderProps) => <PageTableResizer renderProps={getRenderProps} />}
                renderMarker={() => <PageTableMarker />}
            />
        </div>
    );
};

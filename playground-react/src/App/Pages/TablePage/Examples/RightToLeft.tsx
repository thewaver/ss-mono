import { useMemo } from "react";

import { Table } from "@thewaver/ss-components-react";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableMarker, PageTableResizer } from "../../../StyledComponents/TableContent/TableContent";
import type { TableExampleProps } from "../TablePage.types";
import { PARTS, createPartColumns } from "../TablePageReact.const";

type Props = TableExampleProps & {
    widths: readonly [Record<string, number>, (widths: Record<string, number>) => void];
    order: readonly [string[], (order: string[]) => void];
};

export const RightToLeftExample = (props: Props) => {
    const columns = useMemo(() => createPartColumns({ isResizable: true, isReorderable: true }), []);

    return (
        <div dir={"rtl"} className={styles.tableFrameShort}>
            <Table
                columns={columns}
                rows={PARTS}
                sort={props.sort}
                selection={props.selection}
                widths={props.widths}
                order={props.order}
                ariaLabel={"Parts in a right-to-left box"}
                announcements={TABLE_ANNOUNCEMENTS}
                renderResizer={(renderProps) => <PageTableResizer renderProps={renderProps} />}
                renderMarker={() => <PageTableMarker />}
            />
        </div>
    );
};

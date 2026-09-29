import { useMemo } from "react";

import { Table } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableResizer } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

type Props = TableExampleProps & {
    widths: readonly [Record<string, number>, (widths: Record<string, number>) => void];
};

export const ResizableExample = (props: Props) => {
    const columns = useMemo(() => createPartColumns({ isResizable: true }), []);

    return (
        <div className={styles.tableFrameShort}>
            <Table
                columns={columns}
                rows={PARTS}
                sort={props.sort}
                selection={props.selection}
                widths={props.widths}
                ariaLabel={"Parts with resizable columns"}
                renderResizer={(renderProps) => <PageTableResizer renderProps={renderProps} />}
            />
        </div>
    );
};

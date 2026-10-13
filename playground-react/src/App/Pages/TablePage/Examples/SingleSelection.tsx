import { useMemo } from "react";

import { Table } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import type { TableExampleProps } from "../TablePage.types";
import { PARTS, createPartColumns } from "../TablePageReact.const";

export const SingleSelectionExample = (props: TableExampleProps) => {
    const columns = useMemo(() => createPartColumns({ isResizable: false }), []);

    return (
        <div className={styles.tableFrameShort}>
            <Table
                columns={columns}
                rows={PARTS}
                sort={props.sort}
                selection={props.selection}
                selectionMode={"single"}
                ariaLabel={"Parts, one at a time"}
            />
        </div>
    );
};

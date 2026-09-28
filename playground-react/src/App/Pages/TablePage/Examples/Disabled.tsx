import { useMemo } from "react";

import { Table } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

export const DisabledExample = (props: TableExampleProps) => {
    const columns = useMemo(() => createPartColumns({ isResizable: false }), []);

    return (
        <div className={styles.tableFrameShort}>
            <Table
                columns={columns}
                rows={PARTS}
                sortState={props.sortState}
                selectionState={props.selectionState}
                isDisabled={true}
                ariaLabel={"Parts, read only"}
            />
        </div>
    );
};

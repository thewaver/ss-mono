import { useMemo, useState } from "react";

import type { TableSort } from "@thewaver/ss-components-react";
import { Table } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PARTS, createPartColumns } from "../TablePageReact.const";
import type { Part, TableBasicDocsExampleProps } from "../TablePageReact.types";

type Props = TableBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const sortState = useState<TableSort | undefined>();
    const selectionState = useState<Part[]>([]);

    const columns = useMemo(() => createPartColumns({}), []);

    return (
        <div className={styles.tableFrameShort}>
            <Table
                columns={columns}
                rows={PARTS}
                sort={sortState}
                selection={selectionState}
                selectionMode={props.selectionMode}
                isDisabled={props.isDisabled}
                ariaLabel={"Parts"}
            />
        </div>
    );
};

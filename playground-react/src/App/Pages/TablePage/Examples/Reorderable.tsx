import { useMemo } from "react";

import { Table } from "@thewaver/ss-components-react";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableMarker } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

type Props = TableExampleProps & { order: readonly [string[], (order: string[]) => void] };

export const ReorderableExample = (props: Props) => {
    const columns = useMemo(() => createPartColumns({ isReorderable: true }), []);

    return (
        <div className={styles.tableFrameShort}>
            <Table
                columns={columns}
                rows={PARTS}
                sort={props.sort}
                selection={props.selection}
                order={props.order}
                ariaLabel={"Parts with reorderable columns"}
                announcements={TABLE_ANNOUNCEMENTS}
                renderMarker={() => <PageTableMarker />}
            />
        </div>
    );
};

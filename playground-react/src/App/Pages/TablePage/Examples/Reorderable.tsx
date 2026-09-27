import { useMemo } from "react";

import { Table } from "@thewaver/ss-components-react";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/TablePage/TablePage.css";

import { PageTableMarker } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

type Props = TableExampleProps & { orderState: readonly [string[], (order: string[]) => void] };

export const ReorderableExample = (props: Props) => {
    const columns = useMemo(() => createPartColumns({ isReorderable: true }), []);

    return (
        <div className={styles.tableFrameShort}>
            <Table
                columns={columns}
                rows={PARTS}
                sortState={props.sortState}
                selectionState={props.selectionState}
                orderState={props.orderState}
                ariaLabel={"Parts with reorderable columns"}
                announcements={TABLE_ANNOUNCEMENTS}
                renderMarker={() => <PageTableMarker />}
            />
        </div>
    );
};

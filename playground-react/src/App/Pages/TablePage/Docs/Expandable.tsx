import { useMemo, useState } from "react";

import type { TableSort } from "@thewaver/ss-components-react";
import { Table } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableDetailContent } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns, formatPrice } from "../TablePageReact.const";
import type { Part } from "../TablePageReact.types";

const ESTIMATED_ROW_HEIGHT = 33;

export const ExpandableDocsExample = () => {
    const sortState = useState<TableSort | undefined>();
    const selectionState = useState<Part[]>([]);
    const expandedState = useState<Part[]>([]);

    const columns = useMemo(() => createPartColumns({ isExpandable: true }), []);

    return (
        <div className={styles.tableFrameShort}>
            <Table
                columns={columns}
                rows={PARTS}
                sort={sortState}
                selection={selectionState}
                expanded={expandedState}
                ariaLabel={"Parts with details"}
                computeIsExpandable={(part) => part.stock > 0}
                computeEstimatedRowHeight={() => ESTIMATED_ROW_HEIGHT}
                renderDetail={(part, renderProps) => (
                    <PageTableDetailContent renderProps={renderProps}>
                        {`${part.name}, filed under ${part.category}: ${part.stock.toLocaleString("en-GB")} on the shelf at ${formatPrice(part.pricePence)} each, ${formatPrice(part.stock * part.pricePence)} held in all.`}
                    </PageTableDetailContent>
                )}
            />
        </div>
    );
};

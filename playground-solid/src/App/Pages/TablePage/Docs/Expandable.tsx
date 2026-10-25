import { createMemo, createSignal } from "solid-js";

import type { TableSort } from "@thewaver/ss-components-solid";
import { Table } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableDetailContent } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns, formatPrice } from "../TablePageSolid.const";
import type { Part } from "../TablePageSolid.types";

const ESTIMATED_ROW_HEIGHT = 33;

export const ExpandableDocsExample = () => {
    const sortSignal = createSignal<TableSort | undefined>();
    const selectionSignal = createSignal<Part[]>([]);
    const expandedSignal = createSignal<Part[]>([]);

    const getColumns = createMemo(() => createPartColumns({ isExpandable: true }));

    return (
        <div class={styles.tableFrameShort}>
            <Table
                columns={getColumns}
                rows={PARTS}
                sort={sortSignal}
                selection={selectionSignal}
                expanded={expandedSignal}
                ariaLabel={"Parts with details"}
                computeIsExpandable={(part) => part.stock > 0}
                computeEstimatedRowHeight={() => ESTIMATED_ROW_HEIGHT}
                renderDetail={(getPart, getRenderProps) => (
                    <PageTableDetailContent renderProps={getRenderProps}>
                        {`${getPart().name}, filed under ${getPart().category}: ${getPart().stock.toLocaleString("en-GB")} on the shelf at ${formatPrice(getPart().pricePence)} each, ${formatPrice(getPart().stock * getPart().pricePence)} held in all.`}
                    </PageTableDetailContent>
                )}
            />
        </div>
    );
};

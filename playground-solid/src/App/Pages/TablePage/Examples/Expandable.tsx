import type { Signal } from "solid-js";
import { createMemo } from "solid-js";

import { Table } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableDetailContent } from "../../../StyledComponents/TableContent/TableContent";
import type { Part, TableExampleProps } from "../TablePage.types";
import { PARTS, createPartColumns, formatPrice } from "../TablePageSolid.const";

const ESTIMATED_ROW_HEIGHT = 33;

type Props = TableExampleProps & { expanded: Signal<Part[]> };

export const ExpandableExample = (props: Props) => {
    const getColumns = createMemo(() => createPartColumns({ isExpandable: true }));

    return (
        <div class={styles.tableFrameShort}>
            <Table
                columns={getColumns}
                rows={PARTS}
                sort={props.sort}
                selection={props.selection}
                expanded={props.expanded}
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

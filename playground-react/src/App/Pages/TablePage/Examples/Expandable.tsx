import { useMemo } from "react";

import { Table } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageTableDetailContent } from "../../../StyledComponents/TableContent/TableContent";
import type { Part, TableExampleProps } from "../TablePage.types";
import { PARTS, createPartColumns, formatPrice } from "../TablePageReact.const";

const ESTIMATED_ROW_HEIGHT = 33;

type Props = TableExampleProps & { expanded: readonly [Part[], (rows: Part[]) => void] };

export const ExpandableExample = (props: Props) => {
    const columns = useMemo(() => createPartColumns({ isExpandable: true }), []);

    return (
        <div className={styles.tableFrameShort}>
            <Table
                columns={columns}
                rows={PARTS}
                sort={props.sort}
                selection={props.selection}
                expanded={props.expanded}
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

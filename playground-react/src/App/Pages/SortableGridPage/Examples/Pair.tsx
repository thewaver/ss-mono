import type { SortableGridItem } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/SortableGridPage/SortableGridPage.css";
import type { Gear } from "@thewaver/ss-playground-core/App/Pages/SortableGridPage/SortableGridPage.types";

import { QUIVER_COLUMNS, QUIVER_ROWS, STASH_COLUMNS, STASH_ROWS } from "../SortableGridPage.const";
import { InventoryExample } from "./Inventory";

type Props = {
    groupId: string;
    packState: readonly [SortableGridItem<Gear>[], (items: SortableGridItem<Gear>[]) => void];
    sideState: readonly [SortableGridItem<Gear>[], (items: SortableGridItem<Gear>[]) => void];
    sideLabel: string;
    sideEmptyText: string;
    isSideNarrow?: boolean;
    isSideLocked?: boolean;
    computeCanAccept?: (value: Gear, fromLabel: string) => boolean;
};

export const PairExample = (props: Props) => (
    <div className={styles.sortableGridPair}>
        <div className={styles.sortableGridStack}>
            <div className={styles.sortableGridCaption}>Pack</div>

            <InventoryExample
                groupId={props.groupId}
                itemsState={props.packState}
                ariaLabel={"Pack"}
                emptyText={"Empty pack"}
                isTurnable={true}
            />
        </div>

        <div className={styles.sortableGridStack}>
            <div className={styles.sortableGridCaption}>{props.sideLabel}</div>

            <InventoryExample
                groupId={props.groupId}
                itemsState={props.sideState}
                ariaLabel={props.sideLabel}
                emptyText={props.sideEmptyText}
                columns={props.isSideNarrow ? QUIVER_COLUMNS : STASH_COLUMNS}
                rows={props.isSideNarrow ? QUIVER_ROWS : STASH_ROWS}
                isTurnable={true}
                isLocked={props.isSideLocked ?? false}
                computeCanAccept={props.computeCanAccept}
            />
        </div>
    </div>
);

import type { Signal } from "solid-js";

import type { SortableGridItem } from "@thewaver/ss-components";

import { QUIVER_COLUMNS, QUIVER_ROWS, STASH_COLUMNS, STASH_ROWS } from "../SortableGridPage.const";
import type { Gear } from "../SortableGridPage.types";
import { InventoryExample } from "./Inventory";

import * as styles from "../SortableGridPage.css";

type Props = {
    groupId: string;
    packSignal: Signal<SortableGridItem<Gear>[]>;
    sideSignal: Signal<SortableGridItem<Gear>[]>;
    sideLabel: string;
    sideEmptyText: string;
    isSideNarrow?: boolean;
    isSideLocked?: () => boolean;
    computeCanAccept?: (value: Gear, fromLabel: string) => boolean;
};

export const PairExample = (props: Props) => (
    <div class={styles.sortableGridPair}>
        <div class={styles.sortableGridStack}>
            <div class={styles.sortableGridCaption}>Pack</div>

            <InventoryExample
                groupId={props.groupId}
                itemsSignal={props.packSignal}
                ariaLabel={"Pack"}
                emptyText={"Empty pack"}
                isTurnable={true}
            />
        </div>

        <div class={styles.sortableGridStack}>
            <div class={styles.sortableGridCaption}>{props.sideLabel}</div>

            <InventoryExample
                groupId={props.groupId}
                itemsSignal={props.sideSignal}
                ariaLabel={props.sideLabel}
                emptyText={props.sideEmptyText}
                columns={props.isSideNarrow ? QUIVER_COLUMNS : STASH_COLUMNS}
                rows={props.isSideNarrow ? QUIVER_ROWS : STASH_ROWS}
                isTurnable={true}
                isLocked={() => props.isSideLocked?.() ?? false}
                computeCanAccept={props.computeCanAccept}
            />
        </div>
    </div>
);

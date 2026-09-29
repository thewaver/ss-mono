<script lang="ts">
    import type { SortableGridItem } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.css";
    import type { Gear } from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.types";

    import { QUIVER_COLUMNS, QUIVER_ROWS, STASH_COLUMNS, STASH_ROWS } from "../SortableGridPage.const";
    import InventoryExample from "./Inventory.svelte";

    type Props = {
        groupId: string;
        pack: SortableGridItem<Gear>[];
        side: SortableGridItem<Gear>[];
        sideLabel: string;
        sideEmptyText: string;
        isSideNarrow?: boolean;
        isSideLocked?: boolean;
        computeCanAccept?: (value: Gear, fromLabel: string) => boolean;
    };

    let { pack = $bindable(), side = $bindable(), ...props }: Props = $props();
</script>

<div class={styles.sortableGridPair}>
    <div class={styles.sortableGridStack}>
        <div class={styles.sortableGridCaption}>Pack</div>

        <InventoryExample
            groupId={props.groupId}
            bind:items={pack}
            ariaLabel={"Pack"}
            emptyText={"Empty pack"}
            isTurnable={true}
        />
    </div>

    <div class={styles.sortableGridStack}>
        <div class={styles.sortableGridCaption}>{props.sideLabel}</div>

        <InventoryExample
            groupId={props.groupId}
            bind:items={side}
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

<script lang="ts">
    import type { SortableItem } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.css";
    import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

    import CardsExample from "./Cards.svelte";

    type Props = {
        groupId: string;
        hand: SortableItem<Card>[];
        board: SortableItem<Card>[];
        isBoardLocked?: boolean;
        computeCanAccept?: (value: Card, fromLabel: string) => boolean;
    };

    let { hand = $bindable(), board = $bindable(), ...props }: Props = $props();
</script>

<div class={styles.sortablePair}>
    <div class={styles.sortableColumn}>
        <div class={styles.sortableCaption}>Hand</div>

        <CardsExample groupId={props.groupId} bind:items={hand} ariaLabel={"Hand"} emptyText={"No cards"} />
    </div>

    <div class={styles.sortableColumn}>
        <div class={styles.sortableCaption}>Board</div>

        <CardsExample
            groupId={props.groupId}
            bind:items={board}
            ariaLabel={"Board"}
            emptyText={"Play a card here"}
            isLocked={props.isBoardLocked ?? false}
            computeCanAccept={props.computeCanAccept}
        />
    </div>
</div>

<script lang="ts">
    import type { SortableItem } from "@thewaver/ss-components-svelte";
    import { BOARD, CHEAP_ONLY, HAND, QUEUE } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";
    import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageSortableRoom from "../../StyledComponents/SortableContent/PageSortableRoom.svelte";
    import CardsExample from "./Examples/Cards.svelte";
    import PairExample from "./Examples/Pair.svelte";
    import RightToLeftExample from "./Examples/RightToLeft.svelte";
    import RingExample from "./Examples/Ring.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/SortablePage/Examples";

    const names = (items: SortableItem<Card>[]) => items.map((item) => item.value.name).join(", ") || "empty";

    let queue = $state.raw<SortableItem<Card>[]>(QUEUE);
    let row = $state.raw<SortableItem<Card>[]>(HAND);
    let rightToLeft = $state.raw<SortableItem<Card>[]>(HAND);

    let hand = $state.raw<SortableItem<Card>[]>(HAND);
    let board = $state.raw<SortableItem<Card>[]>(BOARD);

    let pickyHand = $state.raw<SortableItem<Card>[]>(HAND);
    let pickyBoard = $state.raw<SortableItem<Card>[]>([]);

    let lockedHand = $state.raw<SortableItem<Card>[]>(HAND);
    let lockedBoard = $state.raw<SortableItem<Card>[]>(BOARD);

    let disabled = $state.raw<SortableItem<Card>[]>(HAND);
    let ring = $state.raw<SortableItem<Card>[]>(QUEUE);

    const examples: ExampleDefs[] = [
        {
            key: "reorder",
            name: "Reordering one list",
            readout: () =>
                `order: ${names(queue)} — Second is disabled, so arrows skip it and it cannot be picked up`,
            component: reorderExample,
            path: `${EXAMPLES_ROOT}/Cards.svelte`,
        },
        {
            key: "row",
            name: "Laid out in a row",
            readout: () => `order: ${names(row)} — left and right walk it, because the direction decides the keys`,
            component: rowExample,
            path: `${EXAMPLES_ROOT}/Cards.svelte`,
        },
        {
            key: "rightToLeft",
            name: "A row in a right-to-left box",
            readout: () =>
                `order: ${names(rightToLeft)} — the box around the row sets dir="rtl", so the cards run from the right and a carried card moves on to a later place with the left arrow`,
            component: rightToLeftExample,
            path: `${EXAMPLES_ROOT}/RightToLeft.svelte`,
        },
        {
            key: "ring",
            name: "Reordering round a ring",
            readout: () =>
                `order: ${names(ring)} — dropping picks the nearest place rather than comparing one axis, because a ring has no axis to compare`,
            component: ringExample,
            path: `${EXAMPLES_ROOT}/Ring.svelte`,
        },
        {
            key: "pair",
            name: "Between two lists",
            readout: () => `hand: ${names(hand)} | board: ${names(board)}`,
            component: pairExample,
            path: `${EXAMPLES_ROOT}/Pair.svelte`,
        },
        {
            key: "picky",
            name: "A list that refuses some cards",
            readout: () =>
                `hand: ${names(pickyHand)} | board: ${names(pickyBoard)} — the board takes nothing costing more than ${CHEAP_ONLY}`,
            component: pickyExample,
            path: `${EXAMPLES_ROOT}/Pair.svelte`,
        },
        {
            key: "locked",
            name: "A list that takes nothing",
            readout: () =>
                `hand: ${names(lockedHand)} | board: ${names(lockedBoard)} — the board can be reordered but accepts nothing from outside`,
            component: lockedExample,
            path: `${EXAMPLES_ROOT}/Pair.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `order: ${names(disabled)} — nothing moves, by pointer or by key`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Cards.svelte`,
        },
    ];
</script>

{#snippet reorderExample()}
    <PageSortableRoom>
        <CardsExample groupId={"queue"} bind:items={queue} ariaLabel={"Queue"} emptyText={"No cards"} />
    </PageSortableRoom>
{/snippet}

{#snippet rowExample()}
    <PageSortableRoom>
        <CardsExample
            groupId={"row"}
            bind:items={row}
            ariaLabel={"Row"}
            emptyText={"No cards"}
            orientation={"horizontal"}
        />
    </PageSortableRoom>
{/snippet}

{#snippet rightToLeftExample()}
    <RightToLeftExample bind:items={rightToLeft} />
{/snippet}

{#snippet ringExample()}
    <PageSortableRoom>
        <RingExample bind:items={ring} />
    </PageSortableRoom>
{/snippet}

{#snippet pairExample()}
    <PairExample groupId={"pair"} bind:hand bind:board />
{/snippet}

{#snippet pickyExample()}
    <PairExample
        groupId={"picky"}
        bind:hand={pickyHand}
        bind:board={pickyBoard}
        computeCanAccept={(value) => value.cost <= CHEAP_ONLY}
    />
{/snippet}

{#snippet lockedExample()}
    <PairExample groupId={"locked"} bind:hand={lockedHand} bind:board={lockedBoard} isBoardLocked={true} />
{/snippet}

{#snippet disabledExample()}
    <PageSortableRoom>
        <CardsExample
            groupId={"disabled"}
            bind:items={disabled}
            ariaLabel={"Disabled list"}
            emptyText={"No cards"}
            isDisabled={true}
        />
    </PageSortableRoom>
{/snippet}

<PageExamples items={examples} minColumnWidth={520} />

<script lang="ts">
    import { onDestroy } from "svelte";

    import { PAGINATOR_DEFAULTS, type PaginatorControlEntry, PaginatorUtils } from "@thewaver/ss-components";

    import PlacementBox from "../../Primitives/PlacementBox/PlacementBox.svelte";
    import { setPaginatorContext } from "./Paginator.context.js";
    import type { PaginatorRootProps } from "./Paginator.types.js";

    let props: PaginatorRootProps = $props();

    let registered: PaginatorControlEntry[] = [];
    let entries = $state.raw<PaginatorControlEntry[]>([]);
    let orderVersion = $state(0);

    const setEntries = (next: PaginatorControlEntry[]) => {
        registered = next;
        entries = next;
    };

    const pageCount = $derived(
        PaginatorUtils.computePageCount(props.itemCount, props.pageSize ?? PAGINATOR_DEFAULTS.pageSize),
    );

    const isDisabled = $derived(props.isDisabled ?? false);

    const orderedEntries = $derived.by(() => {
        orderVersion;

        return PaginatorUtils.orderEntries(entries);
    });

    const layout = $derived(props.computeLayout?.({ itemCount: entries.length }));

    setPaginatorContext({
        getPage: () => props.page,
        getPageCount: () => pageCount,
        getIsDisabled: () => isDisabled,
        getLinkComponent: () => props.linkComponent,
        computeHref: (page) => props.computeHref?.(page),
        computePlacement: (entry) => PaginatorUtils.computePlacement(orderedEntries, layout, entry),
        computeStackAt: (entry) => PaginatorUtils.computeStackAt(orderedEntries, entry),
        goTo: (page) => {
            if (page === props.page) return;

            props.onPageChange?.(page);
        },
        register: (entry) => {
            setEntries([...registered, entry]);

            onDestroy(() => setEntries(registered.filter((item) => item !== entry)));
        },
        reorder: () => {
            orderVersion += 1;
        },
    });
</script>

<nav aria-label={props.ariaLabel}>
    {#if layout}
        <PlacementBox {layout} computeEffect={props.computeEffect}>
            {@render props.children?.()}
        </PlacementBox>
    {:else}
        {@render props.children?.()}
    {/if}
</nav>

<script lang="ts" generics="T">
    import {
        type InteractionFlags,
        type MenuItemFlags,
        type PlacementLayoutDefs,
        type PlacementRect,
        WheelMenuUtils,
    } from "@thewaver/ss-components";

    import Menu from "../Menu/Menu.svelte";
    import type { MenuItem } from "../Menu/Menu.types.js";
    import type { WheelMenuProps } from "./WheelMenu.types.js";

    type WheelValue = T | typeof WheelMenuUtils.CLOSER_VALUE;

    let {
        visibility = $bindable(false),
        checked = $bindable(),
        ref = $bindable(),
        ...props
    }: WheelMenuProps<T> = $props();

    const hasCloser = $derived(props.closerDefs !== undefined);

    const computeLayout = (defs: PlacementLayoutDefs) =>
        WheelMenuUtils.computeLayout(defs, {
            items: props.items,
            spreadDegrees: props.spreadDegrees,
            holeRadius: props.holeRadius,
            bandWidth: props.bandWidth,
            levelGap: props.levelGap,
            layoutDefs: props.layoutDefs,
            hasCloser,
        });

    const menuItems = $derived(
        WheelMenuUtils.withCloser(props.items, props.closerDefs?.ariaLabel) as MenuItem<WheelValue>[],
    );

    const computeCustomText = (item: MenuItem<WheelValue>) =>
        WheelMenuUtils.getIsCloser(item.value) ? "" : (props.computeCustomText?.(item as MenuItem<T>) ?? "");
</script>

{#snippet renderItem(
    item: MenuItem<WheelValue>,
    flags: InteractionFlags<MenuItemFlags>,
    placement: PlacementRect | undefined,
)}
    {#if WheelMenuUtils.getIsCloser(item.value)}
        {@render props.closerDefs?.renderContent(flags)}
    {:else}
        {@render props.renderItem(item as MenuItem<T>, flags, placement)}
    {/if}
{/snippet}

<Menu
    {...props}
    bind:visibility
    bind:checked={() => checked, (next) => (checked = next as T[])}
    bind:ref
    items={menuItems}
    {computeLayout}
    computeCustomText={props.computeCustomText || hasCloser ? computeCustomText : undefined}
    {renderItem}
    onActivate={(value) => {
        if (WheelMenuUtils.getIsCloser(value)) return;

        props.onActivate(value);
    }}
/>

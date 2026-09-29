<script lang="ts" generics="T">
    import { type InteractionFlags, type MenuItemFlags, MenuUtils } from "@thewaver/ss-components";

    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { MenuEntryProps } from "./Menu.types.js";
    import MenuItemView from "./MenuItemView.svelte";
    import MenuLevel from "./MenuLevel.svelte";

    let props: MenuEntryProps<T> = $props();

    let itemElement = $state<HTMLElement>();

    const level = $derived(props.level);
    const itemId = $derived(`${level.id}-item-${props.index}`);
    const submenuId = $derived(`${level.id}-submenu-${props.index}`);
    const path = $derived([...level.path, props.index]);

    $effect(() => {
        if (!props.isHighlighted || !itemElement) return;

        MenuUtils.revealItem(itemElement);
    });

    const extraFlags: MenuItemFlags = $derived({
        isHighlighted: props.isHighlighted,
        hasSubmenu: props.hasSubmenu,
        isBack: props.isBack,
        isOpen: props.isSubmenuOpen,
        isChecked: level.checkedValues.includes(props.item.value),
    });
</script>

<InteractionWrapper
    bind:ref={itemElement}
    sizing="fill"
    isDisabled={props.item.isDisabled ?? false}
    isReachableWhenDisabled={props.item.isReachableWhenDisabled ?? false}
    isTabbable={false}
    tooltipDefs={props.item.tooltipDefs}
    {extraFlags}
>
    {#snippet renderControl(attachElement, flags)}
        {#snippet itemContent(itemFlags: InteractionFlags<MenuItemFlags>)}
            {@render level.renderItem(props.item, itemFlags, props.placement)}
        {/snippet}

        <MenuItemView
            kind={MenuUtils.getKind(props.item)}
            {attachElement}
            id={itemId}
            ariaLabel={props.item.ariaLabel ?? ""}
            {submenuId}
            {flags}
            isRegion={props.placement?.sector !== undefined}
            renderContent={itemContent}
            onActivate={() => props.onActivate(props.index)}
            onHover={(point) => props.onHover(props.index, point)}
        />

        {#if props.hasSubmenu}
            <MenuLevel
                id={submenuId}
                labelledBy={itemId}
                items={props.item.items!}
                isOpen={props.isSubmenuOpen}
                direction={level.direction}
                {path}
                parentExtent={props.levelExtent}
                rootExtent={props.rootExtent}
                layoutSize={level.layoutSize}
                parentPlacement={props.placement}
                anchorRef={props.isLaidOut ? level.anchorRef : itemElement}
                anchorRect={props.isLaidOut ? level.anchorRect : undefined}
                placement={props.isLaidOut ? level.placement : level.submenuPlacement}
                offset={props.isLaidOut ? level.offset : level.submenuOffset}
                submenuPlacement={level.submenuPlacement}
                submenuOffset={level.submenuOffset}
                submenuMode={level.submenuMode}
                submenuOpensOn={level.submenuOpensOn}
                openerItem={props.item}
                reservedScreenSize={level.reservedScreenSize}
                transitionDurationMs={level.transitionDurationMs}
                openerFlags={flags}
                checkedValues={level.checkedValues}
                computeLayout={level.computeLayout}
                computeEffect={level.computeEffect}
                computeCustomText={level.computeCustomText}
                renderItem={level.renderItem}
                renderPopup={level.renderPopup}
                onPick={level.onPick}
                onClose={props.onSubmenuClose}
                onDismiss={level.onDismiss}
            />
        {/if}
    {/snippet}
</InteractionWrapper>

<script lang="ts" generics="T">
    import { flushSync, untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        DismisserUtils,
        type InteractionSizing,
        type MenuItemKind,
        type MenuTriggerRole,
        MenuUtils,
        TOOLBAR_DEFAULTS,
        type ToolbarAction,
        ToolbarUtils,
        ToolbarStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { NavigatorSvelteUtils } from "../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import PlacementBox from "../../Primitives/PlacementBox/PlacementBox.svelte";
    import PlacementItem from "../../Primitives/PlacementItem/PlacementItem.svelte";
    import { createHeldValue } from "../../Utils/bindableUtils.svelte.js";
    import Menu from "../Menus/Menu/Menu.svelte";
    import type { MenuItem } from "../Menus/Menu/Menu.types.js";
    import type { ToolbarButtonsProps, ToolbarCompositeProps, ToolbarMenusProps } from "./Toolbar.types.js";

    const OVERFLOW_STOP = ToolbarUtils.OVERFLOW_STOP;
    const NO_RADIO_GROUP: never[] = [];
    const ROW_SIZING: InteractionSizing = "fit-content";
    const PLACED_SIZING: InteractionSizing = "fill";
    const PRESSED_ITEM_KIND: MenuItemKind = "checkbox";
    const WORD_ROLE: MenuTriggerRole = "menuitem";

    type CompositeProps = ToolbarCompositeProps<T> &
        Pick<ToolbarButtonsProps<T>, "pressedValues"> &
        Pick<ToolbarMenusProps<T>, "checked">;

    let { pressedValues = $bindable(), checked = $bindable(), ...props }: CompositeProps = $props();

    const [getPressedValues, setPressedValues] = createHeldValue([
        () => pressedValues,
        (next) => {
            pressedValues = next;
        },
    ]);

    let root = $state<HTMLDivElement>();
    let overflowElement = $state<HTMLElement>();
    let itemElements = $state.raw<(HTMLElement | undefined)[]>([]);
    let focusedStop = $state<number>();
    let openStop = $state<number>();

    const menusProps = $derived(props.role === "menubar" ? props : undefined);
    const buttonsProps = $derived(props.role === "toolbar" ? props : undefined);
    const isMenubar = $derived(menusProps !== undefined);
    const gap = $derived(props.gap ?? TOOLBAR_DEFAULTS.gap);
    const actions: ToolbarAction<T>[] = $derived(props.actions);
    const actionCount = $derived(actions.length);
    const pressed = $derived(buttonsProps ? getPressedValues() : undefined);
    const isPressable = $derived(pressed !== undefined);

    const layout = $derived(props.computeLayout?.({ itemCount: actionCount }));
    const isPlaced = $derived(layout !== undefined);

    const getRootSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);
    const getItemSizes = ElementObserverSvelteUtils.createBorderBoxSizeListObserver(() => itemElements);
    const getOverflowSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => overflowElement);

    const direction = NavigatorSvelteUtils.createDirection(() => root ?? undefined);

    const hasMeasured = $derived(
        ToolbarUtils.computeHasMeasured(isPlaced, getRootSize().width, getItemSizes().length, actionCount),
    );

    const cut = $derived(
        isPlaced
            ? ToolbarUtils.computeUncut(actions.length)
            : ToolbarUtils.computeCut({
                  widths: getItemSizes().map((size) => size.width),
                  collapses: actions.map((action) => action.collapse ?? "auto"),
                  available: getRootSize().width,
                  overflowWidth: getOverflowSize().width,
                  gap,
              }),
    );

    const overflowItems = $derived(
        ToolbarUtils.computeOverflowItems<T, MenuItem<T>>(props.actions, cut.collapsedIndexes, {
            hasSubmenus: isMenubar,
            isPressable,
        }) as MenuItem<T>[],
    );

    const hasOverflow = $derived(overflowItems.length > 0);

    const stops = $derived(ToolbarUtils.computeStops(actions, cut.shownIndexes));

    const rovingStop = $derived(ToolbarUtils.computeRovingStop(stops, focusedStop, hasOverflow));

    const setItemRef = (index: number, element: HTMLElement | undefined) =>
        untrack(() => {
            if (itemElements[index] === element) return;

            const next = [...itemElements];

            next[index] = element;
            itemElements = next;
        });

    const focusStop = (stop: number) => {
        focusedStop = stop;

        if (stop === OVERFLOW_STOP) overflowElement?.focus();
        else itemElements[stop]?.focus();
    };

    const setStopOpen = (stop: number, isOpen: boolean) => {
        openStop = ToolbarUtils.computeNextOpenStop(openStop, stop, isOpen);
    };

    $effect(() => {
        const focused = focusedStop;
        const step = ToolbarUtils.computeFocusLanding(stops, focused, hasOverflow);

        if (focused === undefined || step === undefined) return;

        untrack(() => {
            const hadFocus = itemElements[focused]?.contains(document.activeElement);

            focusedStop = step.landing;

            if (!hadFocus || step.landing === undefined) return;

            focusStop(step.landing);
        });
    });

    $effect(() => {
        const open = openStop;

        if (open === undefined) return;
        if (ToolbarUtils.getIsStopPresent(open, stops, hasOverflow)) return;

        openStop = undefined;
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.defaultPrevented) return;

        const step = ToolbarUtils.computeKeyStep(e.key, {
            isFromRow: e.target instanceof Node && (root?.contains(e.target) ?? false),
            stops,
            hasOverflow,
            openStop: isMenubar ? openStop : undefined,
            rovingStop,
            isPlaced,
            direction: direction(),
        });

        if (step === undefined) return;

        e.preventDefault();

        if (!step.isSwitch) {
            focusStop(step.stop);

            return;
        }

        openStop = undefined;
        flushSync();
        focusStop(step.stop);
        openStop = step.stop;
    };

    $effect(() => {
        if (!isMenubar || openStop === undefined) return;

        return untrack(() =>
            on(window, "keydown", (e) => {
                const target = e.target instanceof Node ? e.target : null;

                if (!target || root?.contains(target)) return;
                if (!DismisserUtils.getIsWithinOwnedLayer(target, [root])) return;

                handleKeyDown(e);
            }),
        );
    });

    const pressAction = (value: T) => {
        const current = getPressedValues();

        if (current !== undefined) {
            setPressedValues(MenuUtils.computeNextChecked(current, { value, kind: PRESSED_ITEM_KIND }, NO_RADIO_GROUP));
        }

        props.onActivate(value);
    };

    const getSizingAt = (index: number) => (layout?.placements[index] === undefined ? ROW_SIZING : PLACED_SIZING);
</script>

{#snippet control(action: ToolbarAction<T>, index: number)}
    {#if menusProps}
        {@const word = menusProps.actions[index]}
        <Menu
            items={word.items}
            sizing={getSizingAt(index)}
            isDisabled={word.isDisabled ?? false}
            isFocusableWhenDisabled={word.isReachableWhenDisabled ?? false}
            isTabbable={index === rovingStop}
            bind:visibility={() => openStop === index, (isOpen) => setStopOpen(index, isOpen)}
            bind:checked
            submenuOffset={menusProps.submenuOffset}
            triggerRole={WORD_ROLE}
            bind:ref={() => itemElements[index], (element) => setItemRef(index, element)}
            renderItem={menusProps.renderItem}
            renderPopup={menusProps.renderPopup}
            onActivate={props.onActivate}
        >
            {#snippet renderContent(flags)}
                {@render menusProps.renderAction(word, flags)}
            {/snippet}
        </Menu>
    {:else if buttonsProps}
        <InteractionWrapper
            sizing={getSizingAt(index)}
            isDisabled={action.isDisabled ?? false}
            isFocusableWhenDisabled={action.isReachableWhenDisabled ?? false}
            isPressed={pressed?.includes(action.value)}
            isTabbable={index === rovingStop}
            bind:ref={() => itemElements[index], (element) => setItemRef(index, element)}
            onActivation={() => pressAction(action.value)}
        >
            {#snippet renderControl(attachElement, flags)}
                <button
                    {@attach attachElement}
                    type="button"
                    class={styles.toolbarButton}
                    aria-disabled={flags.isDisabled || undefined}
                    aria-pressed={flags.isPressed}
                >
                    {@render buttonsProps.renderAction(action, flags)}
                </button>
            {/snippet}
        </InteractionWrapper>
    {/if}
{/snippet}

{#snippet items()}
    {#each actions as action, index (index)}
        {@const placement = layout?.placements[index]}
        {#if placement}
            <PlacementItem {placement}>
                {@render control(action, index)}
            </PlacementItem>
        {:else}
            {@const isShown = cut.shownIndexes.includes(index)}
            <div
                class={[styles.toolbarItem, isShown ? "" : styles.toolbarMeasuredItem]}
                role="presentation"
                aria-hidden={isShown ? undefined : "true"}
                inert={isShown ? undefined : true}
            >
                {@render control(action, index)}
            </div>
        {/if}
    {/each}
{/snippet}

<div
    bind:this={root}
    class={styles.toolbarRoot}
    style:gap={`${gap}px`}
    style:visibility={hasMeasured ? undefined : "hidden"}
    role={props.role}
    aria-label={props.ariaLabel}
    onkeydown={handleKeyDown}
    onfocusin={(e) => {
        const stop = ToolbarUtils.computeStopAt(e.target, itemElements, overflowElement);

        if (stop !== undefined) focusedStop = stop;
    }}
>
    {#if layout}
        <PlacementBox {layout} computeEffect={props.computeEffect}>
            {@render items()}
        </PlacementBox>
    {:else}
        {@render items()}
    {/if}

    <div
        class={[styles.toolbarItem, hasOverflow ? "" : styles.toolbarMeasuredItem]}
        role="presentation"
        aria-hidden={hasOverflow ? undefined : "true"}
        inert={hasOverflow ? undefined : true}
    >
        <Menu
            items={overflowItems}
            ariaLabel={props.overflowAriaLabel}
            isTabbable={rovingStop === OVERFLOW_STOP}
            bind:visibility={() => openStop === OVERFLOW_STOP, (isOpen) => setStopOpen(OVERFLOW_STOP, isOpen)}
            bind:checked={
                () => (isMenubar ? checked : getPressedValues()),
                (next) => {
                    if (isMenubar) checked = next;
                    else setPressedValues(next);
                }
            }
            submenuOffset={menusProps?.submenuOffset}
            triggerRole={isMenubar ? WORD_ROLE : undefined}
            bind:ref={overflowElement}
            renderContent={props.renderOverflowTrigger}
            renderItem={menusProps ? menusProps.renderItem : buttonsProps!.renderOverflowItem}
            renderPopup={menusProps ? menusProps.renderPopup : buttonsProps!.renderOverflowPopup}
            onActivate={props.onActivate}
        />
    </div>
</div>

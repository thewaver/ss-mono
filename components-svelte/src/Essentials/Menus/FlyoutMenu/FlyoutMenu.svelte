<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";
    import { on } from "svelte/events";

    import {
        type DismisserReason,
        FLYOUT_MENU_DEFAULTS,
        FloaterStyles as floaterStyles,
        type FlyoutMenuEntryRecord,
        FlyoutMenuStyles as styles,
        FlyoutMenuUtils,
        FocusManagerUtils,
        HoverCardUtils,
        type HoverIntentHandle,
        HoverIntentUtils,
        InteractionTrackerUtils,
        OverflowUtils,
    } from "@thewaver/ss-components";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { AnchorSvelteUtils } from "../../../Abstracts/Anchor/AnchorSvelte.utils.svelte.js";
    import { DismisserSvelteUtils } from "../../../Abstracts/Dismisser/DismisserSvelte.utils.svelte.js";
    import { ElementFaderSvelteUtils } from "../../../Abstracts/ElementFader/ElementFaderSvelte.utils.svelte.js";
    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { FloaterSvelteUtils } from "../../../Abstracts/Floater/FloaterSvelte.utils.svelte.js";
    import { HoverIntentSvelteUtils } from "../../../Abstracts/HoverIntent/HoverIntentSvelte.utils.svelte.js";
    import { getViewportContext } from "../../../Abstracts/Viewport/Viewport.context.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { attachPortal } from "../../../Utils/portalUtils.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { FlyoutMenuProps } from "./FlyoutMenu.types.js";
    import FlyoutMenuCollapsedEntry from "./FlyoutMenuCollapsedEntry.svelte";
    import FlyoutMenuEntry from "./FlyoutMenuEntry.svelte";
    import FlyoutMenuLinkList from "./FlyoutMenuLinkList.svelte";
    import FlyoutMenuToggle from "./FlyoutMenuToggle.svelte";

    const OVERFLOW_INDEX = FlyoutMenuUtils.OVERFLOW_INDEX;
    const TAB_KEY = "Tab";

    let props: FlyoutMenuProps<T> = $props();

    const viewportContext = getViewportContext();
    const panelId = $props.id();
    const delayGroup = HoverIntentUtils.createDelayGroup();

    const toggleRefs = new Map<number, HTMLElement>();
    const hoverIntents = new Map<number, HoverIntentHandle>();

    let rootRef = $state<HTMLElement>();
    let listRef = $state<HTMLElement>();
    let entryElements = $state.raw<(HTMLElement | undefined)[]>([]);
    let overflowElement = $state<HTMLElement>();
    let panelRef = $state<HTMLElement>();
    let linksRef = $state<HTMLElement>();
    let openIndex = $state<number>();
    let shownIndex = $state<number>();
    let isPressOpened = $state(false);
    let isHoverOpened = $state(false);
    let hoveredIndex = $state<number>();
    let focusVisibleIndex = $state<number>();
    let hoveredItem = $state<HTMLElement>();
    let focusVisibleItem = $state<HTMLElement>();
    let isGliding = $state(false);
    let expandedValues = $state.raw<T[]>([]);

    const entries: FlyoutMenuEntryRecord<T>[] = $derived(props.entries);
    const gap = $derived(props.gap ?? FLYOUT_MENU_DEFAULTS.gap);
    const transitionDurationMs = $derived(props.transitionDurationMs ?? FLYOUT_MENU_DEFAULTS.transitionDurationMs);
    const hoverShowDelayMs = $derived(props.hoverShowDelayMs ?? FLYOUT_MENU_DEFAULTS.hoverShowDelayMs);
    const skipDelayWindowMs = $derived(props.skipDelayWindowMs ?? FLYOUT_MENU_DEFAULTS.skipDelayWindowMs);
    const floaterTransitionDurationMs = $derived(
        props.floaterTransitionDurationMs ?? FLYOUT_MENU_DEFAULTS.floaterTransitionDurationMs,
    );

    const getListSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => listRef ?? undefined);
    const getEntrySizes = ElementObserverSvelteUtils.createBorderBoxSizeListObserver(() => entryElements);
    const getOverflowSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => overflowElement ?? undefined);
    const getLinksSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => linksRef ?? undefined);

    const panelSize = $derived(getLinksSize().width > 0 ? getLinksSize() : undefined);

    const hasMeasured = $derived(
        OverflowUtils.computeHasMeasured(false, getListSize().width, getEntrySizes().length, entries.length),
    );

    const cut = $derived(
        OverflowUtils.computeCut({
            widths: getEntrySizes().map((size) => size.width),
            collapses: entries.map((entry) => entry.collapse ?? "auto"),
            available: getListSize().width,
            overflowWidth: getOverflowSize().width,
            gap,
        }),
    );

    const collapsedEntries = $derived(FlyoutMenuUtils.computeCollapsedEntries(entries, cut.collapsedIndexes));

    const hasOverflow = $derived(collapsedEntries.length > 0);

    const getIsShown = (index: number) => cut.shownIndexes.includes(index);

    const getEntryElement = (index: number) =>
        (index === OVERFLOW_INDEX ? overflowElement : entryElements[index]) ?? undefined;

    const getAnchorRef = () => (shownIndex === undefined ? undefined : getEntryElement(shownIndex));

    const getHasFocusInside = () => HoverCardUtils.getHasFocusInside(panelRef ?? undefined);

    const setEntryRef = (index: number, element: HTMLElement | undefined) =>
        untrack(() => {
            if (entryElements[index] === element) return;

            const next = [...entryElements];

            next[index] = element;
            entryElements = next;
        });

    const setToggleRef = (index: number, element: HTMLElement | undefined) => {
        if (element) toggleRefs.set(index, element);
        else toggleRefs.delete(index);
    };

    const recordHoverIntent = (index: number, handle: HoverIntentHandle) => {
        hoverIntents.set(index, handle);

        return () => {
            if (hoverIntents.get(index) === handle) hoverIntents.delete(index);
        };
    };

    const fader = ElementFaderSvelteUtils.createFader(() => openIndex !== undefined, {
        getTransitionDurationMs: () => transitionDurationMs,
        getRef: () => panelRef ?? undefined,
    });

    const position = AnchorSvelteUtils.createPortalPosition(getAnchorRef, fader.getIsVisible, {
        getPlacement: () => props.placement ?? FLYOUT_MENU_DEFAULTS.placement,
        getOffset: () => props.offset,
    });

    const bridge = $derived(HoverIntentUtils.computeBridgeInsets(position.getPlacement(), props.offset));

    const entryFloater = FloaterSvelteUtils.create({
        getIsEnabled: () => props.renderHighlightFloater !== undefined,
        getContainer: () => rootRef ?? undefined,
        getTarget: () => {
            const index = hoveredIndex ?? openIndex ?? focusVisibleIndex;

            return index === undefined ? undefined : getEntryElement(index);
        },
        getTransitionDurationMs: () => floaterTransitionDurationMs,
    });

    const panelFloater = FloaterSvelteUtils.create({
        getIsEnabled: () => props.renderHighlightFloater !== undefined,
        getContainer: () => linksRef ?? undefined,
        getTarget: () => hoveredItem ?? focusVisibleItem,
        getTransitionDurationMs: () => floaterTransitionDurationMs,
    });

    const findEntryIndex = (target: EventTarget | null | undefined) => {
        const entry = target instanceof Element ? target.closest(`.${styles.flyoutMenuEntry}`) : null;

        if (!(entry instanceof HTMLElement)) return undefined;
        if (entry === overflowElement) return OVERFLOW_INDEX;

        const index = entryElements.indexOf(entry);

        return index === -1 ? undefined : index;
    };

    const findPanelItem = (target: EventTarget | null | undefined) => {
        const item = target instanceof Element ? target.closest(`.${styles.flyoutMenuPanelItem}`) : null;

        return item instanceof HTMLElement ? item : undefined;
    };

    const readFocusVisible = (target: EventTarget | null) =>
        target instanceof HTMLElement && InteractionTrackerUtils.computeIsFocusVisible(target) ? target : undefined;

    const close = () => {
        if (openIndex !== undefined) hoverIntents.get(openIndex)?.cancel();

        openIndex = undefined;
    };

    const setIsOpenFromHover = (index: number, isOpen: boolean) => {
        if (isOpen && FlyoutMenuUtils.getIsHoverSwitchRefused(openIndex, index, getHasFocusInside())) return;

        if (isOpen) isPressOpened = false;
        if (isOpen && openIndex !== index) isHoverOpened = true;

        openIndex = FlyoutMenuUtils.computeNextOpenIndex(openIndex, index, isOpen);
    };

    const toggle = (index: number) => {
        const isOpen = openIndex !== index || isHoverOpened;

        hoverIntents.get(index)?.cancel();
        isHoverOpened = false;
        isPressOpened = isOpen;
        openIndex = FlyoutMenuUtils.computeNextOpenIndex(openIndex, index, isOpen);
    };

    const toggleExpanded = (value: T) => {
        expandedValues = expandedValues.includes(value)
            ? expandedValues.filter((expanded) => expanded !== value)
            : [...expandedValues, value];
    };

    const handleToggleKeyDown = (index: number, e: KeyboardEvent) => {
        if (e.key !== TAB_KEY || e.shiftKey || openIndex !== index) return;

        const panel = panelRef;
        const first = panel && FocusManagerUtils.getFirstFocusableChild(panel);

        if (!first) return;

        e.preventDefault();
        first.focus({ preventScroll: true });
    };

    recordHoverIntent(
        OVERFLOW_INDEX,
        HoverIntentSvelteUtils.create(
            () => (hasOverflow ? (overflowElement ?? undefined) : undefined),
            [() => openIndex === OVERFLOW_INDEX, (isOpen) => setIsOpenFromHover(OVERFLOW_INDEX, isOpen)],
            {
                delayGroup,
                getPanelRef: () => (openIndex === OVERFLOW_INDEX ? (panelRef ?? undefined) : undefined),
                getHoverShowDelayMs: () => hoverShowDelayMs,
                getSkipDelayWindowMs: () => skipDelayWindowMs,
                getIsHeld: getHasFocusInside,
                isTouchIgnored: true,
            },
        ),
    );

    $effect(() => {
        const open = openIndex;

        if (open !== undefined) shownIndex = open;
    });

    $effect(() => {
        if (fader.getIsVisible()) return;

        shownIndex = undefined;
        isGliding = false;
    });

    watchChange(
        () => shownIndex,
        () => {
            hoveredItem = undefined;
            focusVisibleItem = undefined;
        },
    );

    let settleGlide: ReturnType<typeof setTimeout> | undefined;

    watchChange(
        () => shownIndex,
        (index, previous) => {
            clearTimeout(settleGlide);

            if (index === undefined || previous === undefined || !fader.getIsVisible()) return;

            isGliding = true;
            settleGlide = setTimeout(() => {
                isGliding = false;
            }, transitionDurationMs);
        },
    );

    $effect(() => () => clearTimeout(settleGlide));

    $effect(() => {
        const panel = panelRef;

        if (!isPressOpened || openIndex === undefined || !panel || !position.getPosition()) return;

        isPressOpened = false;
        FlyoutMenuUtils.focusFirstLinkAfterPress(panel);
    });

    $effect(() => {
        const open = openIndex;

        if (open === undefined) return;
        if (open === OVERFLOW_INDEX ? hasOverflow : getIsShown(open)) return;

        openIndex = undefined;
    });

    $effect(() => {
        if (openIndex !== OVERFLOW_INDEX) expandedValues = [];
    });

    DismisserSvelteUtils.createLayer(() => openIndex !== undefined, {
        getRoots: () => [panelRef ?? undefined, getAnchorRef()],
        onDismiss: (reason: DismisserReason) => {
            const index = openIndex;

            if (index === undefined) return;

            const dismissal = HoverCardUtils.resolveDismissal(
                reason,
                hoverIntents.get(index)?.getIsPointerInside() ?? false,
            );

            if (dismissal === "ignore") return;

            if (dismissal === "restore") HoverCardUtils.restoreFocus(toggleRefs.get(index), panelRef ?? undefined);

            close();
        },
    });

    const attachEntryTracking: Attachment<HTMLElement> = (element) => {
        const stops = [
            on(element, "pointerover", (e) => {
                hoveredIndex = findEntryIndex(e.target);
            }),
            on(element, "pointerleave", () => {
                hoveredIndex = undefined;
            }),
            on(element, "focusin", (e) => {
                focusVisibleIndex = findEntryIndex(readFocusVisible(e.target));
            }),
            on(element, "focusout", () => {
                focusVisibleIndex = undefined;
            }),
            on(element, "keydown", () => {
                focusVisibleIndex = findEntryIndex(readFocusVisible(document.activeElement));
            }),
        ];

        return () => stops.forEach((stop) => stop());
    };

    const attachItemTracking: Attachment<HTMLElement> = (element) => {
        const stops = [
            on(element, "pointerover", (e) => {
                hoveredItem = findPanelItem(e.target);
            }),
            on(element, "pointerleave", () => {
                hoveredItem = undefined;
            }),
            on(element, "focusin", (e) => {
                focusVisibleItem = findPanelItem(readFocusVisible(e.target));
            }),
            on(element, "focusout", () => {
                focusVisibleItem = undefined;
            }),
            on(element, "keydown", () => {
                focusVisibleItem = findPanelItem(readFocusVisible(document.activeElement));
            }),
        ];

        return () => stops.forEach((stop) => stop());
    };

    const attachPanelKeys: Attachment<HTMLElement> = (element) =>
        on(element, "keydown", (e) =>
            HoverCardUtils.handleCardKeyDown(e, toggleRefs.get(shownIndex ?? OVERFLOW_INDEX), element),
        );

    const panelStyle = $derived(
        toStyle(
            {
                visibility: position.getPosition() ? "visible" : "hidden",
                transform: `translate(${position.getPosition()?.x ?? 0}px, ${position.getPosition()?.y ?? 0}px)`,
                transition: isGliding ? FlyoutMenuUtils.getGlideTransition(transitionDurationMs) : undefined,
                zIndex: position.getZIndex(),
                pointerEvents: openIndex === undefined ? "none" : "auto",
            },
            assignInlineVars({
                [styles.bridgeTopVar]: `${-bridge.top}px`,
                [styles.bridgeRightVar]: `${-bridge.right}px`,
                [styles.bridgeBottomVar]: `${-bridge.bottom}px`,
                [styles.bridgeLeftVar]: `${-bridge.left}px`,
            }),
        ),
    );
</script>

{#snippet floaterView(floater: ReturnType<typeof FloaterSvelteUtils.create>)}
    {#if floater.getIsRendered()}
        <div
            {@attach floater.attachRef}
            class={floaterStyles.floater}
            style={toStyle(floater.getBounds(), { transitionDuration: `${floaterTransitionDurationMs}ms` })}
        >
            {@render props.renderHighlightFloater?.(floater.getVisibilityTarget(), floaterTransitionDurationMs)}
        </div>
    {/if}
{/snippet}

{#snippet panelLinks()}
    <div bind:this={linksRef} {@attach attachItemTracking} class={styles.flyoutMenuPanelLinks}>
        {@render floaterView(panelFloater)}

        {#if shownIndex === OVERFLOW_INDEX}
            <ul class={styles.flyoutMenuPanelList}>
                {#each collapsedEntries as entry (entry)}
                    <FlyoutMenuCollapsedEntry
                        {entry}
                        isExpanded={expandedValues.includes(entry.value)}
                        linkComponent={props.linkComponent}
                        computeToggleLabel={props.computeToggleLabel}
                        renderLink={props.renderLink}
                        renderToggle={props.renderToggle}
                        onToggleExpanded={toggleExpanded}
                        onFollow={close}
                    />
                {/each}
            </ul>
        {:else}
            <FlyoutMenuLinkList
                links={entries[shownIndex ?? OVERFLOW_INDEX]?.links ?? []}
                linkComponent={props.linkComponent}
                renderLink={props.renderLink}
                onFollow={close}
            />
        {/if}
    </div>
{/snippet}

<nav bind:this={rootRef} class={styles.flyoutMenuRoot} aria-label={props.ariaLabel}>
    {@render floaterView(entryFloater)}

    <ul
        bind:this={listRef}
        {@attach attachEntryTracking}
        class={styles.flyoutMenuList}
        style:gap={`${gap}px`}
        style:visibility={hasMeasured ? undefined : "hidden"}
    >
        {#each entries as entry, index (index)}
            <FlyoutMenuEntry
                bind:ref={() => entryElements[index], (element) => setEntryRef(index, element ?? undefined)}
                bind:toggleRef={() => toggleRefs.get(index), (element) => setToggleRef(index, element)}
                {entry}
                {index}
                isShown={getIsShown(index)}
                isOpen={openIndex === index}
                {panelId}
                panelRef={panelRef ?? undefined}
                {delayGroup}
                {hoverShowDelayMs}
                {skipDelayWindowMs}
                getIsHeld={getHasFocusInside}
                linkComponent={props.linkComponent}
                computeToggleLabel={props.computeToggleLabel}
                renderLink={props.renderLink}
                renderToggle={props.renderToggle}
                onHoverChange={setIsOpenFromHover}
                onToggle={toggle}
                onToggleKeyDown={handleToggleKeyDown}
                onFollow={close}
                {recordHoverIntent}
            />
        {/each}

        <li
            bind:this={overflowElement}
            class={[styles.flyoutMenuEntry, hasOverflow ? "" : styles.flyoutMenuMeasuredEntry]}
            aria-hidden={hasOverflow ? undefined : "true"}
            inert={hasOverflow ? undefined : true}
        >
            <FlyoutMenuToggle
                bind:ref={() => toggleRefs.get(OVERFLOW_INDEX), (element) => setToggleRef(OVERFLOW_INDEX, element)}
                controlsId={panelId}
                isOpen={openIndex === OVERFLOW_INDEX}
                onPress={() => toggle(OVERFLOW_INDEX)}
                onKeyDown={(e) => handleToggleKeyDown(OVERFLOW_INDEX, e)}
                renderContent={props.renderOverflowToggle}
            />
        </li>
    </ul>

    {#if fader.getIsVisible()}
        <div
            bind:this={panelRef}
            {@attach attachPortal(viewportContext.getPortalRef() ?? document.body)}
            {@attach position.attachContent}
            id={panelId}
            class={styles.flyoutMenuPanel}
            style={panelStyle}
            {@attach attachPanelKeys}
            inert={openIndex === undefined}
        >
            {@render props.renderPanel(
                panelLinks,
                fader.getTransitionTarget(),
                transitionDurationMs,
                position.getPlacement(),
                panelSize,
            )}
        </div>
    {/if}
</nav>

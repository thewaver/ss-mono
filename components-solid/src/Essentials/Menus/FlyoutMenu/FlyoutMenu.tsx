import {
    type Accessor,
    For,
    Index,
    type JSX,
    Show,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    on,
    onCleanup,
    untrack,
} from "solid-js";
import { Dynamic, Portal } from "solid-js/web";

import {
    type DismisserReason,
    FLYOUT_MENU_DEFAULTS,
    type FlyoutMenuEntryRecord,
    type FlyoutMenuLinkFlags,
    type FlyoutMenuLinkRecord,
    type FlyoutMenuToggleFlags,
    FlyoutMenuUtils,
    FocusManagerUtils,
    HoverCardUtils,
    type HoverIntentHandle,
    HoverIntentUtils,
    type InteractionFlags,
    OverflowUtils,
    FlyoutMenuStyles as styles,
} from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { AnchorSolidUtils } from "../../../Abstracts/Anchor/AnchorSolid.utils";
import { DismisserSolidUtils } from "../../../Abstracts/Dismisser/DismisserSolid.utils";
import { ElementFaderSolidUtils } from "../../../Abstracts/ElementFader/ElementFaderSolid.utils";
import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { HoverIntentSolidUtils } from "../../../Abstracts/HoverIntent/HoverIntentSolid.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../../Utils/propUtils";
import type { FlyoutMenuProps } from "./FlyoutMenuSolid.types";

const OVERFLOW_INDEX = FlyoutMenuUtils.OVERFLOW_INDEX;
const TAB_KEY = "Tab";

type ToggleDefs = {
    getAriaLabel?: () => string;
    controlsId: string;
    getIsOpen: () => boolean;
    ref?: (element: HTMLElement) => void;
    onPress: () => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    renderContent: (getFlags: () => InteractionFlags<FlyoutMenuToggleFlags>) => JSX.Element;
};

export const FlyoutMenu = <T,>(props: FlyoutMenuProps<T>) => {
    const viewportContext = useViewportContext();
    const panelId = createUniqueId();
    const delayGroup = HoverIntentUtils.createDelayGroup();

    const toggleRefs = new Map<number, HTMLElement>();
    const hoverIntents = new Map<number, HoverIntentHandle>();

    const [getListRef, setListRef] = createSignal<HTMLElement>();
    const [getEntryRefs, setEntryRefs] = createSignal<(HTMLElement | undefined)[]>([]);
    const [getOverflowRef, setOverflowRef] = createSignal<HTMLElement>();
    const [getPanelRef, setPanelRef] = createSignal<HTMLElement>();
    const [getLinksRef, setLinksRef] = createSignal<HTMLElement>();
    const [getOpenIndex, setOpenIndex] = createSignal<number>();
    const [getShownIndex, setShownIndex] = createSignal<number>();
    const [getIsPressOpened, setIsPressOpened] = createSignal(false);
    const [getIsGliding, setIsGliding] = createSignal(false);
    const [getExpandedValues, setExpandedValues] = createSignal<T[]>([]);

    const getEntries = createMemo((): FlyoutMenuEntryRecord<T>[] => access(props.entries));

    const getGap = createMemo(() => access(props.gap) ?? FLYOUT_MENU_DEFAULTS.gap);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? FLYOUT_MENU_DEFAULTS.transitionDurationMs,
    );

    const getListSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getListRef);

    const getEntrySizes = ElementObserverSolidUtils.createBorderBoxSizeListObserver(getEntryRefs);

    const getOverflowSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getOverflowRef);

    const getLinksSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getLinksRef);

    const getPanelSize = () => (getLinksSize().width > 0 ? getLinksSize() : undefined);

    const setEntryRef = (index: number, element: HTMLElement) => {
        setEntryRefs((previous) => {
            const next = [...previous];

            next[index] = element;

            return next;
        });
    };

    const getHasMeasured = createMemo(() =>
        OverflowUtils.computeHasMeasured(false, getListSize().width, getEntrySizes().length, getEntries().length),
    );

    const getCut = createMemo(() =>
        OverflowUtils.computeCut({
            widths: getEntrySizes().map((size) => size.width),
            collapses: getEntries().map((entry) => entry.collapse ?? "auto"),
            available: getListSize().width,
            overflowWidth: getOverflowSize().width,
            gap: getGap(),
        }),
    );

    const getIsShown = (index: number) => getCut().shownIndexes.includes(index);

    const getCollapsedEntries = createMemo(() =>
        FlyoutMenuUtils.computeCollapsedEntries(getEntries(), getCut().collapsedIndexes),
    );

    const getHasOverflow = createMemo(() => getCollapsedEntries().length > 0);

    const getEntryElement = (index: number) => (index === OVERFLOW_INDEX ? getOverflowRef() : getEntryRefs()[index]);

    const getAnchorRef = () => {
        const index = getShownIndex();

        return index === undefined ? undefined : getEntryElement(index);
    };

    const getHasFocusInside = () => HoverCardUtils.getHasFocusInside(getPanelRef());

    const { getIsVisible, getTransitionTarget } = ElementFaderSolidUtils.createFader(
        () => getOpenIndex() !== undefined,
        { getTransitionDurationMs, getRef: getPanelRef },
    );

    const { getPlacement, getPosition, getZIndex, setContentRef } = AnchorSolidUtils.createPortalPosition(
        getAnchorRef,
        getIsVisible,
        {
            getPlacement: () => access(props.placement) ?? FLYOUT_MENU_DEFAULTS.placement,
            getOffset: props.offset === undefined ? undefined : () => access(props.offset)!,
        },
    );

    const getBridge = createMemo(() => HoverIntentUtils.computeBridgeInsets(getPlacement(), access(props.offset)));

    const close = () => {
        const index = getOpenIndex();

        if (index !== undefined) hoverIntents.get(index)?.cancel();

        setOpenIndex(undefined);
    };

    const setIsOpenFromHover = (index: number, isOpen: boolean) => {
        if (isOpen && FlyoutMenuUtils.getIsHoverSwitchRefused(getOpenIndex(), index, getHasFocusInside())) return;

        if (isOpen) setIsPressOpened(false);

        setOpenIndex((open) => FlyoutMenuUtils.computeNextOpenIndex(open, index, isOpen));
    };

    const toggle = (index: number) => {
        const isOpen = getOpenIndex() !== index;

        hoverIntents.get(index)?.cancel();
        setIsPressOpened(isOpen);
        setOpenIndex((open) => FlyoutMenuUtils.computeNextOpenIndex(open, index, isOpen));
    };

    const createHoverIntent = (index: number, getIsEnabled: () => boolean) => {
        const handle = HoverIntentSolidUtils.create(
            () => (getIsEnabled() ? getEntryElement(index) : undefined),
            [() => getOpenIndex() === index, (isOpen) => setIsOpenFromHover(index, isOpen)],
            {
                delayGroup,
                getPanelRef: () => (getOpenIndex() === index ? getPanelRef() : undefined),
                getHoverShowDelayMs: () => access(props.hoverShowDelayMs) ?? FLYOUT_MENU_DEFAULTS.hoverShowDelayMs,
                getSkipDelayWindowMs: () => access(props.skipDelayWindowMs) ?? FLYOUT_MENU_DEFAULTS.skipDelayWindowMs,
                getIsHeld: getHasFocusInside,
                isTouchIgnored: true,
            },
        );

        hoverIntents.set(index, handle);

        onCleanup(() => {
            if (hoverIntents.get(index) === handle) hoverIntents.delete(index);
        });
    };

    const handleToggleKeyDown = (index: number, e: KeyboardEvent) => {
        if (e.key !== TAB_KEY || e.shiftKey || getOpenIndex() !== index) return;

        const panel = getPanelRef();
        const first = panel && FocusManagerUtils.getFirstFocusableChild(panel);

        if (!first) return;

        e.preventDefault();
        first.focus({ preventScroll: true });
    };

    createEffect(() => {
        const open = getOpenIndex();

        if (open !== undefined) setShownIndex(open);
    });

    createEffect(() => {
        if (getIsVisible()) return;

        setShownIndex(undefined);
        setIsGliding(false);
    });

    createEffect(
        on(
            getShownIndex,
            (index, previous) => {
                if (index === undefined || previous === undefined || !untrack(getIsVisible)) return;

                setIsGliding(true);

                const settle = setTimeout(() => setIsGliding(false), untrack(getTransitionDurationMs));

                onCleanup(() => clearTimeout(settle));
            },
            { defer: true },
        ),
    );

    createEffect(() => {
        const panel = getPanelRef();

        if (!getIsPressOpened() || getOpenIndex() === undefined || !panel || !getPosition()) return;

        setIsPressOpened(false);
        FocusManagerUtils.getFirstFocusableChild(panel)?.focus({ preventScroll: true });
    });

    createEffect(() => {
        const open = getOpenIndex();

        if (open === undefined) return;
        if (open === OVERFLOW_INDEX ? getHasOverflow() : getIsShown(open)) return;

        setOpenIndex(undefined);
    });

    createEffect(() => {
        if (getOpenIndex() !== OVERFLOW_INDEX) setExpandedValues([]);
    });

    DismisserSolidUtils.createLayer(() => getOpenIndex() !== undefined, {
        getRoots: () => [getPanelRef(), getAnchorRef()],
        onDismiss: (reason: DismisserReason) => {
            const index = getOpenIndex();

            if (index === undefined) return;

            const dismissal = HoverCardUtils.resolveDismissal(
                reason,
                hoverIntents.get(index)?.getIsPointerInside() ?? false,
            );

            if (dismissal === "ignore") return;

            if (dismissal === "restore") HoverCardUtils.restoreFocus(toggleRefs.get(index), getPanelRef());

            close();
        },
    });

    const renderLink = (getLink: Accessor<FlyoutMenuLinkRecord<T>>) => (
        <InteractionWrapper<FlyoutMenuLinkFlags>
            extraFlags={() => ({ isCurrent: getLink().isCurrent ?? false })}
            renderControl={(setElementRef, getFlags) => (
                <Dynamic
                    component={props.linkComponent ?? "a"}
                    ref={setElementRef}
                    href={getLink().href}
                    class={styles.flyoutMenuLink}
                    aria-current={getLink().isCurrent ? "page" : undefined}
                    onClick={close}
                >
                    {props.renderLink(getLink, getFlags)}
                </Dynamic>
            )}
        />
    );

    const renderToggle = (defs: ToggleDefs) => (
        <InteractionWrapper<FlyoutMenuToggleFlags>
            extraFlags={() => ({ isOpen: defs.getIsOpen() })}
            onActivation={defs.onPress}
            renderControl={(setElementRef, getFlags) => (
                <button
                    type="button"
                    ref={(element) => {
                        setElementRef(element);
                        defs.ref?.(element);
                    }}
                    class={styles.flyoutMenuToggle}
                    aria-label={defs.getAriaLabel?.()}
                    aria-expanded={defs.getIsOpen()}
                    aria-controls={defs.getIsOpen() ? defs.controlsId : undefined}
                    onKeyDown={(e) => defs.onKeyDown?.(e)}
                >
                    {defs.renderContent(getFlags)}
                </button>
            )}
        />
    );

    const renderLinkList = (links: FlyoutMenuLinkRecord<T>[], id?: string) => (
        <ul id={id} class={styles.flyoutMenuPanelList}>
            <For each={links}>{(link) => <li>{renderLink(() => link)}</li>}</For>
        </ul>
    );

    const renderCollapsedEntry = (entry: FlyoutMenuEntryRecord<T>) => {
        const nestedId = createUniqueId();

        const getIsExpanded = () => getExpandedValues().includes(entry.value);

        return (
            <li class={styles.flyoutMenuPanelEntry}>
                <div class={styles.flyoutMenuPanelRow}>
                    {renderLink(() => entry)}

                    <Show when={FlyoutMenuUtils.getHasPanel(entry)}>
                        {renderToggle({
                            getAriaLabel: () => props.computeToggleLabel(entry.value),
                            controlsId: nestedId,
                            getIsOpen: getIsExpanded,
                            onPress: () =>
                                setExpandedValues((values) =>
                                    values.includes(entry.value)
                                        ? values.filter((value) => value !== entry.value)
                                        : [...values, entry.value],
                                ),
                            renderContent: (getFlags) => props.renderToggle(() => entry, getFlags),
                        })}
                    </Show>
                </div>

                <Show when={FlyoutMenuUtils.getHasPanel(entry) && getIsExpanded()}>
                    {renderLinkList(entry.links!, nestedId)}
                </Show>
            </li>
        );
    };

    const renderPanelLinks = () => (
        <div ref={setLinksRef} class={styles.flyoutMenuPanelLinks}>
            {renderPanelLinkList()}
        </div>
    );

    const renderPanelLinkList = () => (
        <Show
            when={getShownIndex() === OVERFLOW_INDEX}
            fallback={renderLinkList(getEntries()[getShownIndex() ?? OVERFLOW_INDEX]?.links ?? [])}
        >
            <ul class={styles.flyoutMenuPanelList}>
                <For each={getCollapsedEntries()}>{renderCollapsedEntry}</For>
            </ul>
        </Show>
    );

    const renderEntry = (getEntry: Accessor<FlyoutMenuEntryRecord<T>>, index: number) => {
        const getHasPanel = () => FlyoutMenuUtils.getHasPanel(getEntry());

        createHoverIntent(index, () => getHasPanel() && getIsShown(index));

        return (
            <li
                ref={(element) => setEntryRef(index, element)}
                class={[styles.flyoutMenuEntry, getIsShown(index) ? "" : styles.flyoutMenuMeasuredEntry].join(" ")}
                aria-hidden={getIsShown(index) ? undefined : "true"}
                inert={getIsShown(index) ? undefined : true}
            >
                {renderLink(getEntry)}

                <Show when={getHasPanel()}>
                    {renderToggle({
                        getAriaLabel: () => props.computeToggleLabel(getEntry().value),
                        controlsId: panelId,
                        getIsOpen: () => getOpenIndex() === index,
                        ref: (element) => toggleRefs.set(index, element),
                        onPress: () => toggle(index),
                        onKeyDown: (e) => handleToggleKeyDown(index, e),
                        renderContent: (getFlags) => props.renderToggle(getEntry, getFlags),
                    })}
                </Show>
            </li>
        );
    };

    createHoverIntent(OVERFLOW_INDEX, getHasOverflow);

    return (
        <nav class={styles.flyoutMenuRoot} aria-label={access(props.ariaLabel)}>
            <ul
                ref={setListRef}
                class={styles.flyoutMenuList}
                style={{ gap: `${getGap()}px`, visibility: getHasMeasured() ? undefined : "hidden" }}
            >
                <Index each={getEntries()}>{renderEntry}</Index>

                <li
                    ref={setOverflowRef}
                    class={[styles.flyoutMenuEntry, getHasOverflow() ? "" : styles.flyoutMenuMeasuredEntry].join(" ")}
                    aria-hidden={getHasOverflow() ? undefined : "true"}
                    inert={getHasOverflow() ? undefined : true}
                >
                    {renderToggle({
                        controlsId: panelId,
                        getIsOpen: () => getOpenIndex() === OVERFLOW_INDEX,
                        ref: (element) => toggleRefs.set(OVERFLOW_INDEX, element),
                        onPress: () => toggle(OVERFLOW_INDEX),
                        onKeyDown: (e) => handleToggleKeyDown(OVERFLOW_INDEX, e),
                        renderContent: props.renderOverflowToggle,
                    })}
                </li>
            </ul>

            <Show when={getIsVisible()}>
                <Portal mount={viewportContext.getPortalRef()}>
                    <div
                        ref={(element) => {
                            setContentRef(element);
                            setPanelRef(element);
                        }}
                        id={panelId}
                        class={styles.flyoutMenuPanel}
                        style={{
                            "visibility": getPosition() ? "visible" : "hidden",
                            "transform": `translate(${getPosition()?.x ?? 0}px, ${getPosition()?.y ?? 0}px)`,
                            "transition": getIsGliding()
                                ? FlyoutMenuUtils.getGlideTransition(getTransitionDurationMs())
                                : undefined,
                            "z-index": getZIndex(),
                            "pointer-events": getOpenIndex() === undefined ? "none" : "auto",
                            ...assignInlineVars({
                                [styles.bridgeTopVar]: `${-getBridge().top}px`,
                                [styles.bridgeRightVar]: `${-getBridge().right}px`,
                                [styles.bridgeBottomVar]: `${-getBridge().bottom}px`,
                                [styles.bridgeLeftVar]: `${-getBridge().left}px`,
                            }),
                        }}
                        inert={getOpenIndex() === undefined}
                        onKeyDown={(e) =>
                            HoverCardUtils.handleCardKeyDown(
                                e,
                                toggleRefs.get(getShownIndex() ?? OVERFLOW_INDEX),
                                getPanelRef(),
                            )
                        }
                    >
                        {props.renderPanel(
                            renderPanelLinks,
                            getTransitionTarget,
                            getTransitionDurationMs,
                            getPlacement,
                            getPanelSize,
                        )}
                    </div>
                </Portal>
            </Show>
        </nav>
    );
};

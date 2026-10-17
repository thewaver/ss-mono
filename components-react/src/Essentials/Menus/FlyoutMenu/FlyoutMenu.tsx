import {
    type CSSProperties,
    Fragment,
    type KeyboardEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";

import {
    type DismisserReason,
    FLYOUT_MENU_DEFAULTS,
    type FlyoutMenuEntryRecord,
    type FlyoutMenuLinkFlags,
    type FlyoutMenuLinkRecord,
    FlyoutMenuStyles,
    type FlyoutMenuToggleFlags,
    FlyoutMenuUtils,
    FocusManagerUtils,
    HoverCardUtils,
    type HoverIntentHandle,
    HoverIntentUtils,
    type InteractionFlags,
    OverflowUtils,
} from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { AnchorReactUtils } from "../../../Abstracts/Anchor/AnchorReact.utils";
import { DismisserReactUtils } from "../../../Abstracts/Dismisser/DismisserReact.utils";
import { ElementFaderReactUtils } from "../../../Abstracts/ElementFader/ElementFaderReact.utils";
import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { HoverIntentReactUtils } from "../../../Abstracts/HoverIntent/HoverIntentReact.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { useLatest } from "../../../Utils/refUtils";
import type { FlyoutMenuEntryProps, FlyoutMenuProps } from "./FlyoutMenu.types";

const OVERFLOW_INDEX = FlyoutMenuUtils.OVERFLOW_INDEX;
const TAB_KEY = "Tab";

type ToggleDefs = {
    ariaLabel?: string;
    controlsId: string;
    isOpen: boolean;
    ref?: (element: HTMLElement | null) => void;
    onPress: () => void;
    onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
    renderContent: (flags: InteractionFlags<FlyoutMenuToggleFlags>) => ReactNode;
};

const FlyoutMenuEntry = (props: FlyoutMenuEntryProps) => {
    const anchorRef = useLatest(props.anchor ?? null);
    const panelRef = useLatest(props.isOpen ? props.panel : null);

    const hoverIntent = HoverIntentReactUtils.useHoverIntent(anchorRef, [props.isOpen, props.onOpenChange], {
        delayGroup: props.delayGroup,
        panelRef,
        hoverShowDelayMs: props.hoverShowDelayMs,
        skipDelayWindowMs: props.skipDelayWindowMs,
        isHeld: () => HoverCardUtils.getHasFocusInside(props.panel ?? undefined),
        isTouchIgnored: true,
    });

    const latestRef = useLatest(props.ref);

    const setElementRef = useCallback((element: HTMLElement | null) => latestRef.current(element), [latestRef]);

    const hoverIntents = props.hoverIntents;
    const index = props.index;

    useEffect(() => {
        hoverIntents.set(index, hoverIntent);

        return () => {
            if (hoverIntents.get(index) === hoverIntent) hoverIntents.delete(index);
        };
    }, [hoverIntents, index]);

    return (
        <li
            ref={setElementRef}
            className={[
                FlyoutMenuStyles.flyoutMenuEntry,
                props.isShown ? "" : FlyoutMenuStyles.flyoutMenuMeasuredEntry,
            ].join(" ")}
            aria-hidden={props.isShown ? undefined : "true"}
            inert={props.isShown ? undefined : true}
        >
            {props.children}
        </li>
    );
};

export const FlyoutMenu = <T,>(props: FlyoutMenuProps<T>) => {
    const viewportContext = useViewportContext();
    const panelId = useId();
    const [delayGroup] = useState(HoverIntentUtils.createDelayGroup);

    const toggleRefs = useRef(new Map<number, HTMLElement>()).current;
    const hoverIntents = useRef(new Map<number, HoverIntentHandle>()).current;

    const listRef = useRef<HTMLUListElement | null>(null);
    const overflowRef = useRef<HTMLElement | null>(null);
    const linksRef = useRef<HTMLDivElement | null>(null);

    const [entryElements, setEntryElements] = useState<(HTMLElement | undefined)[]>([]);
    const [panel, setPanel] = useState<HTMLDivElement | null>(null);
    const [openIndex, setOpenIndex] = useState<number>();
    const [lastOpenIndex, setLastOpenIndex] = useState<number>();
    const [isPressOpened, setIsPressOpened] = useState(false);
    const [isGliding, setIsGliding] = useState(false);
    const [expandedValues, setExpandedValues] = useState<T[]>([]);

    const entries = props.entries;
    const gap = props.gap ?? FLYOUT_MENU_DEFAULTS.gap;
    const transitionDurationMs = props.transitionDurationMs ?? FLYOUT_MENU_DEFAULTS.transitionDurationMs;
    const hoverShowDelayMs = props.hoverShowDelayMs ?? FLYOUT_MENU_DEFAULTS.hoverShowDelayMs;
    const skipDelayWindowMs = props.skipDelayWindowMs ?? FLYOUT_MENU_DEFAULTS.skipDelayWindowMs;

    const listSize = ElementObserverReactUtils.useBorderBoxSize(listRef);
    const entrySizes = ElementObserverReactUtils.useBorderBoxSizes(entryElements);
    const overflowSize = ElementObserverReactUtils.useBorderBoxSize(overflowRef);
    const linksSize = ElementObserverReactUtils.useBorderBoxSize(linksRef);

    const panelSize = linksSize.width > 0 ? linksSize : undefined;

    const hasMeasured = OverflowUtils.computeHasMeasured(false, listSize.width, entrySizes.length, entries.length);

    const cut = useMemo(
        () =>
            OverflowUtils.computeCut({
                widths: entrySizes.map((size) => size.width),
                collapses: entries.map((entry) => entry.collapse ?? "auto"),
                available: listSize.width,
                overflowWidth: overflowSize.width,
                gap,
            }),
        [entrySizes, entries, listSize.width, overflowSize.width, gap],
    );

    const getIsShown = (index: number) => cut.shownIndexes.includes(index);

    const collapsedEntries = useMemo(
        () => FlyoutMenuUtils.computeCollapsedEntries(entries, cut.collapsedIndexes),
        [entries, cut.collapsedIndexes],
    );

    const hasOverflow = collapsedEntries.length > 0;

    const panelRef = useLatest(panel);

    const fader = ElementFaderReactUtils.useFader(openIndex !== undefined, { transitionDurationMs, ref: panelRef });

    const shownIndex = openIndex ?? (fader.isVisible ? lastOpenIndex : undefined);

    const getEntryElement = (index: number) =>
        (index === OVERFLOW_INDEX ? overflowRef.current : entryElements[index]) ?? undefined;

    const anchorRef = useLatest((shownIndex === undefined ? undefined : getEntryElement(shownIndex)) ?? null);

    const { placement, position, zIndex, setContentRef } = AnchorReactUtils.usePortalPosition(
        anchorRef,
        fader.isVisible,
        {
            placement: props.placement ?? FLYOUT_MENU_DEFAULTS.placement,
            offset: props.offset,
        },
    );

    const bridge = HoverIntentUtils.computeBridgeInsets(placement, props.offset);

    const getHasFocusInside = () => HoverCardUtils.getHasFocusInside(panelRef.current ?? undefined);

    const setEntryRef = (index: number, element: HTMLElement | null) => {
        setEntryElements((previous) => {
            if (previous[index] === (element ?? undefined)) return previous;

            const next = [...previous];

            next[index] = element ?? undefined;

            return next;
        });
    };

    const close = () => {
        if (openIndex !== undefined) hoverIntents.get(openIndex)?.cancel();

        setOpenIndex(undefined);
    };

    const setIsOpenFromHover = (index: number, isOpen: boolean) => {
        if (isOpen && FlyoutMenuUtils.getIsHoverSwitchRefused(openIndex, index, getHasFocusInside())) return;

        if (isOpen) setIsPressOpened(false);

        setOpenIndex((open) => FlyoutMenuUtils.computeNextOpenIndex(open, index, isOpen));
    };

    const toggle = (index: number) => {
        const isOpen = openIndex !== index;

        hoverIntents.get(index)?.cancel();
        setIsPressOpened(isOpen);
        setOpenIndex((open) => FlyoutMenuUtils.computeNextOpenIndex(open, index, isOpen));
    };

    const handleToggleKeyDown = (index: number, e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key !== TAB_KEY || e.shiftKey || openIndex !== index) return;

        const panel = panelRef.current;
        const first = panel && FocusManagerUtils.getFirstFocusableChild(panel);

        if (!first) return;

        e.preventDefault();
        first.focus({ preventScroll: true });
    };

    useEffect(() => {
        if (openIndex !== undefined) setLastOpenIndex(openIndex);
    }, [openIndex]);

    const previousShownIndexRef = useRef(shownIndex);
    const glideRef = useLatest({ isVisible: fader.isVisible, transitionDurationMs });

    useEffect(() => {
        const previous = previousShownIndexRef.current;

        previousShownIndexRef.current = shownIndex;

        if (shownIndex === undefined || previous === undefined || previous === shownIndex) return;
        if (!glideRef.current.isVisible) return;

        setIsGliding(true);

        const settle = setTimeout(() => setIsGliding(false), glideRef.current.transitionDurationMs);

        return () => clearTimeout(settle);
    }, [shownIndex]);

    useEffect(() => {
        if (!fader.isVisible) setIsGliding(false);
    }, [fader.isVisible]);

    const hasPosition = position !== undefined;

    useEffect(() => {
        if (!isPressOpened || openIndex === undefined || !panel || !hasPosition) return;

        setIsPressOpened(false);
        FocusManagerUtils.getFirstFocusableChild(panel)?.focus({ preventScroll: true });
    }, [isPressOpened, openIndex, panel, hasPosition]);

    useEffect(() => {
        if (openIndex === undefined) return;
        if (openIndex === OVERFLOW_INDEX ? hasOverflow : cut.shownIndexes.includes(openIndex)) return;

        setOpenIndex(undefined);
    }, [openIndex, hasOverflow, cut.shownIndexes]);

    useEffect(() => {
        if (openIndex !== OVERFLOW_INDEX) setExpandedValues((values) => (values.length === 0 ? values : []));
    }, [openIndex]);

    DismisserReactUtils.useLayer(openIndex !== undefined, {
        getRoots: () => [panelRef.current, anchorRef.current],
        onDismiss: (reason: DismisserReason) => {
            if (openIndex === undefined) return;

            const dismissal = HoverCardUtils.resolveDismissal(
                reason,
                hoverIntents.get(openIndex)?.getIsPointerInside() ?? false,
            );

            if (dismissal === "ignore") return;

            if (dismissal === "restore") {
                HoverCardUtils.restoreFocus(toggleRefs.get(openIndex), panelRef.current ?? undefined);
            }

            close();
        },
    });

    const Link = props.linkComponent ?? "a";

    const renderLink = (link: FlyoutMenuLinkRecord<T>) => (
        <InteractionWrapper<FlyoutMenuLinkFlags>
            extraFlags={{ isCurrent: link.isCurrent ?? false }}
            renderControl={(setElementRef, flags) => (
                <Link
                    ref={setElementRef}
                    href={link.href}
                    className={FlyoutMenuStyles.flyoutMenuLink}
                    aria-current={link.isCurrent ? "page" : undefined}
                    onClick={close}
                >
                    {props.renderLink(link, flags)}
                </Link>
            )}
        />
    );

    const renderToggle = (defs: ToggleDefs) => (
        <InteractionWrapper<FlyoutMenuToggleFlags>
            extraFlags={{ isOpen: defs.isOpen }}
            onActivation={defs.onPress}
            renderControl={(setElementRef, flags) => (
                <button
                    type="button"
                    ref={(element) => {
                        setElementRef(element);
                        defs.ref?.(element);
                    }}
                    className={FlyoutMenuStyles.flyoutMenuToggle}
                    aria-label={defs.ariaLabel}
                    aria-expanded={defs.isOpen}
                    aria-controls={defs.isOpen ? defs.controlsId : undefined}
                    onKeyDown={(e) => defs.onKeyDown?.(e)}
                >
                    {defs.renderContent(flags)}
                </button>
            )}
        />
    );

    const renderLinkList = (links: FlyoutMenuLinkRecord<T>[], id?: string) => (
        <ul id={id} className={FlyoutMenuStyles.flyoutMenuPanelList}>
            {links.map((link, index) => (
                <li key={index}>{renderLink(link)}</li>
            ))}
        </ul>
    );

    const renderCollapsedEntry = (entry: FlyoutMenuEntryRecord<T>, barIndex: number) => {
        const nestedId = `${panelId}-links-${barIndex}`;
        const hasPanel = FlyoutMenuUtils.getHasPanel(entry);
        const isExpanded = expandedValues.includes(entry.value);

        return (
            <li key={barIndex} className={FlyoutMenuStyles.flyoutMenuPanelEntry}>
                <div className={FlyoutMenuStyles.flyoutMenuPanelRow}>
                    {renderLink(entry)}

                    {hasPanel &&
                        renderToggle({
                            ariaLabel: props.computeToggleLabel(entry.value),
                            controlsId: nestedId,
                            isOpen: isExpanded,
                            onPress: () =>
                                setExpandedValues((values) =>
                                    values.includes(entry.value)
                                        ? values.filter((value) => value !== entry.value)
                                        : [...values, entry.value],
                                ),
                            renderContent: (flags) => props.renderToggle(entry, flags),
                        })}
                </div>

                {hasPanel && isExpanded && renderLinkList(entry.links!, nestedId)}
            </li>
        );
    };

    const renderPanelLinkList = () => {
        if (shownIndex === OVERFLOW_INDEX) {
            return (
                <ul key={OVERFLOW_INDEX} className={FlyoutMenuStyles.flyoutMenuPanelList}>
                    {collapsedEntries.map((entry, index) => renderCollapsedEntry(entry, cut.collapsedIndexes[index]))}
                </ul>
            );
        }

        return (
            <Fragment key={shownIndex}>{renderLinkList(entries[shownIndex ?? OVERFLOW_INDEX]?.links ?? [])}</Fragment>
        );
    };

    const renderPanelLinks = () => (
        <div ref={linksRef} className={FlyoutMenuStyles.flyoutMenuPanelLinks}>
            {renderPanelLinkList()}
        </div>
    );

    const renderEntry = (entry: FlyoutMenuEntryRecord<T>, index: number) => {
        const hasPanel = FlyoutMenuUtils.getHasPanel(entry);
        const isShown = getIsShown(index);
        const isOpen = openIndex === index;

        return (
            <FlyoutMenuEntry
                key={index}
                index={index}
                isShown={isShown}
                anchor={hasPanel && isShown ? getEntryElement(index) : undefined}
                panel={panel}
                isOpen={isOpen}
                delayGroup={delayGroup}
                hoverShowDelayMs={hoverShowDelayMs}
                skipDelayWindowMs={skipDelayWindowMs}
                hoverIntents={hoverIntents}
                ref={(element) => setEntryRef(index, element)}
                onOpenChange={(isOpenNow) => setIsOpenFromHover(index, isOpenNow)}
            >
                {renderLink(entry)}

                {hasPanel &&
                    renderToggle({
                        ariaLabel: props.computeToggleLabel(entry.value),
                        controlsId: panelId,
                        isOpen,
                        ref: (element) => {
                            if (element) toggleRefs.set(index, element);
                        },
                        onPress: () => toggle(index),
                        onKeyDown: (e) => handleToggleKeyDown(index, e),
                        renderContent: (flags) => props.renderToggle(entry, flags),
                    })}
            </FlyoutMenuEntry>
        );
    };

    const isOverflowOpen = openIndex === OVERFLOW_INDEX;

    const panelStyle: CSSProperties = {
        visibility: position ? "visible" : "hidden",
        transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`,
        transition: isGliding ? FlyoutMenuUtils.getGlideTransition(transitionDurationMs) : undefined,
        zIndex,
        pointerEvents: openIndex === undefined ? "none" : "auto",
        ...(assignInlineVars({
            [FlyoutMenuStyles.bridgeTopVar]: `${-bridge.top}px`,
            [FlyoutMenuStyles.bridgeRightVar]: `${-bridge.right}px`,
            [FlyoutMenuStyles.bridgeBottomVar]: `${-bridge.bottom}px`,
            [FlyoutMenuStyles.bridgeLeftVar]: `${-bridge.left}px`,
        }) as CSSProperties),
    };

    return (
        <nav className={FlyoutMenuStyles.flyoutMenuRoot} aria-label={props.ariaLabel}>
            <ul
                ref={listRef}
                className={FlyoutMenuStyles.flyoutMenuList}
                style={{ gap: `${gap}px`, visibility: hasMeasured ? undefined : "hidden" }}
            >
                {entries.map(renderEntry)}

                <FlyoutMenuEntry
                    index={OVERFLOW_INDEX}
                    isShown={hasOverflow}
                    anchor={hasOverflow ? getEntryElement(OVERFLOW_INDEX) : undefined}
                    panel={panel}
                    isOpen={isOverflowOpen}
                    delayGroup={delayGroup}
                    hoverShowDelayMs={hoverShowDelayMs}
                    skipDelayWindowMs={skipDelayWindowMs}
                    hoverIntents={hoverIntents}
                    ref={(element) => {
                        overflowRef.current = element;
                    }}
                    onOpenChange={(isOpenNow) => setIsOpenFromHover(OVERFLOW_INDEX, isOpenNow)}
                >
                    {renderToggle({
                        controlsId: panelId,
                        isOpen: isOverflowOpen,
                        ref: (element) => {
                            if (element) toggleRefs.set(OVERFLOW_INDEX, element);
                        },
                        onPress: () => toggle(OVERFLOW_INDEX),
                        onKeyDown: (e) => handleToggleKeyDown(OVERFLOW_INDEX, e),
                        renderContent: props.renderOverflowToggle,
                    })}
                </FlyoutMenuEntry>
            </ul>

            {fader.isVisible &&
                createPortal(
                    <div
                        ref={(element) => {
                            setContentRef(element);
                            setPanel(element);
                        }}
                        id={panelId}
                        className={FlyoutMenuStyles.flyoutMenuPanel}
                        style={panelStyle}
                        inert={openIndex === undefined}
                        onKeyDown={(e) =>
                            HoverCardUtils.handleCardKeyDown(
                                e,
                                toggleRefs.get(shownIndex ?? OVERFLOW_INDEX),
                                panelRef.current ?? undefined,
                            )
                        }
                    >
                        {props.renderPanel(
                            renderPanelLinks,
                            fader.transitionTarget,
                            transitionDurationMs,
                            placement,
                            panelSize,
                        )}
                    </div>,
                    viewportContext.getPortalRef() ?? document.body,
                )}
        </nav>
    );
};

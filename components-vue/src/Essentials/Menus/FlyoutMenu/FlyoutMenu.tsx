import {
    type ComponentPublicInstance,
    type EffectScope,
    type SlotsType,
    Teleport,
    type VNodeChild,
    computed,
    defineComponent,
    effectScope,
    h,
    onScopeDispose,
    shallowRef,
    useId,
    watch,
} from "vue";

import {
    type DismisserReason,
    FLYOUT_MENU_DEFAULTS,
    FloaterStyles,
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
    InteractionTrackerUtils,
    OverflowUtils,
} from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { AnchorVueUtils } from "../../../Abstracts/Anchor/AnchorVue.utils";
import { DismisserVueUtils } from "../../../Abstracts/Dismisser/DismisserVue.utils";
import { ElementFaderVueUtils } from "../../../Abstracts/ElementFader/ElementFaderVue.utils";
import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { FloaterVueUtils } from "../../../Abstracts/Floater/FloaterVue.utils";
import { HoverIntentVueUtils } from "../../../Abstracts/HoverIntent/HoverIntentVue.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionWrapperSlots } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { FlyoutMenuProps, FlyoutMenuSlots } from "./FlyoutMenu.types";

const OVERFLOW_INDEX = FlyoutMenuUtils.OVERFLOW_INDEX;
const TAB_KEY = "Tab";

type ToggleDefs = {
    ariaLabel?: string;
    controlsId: string;
    isOpen: boolean;
    ref?: (element: HTMLElement | undefined) => void;
    onPress: () => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    renderContent: (flags: InteractionFlags<FlyoutMenuToggleFlags>) => VNodeChild;
};

export const FlyoutMenu = defineComponent(
    <T,>(props: FlyoutMenuProps<T>, { slots }: SlotsContext<FlyoutMenuSlots<T>>) => {
        const viewportContext = useViewportContext();
        const panelId = useId();
        const delayGroup = HoverIntentUtils.createDelayGroup();

        const toggleRefs = new Map<number, HTMLElement>();
        const hoverIntents = new Map<number, HoverIntentHandle>();
        const entryScopes: EffectScope[] = [];

        const rootRef = shallowRef<HTMLElement>();
        const listRef = shallowRef<HTMLElement>();
        const entryElements = shallowRef<(HTMLElement | undefined)[]>([]);
        const overflowRef = shallowRef<HTMLElement>();
        const panelRef = shallowRef<HTMLElement>();
        const linksRef = shallowRef<HTMLElement>();
        const openIndex = shallowRef<number>();
        const shownIndex = shallowRef<number>();
        const isPressOpened = shallowRef(false);
        const isHoverOpened = shallowRef(false);
        const hoveredIndex = shallowRef<number>();
        const focusVisibleIndex = shallowRef<number>();
        const hoveredItem = shallowRef<HTMLElement>();
        const focusVisibleItem = shallowRef<HTMLElement>();
        const isGliding = shallowRef(false);
        const expandedValues = shallowRef<T[]>([]);

        const getGap = () => props.gap ?? FLYOUT_MENU_DEFAULTS.gap;

        const getTransitionDurationMs = () => props.transitionDurationMs ?? FLYOUT_MENU_DEFAULTS.transitionDurationMs;

        const listSize = ElementObserverVueUtils.useBorderBoxSize(listRef);
        const entrySizes = ElementObserverVueUtils.useBorderBoxSizes(entryElements);
        const overflowSize = ElementObserverVueUtils.useBorderBoxSize(overflowRef);
        const linksSize = ElementObserverVueUtils.useBorderBoxSize(linksRef);

        const getPanelSize = () => (linksSize.value.width > 0 ? linksSize.value : undefined);

        const setEntryRef = (index: number, target: Element | ComponentPublicInstance | null) => {
            const element = toElement(target);

            if (entryElements.value[index] === element) return;

            const next = [...entryElements.value];

            next[index] = element;
            entryElements.value = next;
        };

        const hasMeasured = computed(() =>
            OverflowUtils.computeHasMeasured(
                false,
                listSize.value.width,
                entrySizes.value.length,
                props.entries.length,
            ),
        );

        const cut = computed(() =>
            OverflowUtils.computeCut({
                widths: entrySizes.value.map((size) => size.width),
                collapses: props.entries.map((entry) => entry.collapse ?? "auto"),
                available: listSize.value.width,
                overflowWidth: overflowSize.value.width,
                gap: getGap(),
            }),
        );

        const getIsShown = (index: number) => cut.value.shownIndexes.includes(index);

        const collapsedEntries = computed(() =>
            FlyoutMenuUtils.computeCollapsedEntries(props.entries, cut.value.collapsedIndexes),
        );

        const hasOverflow = computed(() => collapsedEntries.value.length > 0);

        const getEntryElement = (index: number) =>
            index === OVERFLOW_INDEX ? overflowRef.value : entryElements.value[index];

        const getAnchorRef = () => {
            const index = shownIndex.value;

            return index === undefined ? undefined : getEntryElement(index);
        };

        const getHasFocusInside = () => HoverCardUtils.getHasFocusInside(panelRef.value);

        const fader = ElementFaderVueUtils.useFader(() => openIndex.value !== undefined, {
            transitionDurationMs: getTransitionDurationMs,
            ref: panelRef,
        });

        const { placement, position, zIndex, setContentRef } = AnchorVueUtils.usePortalPosition(
            getAnchorRef,
            fader.isVisible,
            {
                placement: () => props.placement ?? FLYOUT_MENU_DEFAULTS.placement,
                offset: () => props.offset,
            },
        );

        const bridge = computed(() => HoverIntentUtils.computeBridgeInsets(placement.value, props.offset));

        const getFloaterTransitionDurationMs = () =>
            props.floaterTransitionDurationMs ?? FLYOUT_MENU_DEFAULTS.floaterTransitionDurationMs;

        const entryFloater = FloaterVueUtils.useFloater({
            isEnabled: () => slots.renderHighlightFloater !== undefined,
            container: rootRef,
            target: () => {
                const index = hoveredIndex.value ?? openIndex.value ?? focusVisibleIndex.value;

                return index === undefined ? undefined : getEntryElement(index);
            },
            transitionDurationMs: getFloaterTransitionDurationMs,
        });

        const panelFloater = FloaterVueUtils.useFloater({
            isEnabled: () => slots.renderHighlightFloater !== undefined,
            container: linksRef,
            target: () => hoveredItem.value ?? focusVisibleItem.value,
            transitionDurationMs: getFloaterTransitionDurationMs,
        });

        const findEntryIndex = (target: EventTarget | null | undefined) => {
            const entry = target instanceof Element ? target.closest(`.${FlyoutMenuStyles.flyoutMenuEntry}`) : null;

            if (!(entry instanceof HTMLElement)) return undefined;
            if (entry === overflowRef.value) return OVERFLOW_INDEX;

            const index = entryElements.value.indexOf(entry);

            return index === -1 ? undefined : index;
        };

        const findPanelItem = (target: EventTarget | null | undefined) => {
            const item = target instanceof Element ? target.closest(`.${FlyoutMenuStyles.flyoutMenuPanelItem}`) : null;

            return item instanceof HTMLElement ? item : undefined;
        };

        const readFocusVisible = (target: EventTarget | null) =>
            target instanceof HTMLElement && InteractionTrackerUtils.computeIsFocusVisible(target) ? target : undefined;

        const close = () => {
            const index = openIndex.value;

            if (index !== undefined) hoverIntents.get(index)?.cancel();

            openIndex.value = undefined;
        };

        const setIsOpenFromHover = (index: number, isOpen: boolean) => {
            if (isOpen && FlyoutMenuUtils.getIsHoverSwitchRefused(openIndex.value, index, getHasFocusInside())) return;

            if (isOpen) isPressOpened.value = false;
            if (isOpen && openIndex.value !== index) isHoverOpened.value = true;

            openIndex.value = FlyoutMenuUtils.computeNextOpenIndex(openIndex.value, index, isOpen);
        };

        const toggle = (index: number) => {
            const isOpen = openIndex.value !== index || isHoverOpened.value;

            hoverIntents.get(index)?.cancel();
            isHoverOpened.value = false;
            isPressOpened.value = isOpen;
            openIndex.value = FlyoutMenuUtils.computeNextOpenIndex(openIndex.value, index, isOpen);
        };

        const useEntryHoverIntent = (index: number, getIsEnabled: () => boolean) => {
            const handle = HoverIntentVueUtils.useHoverIntent(
                () => (getIsEnabled() ? getEntryElement(index) : undefined),
                computed({
                    get: () => openIndex.value === index,
                    set: (isOpen) => setIsOpenFromHover(index, isOpen),
                }),
                {
                    delayGroup,
                    panelRef: () => (openIndex.value === index ? panelRef.value : undefined),
                    hoverShowDelayMs: () => props.hoverShowDelayMs ?? FLYOUT_MENU_DEFAULTS.hoverShowDelayMs,
                    skipDelayWindowMs: () => props.skipDelayWindowMs ?? FLYOUT_MENU_DEFAULTS.skipDelayWindowMs,
                    isHeld: getHasFocusInside,
                    isTouchIgnored: true,
                },
            );

            hoverIntents.set(index, handle);

            onScopeDispose(() => {
                if (hoverIntents.get(index) === handle) hoverIntents.delete(index);
            });
        };

        const handleToggleKeyDown = (index: number, e: KeyboardEvent) => {
            if (e.key !== TAB_KEY || e.shiftKey || openIndex.value !== index) return;

            const panel = panelRef.value;
            const first = panel && FocusManagerUtils.getFirstFocusableChild(panel);

            if (!first) return;

            e.preventDefault();
            first.focus({ preventScroll: true });
        };

        watch(
            () => props.entries.length,
            (count) => {
                while (entryScopes.length < count) {
                    const index = entryScopes.length;
                    const scope = effectScope(true);

                    scope.run(() =>
                        useEntryHoverIntent(index, () => {
                            const entry = props.entries[index];

                            return entry !== undefined && FlyoutMenuUtils.getHasPanel(entry) && getIsShown(index);
                        }),
                    );

                    entryScopes.push(scope);
                }

                while (entryScopes.length > count) entryScopes.pop()?.stop();
            },
            { immediate: true },
        );

        onScopeDispose(() => entryScopes.forEach((scope) => scope.stop()));

        useEntryHoverIntent(OVERFLOW_INDEX, () => hasOverflow.value);

        watch(openIndex, (open) => {
            if (open !== undefined) shownIndex.value = open;
        });

        watch(fader.isVisible, (isVisible) => {
            if (isVisible) return;

            shownIndex.value = undefined;
            isGliding.value = false;
        });

        watch(shownIndex, () => {
            hoveredItem.value = undefined;
            focusVisibleItem.value = undefined;
        });

        watch(shownIndex, (index, previous, onCleanup) => {
            if (index === undefined || previous === undefined || !fader.isVisible.value) return;

            isGliding.value = true;

            const settle = setTimeout(() => {
                isGliding.value = false;
            }, getTransitionDurationMs());

            onCleanup(() => clearTimeout(settle));
        });

        watchAfterRender([panelRef, isPressOpened, openIndex, position], ([panel, isPressed, open, current]) => {
            if (!isPressed || open === undefined || !panel || !current) return;

            isPressOpened.value = false;
            FlyoutMenuUtils.focusFirstLinkAfterPress(panel);
        });

        watchAfterRender([openIndex, hasOverflow, cut], ([open, isOverflowing]) => {
            if (open === undefined) return;
            if (open === OVERFLOW_INDEX ? isOverflowing : getIsShown(open)) return;

            openIndex.value = undefined;
        });

        watch(openIndex, (open) => {
            if (open !== OVERFLOW_INDEX) expandedValues.value = [];
        });

        DismisserVueUtils.useLayer(() => openIndex.value !== undefined, {
            getRoots: () => [panelRef.value, getAnchorRef()],
            onDismiss: (reason: DismisserReason) => {
                const index = openIndex.value;

                if (index === undefined) return;

                const dismissal = HoverCardUtils.resolveDismissal(
                    reason,
                    hoverIntents.get(index)?.getIsPointerInside() ?? false,
                );

                if (dismissal === "ignore") return;

                if (dismissal === "restore") HoverCardUtils.restoreFocus(toggleRefs.get(index), panelRef.value);

                close();
            },
        });

        const setToggleRef = (index: number, element: HTMLElement | undefined) => {
            if (element) toggleRefs.set(index, element);
            else toggleRefs.delete(index);
        };

        const renderLink = (link: FlyoutMenuLinkRecord<T>) => (
            <InteractionWrapper extraFlags={{ isCurrent: link.isCurrent ?? false }}>
                {
                    {
                        renderControl: ({ setElementRef, flags }) => {
                            const content = callSlot(slots.renderLink, { link, flags });

                            const linkProps = {
                                "href": link.href,
                                "class": FlyoutMenuStyles.flyoutMenuLink,
                                "aria-current": link.isCurrent ? ("page" as const) : undefined,
                                "onClick": close,
                            };

                            if (props.linkComponent === undefined) {
                                return (
                                    <a ref={setElementRef} {...linkProps}>
                                        {content}
                                    </a>
                                );
                            }

                            return h(
                                props.linkComponent,
                                { ref: setElementRef, ...linkProps },
                                { default: () => content },
                            );
                        },
                    } satisfies Partial<InteractionWrapperSlots<FlyoutMenuLinkFlags>>
                }
            </InteractionWrapper>
        );

        const renderToggle = (defs: ToggleDefs) => (
            <InteractionWrapper extraFlags={{ isOpen: defs.isOpen }} onActivation={defs.onPress}>
                {
                    {
                        renderControl: ({ setElementRef, flags }) => (
                            <button
                                type="button"
                                ref={(target) => {
                                    setElementRef(target);
                                    defs.ref?.(toElement(target));
                                }}
                                class={FlyoutMenuStyles.flyoutMenuToggle}
                                aria-label={defs.ariaLabel}
                                aria-expanded={defs.isOpen}
                                aria-controls={defs.isOpen ? defs.controlsId : undefined}
                                onKeydown={(e: KeyboardEvent) => defs.onKeyDown?.(e)}
                            >
                                {defs.renderContent(flags)}
                            </button>
                        ),
                    } satisfies Partial<InteractionWrapperSlots<FlyoutMenuToggleFlags>>
                }
            </InteractionWrapper>
        );

        const renderLinkList = (links: FlyoutMenuLinkRecord<T>[], id?: string) => (
            <ul id={id} class={FlyoutMenuStyles.flyoutMenuPanelList}>
                {links.map((link, index) => (
                    <li key={index} class={FlyoutMenuStyles.flyoutMenuPanelItem}>
                        {renderLink(link)}
                    </li>
                ))}
            </ul>
        );

        const renderCollapsedEntry = (entry: FlyoutMenuEntryRecord<T>, position: number) => {
            const nestedId = `${panelId}-${position}`;
            const hasPanel = FlyoutMenuUtils.getHasPanel(entry);
            const isExpanded = expandedValues.value.includes(entry.value);

            return (
                <li key={position} class={FlyoutMenuStyles.flyoutMenuPanelEntry}>
                    <div class={[FlyoutMenuStyles.flyoutMenuPanelRow, FlyoutMenuStyles.flyoutMenuPanelItem]}>
                        {renderLink(entry)}

                        {hasPanel &&
                            renderToggle({
                                ariaLabel: props.computeToggleLabel(entry.value),
                                controlsId: nestedId,
                                isOpen: isExpanded,
                                onPress: () => {
                                    const values = expandedValues.value;

                                    expandedValues.value = values.includes(entry.value)
                                        ? values.filter((value) => value !== entry.value)
                                        : [...values, entry.value];
                                },
                                renderContent: (flags) => callSlot(slots.renderToggle, { entry, flags }),
                            })}
                    </div>

                    {hasPanel && isExpanded && renderLinkList(entry.links!, nestedId)}
                </li>
            );
        };

        const renderPanelLinkList = () =>
            shownIndex.value === OVERFLOW_INDEX ? (
                <ul class={FlyoutMenuStyles.flyoutMenuPanelList}>{collapsedEntries.value.map(renderCollapsedEntry)}</ul>
            ) : (
                renderLinkList(props.entries[shownIndex.value ?? OVERFLOW_INDEX]?.links ?? [])
            );

        const renderFloater = (floater: ReturnType<typeof FloaterVueUtils.useFloater>) => {
            const floaterTransitionDurationMs = getFloaterTransitionDurationMs();

            return (
                floater.isRendered.value && (
                    <div
                        ref={floater.setRef}
                        class={FloaterStyles.floater}
                        style={{ ...floater.bounds.value, transitionDuration: `${floaterTransitionDurationMs}ms` }}
                    >
                        {callSlot(slots.renderHighlightFloater, {
                            visibilityTarget: floater.visibilityTarget.value,
                            transitionDurationMs: floaterTransitionDurationMs,
                        })}
                    </div>
                )
            );
        };

        const renderPanelLinks = () => (
            <div
                ref={(target) => {
                    linksRef.value = toElement(target);
                }}
                class={FlyoutMenuStyles.flyoutMenuPanelLinks}
                onPointerover={(e: PointerEvent) => {
                    hoveredItem.value = findPanelItem(e.target);
                }}
                onPointerleave={() => {
                    hoveredItem.value = undefined;
                }}
                onFocusin={(e: FocusEvent) => {
                    focusVisibleItem.value = findPanelItem(readFocusVisible(e.target));
                }}
                onFocusout={() => {
                    focusVisibleItem.value = undefined;
                }}
                onKeydown={() => {
                    focusVisibleItem.value = findPanelItem(readFocusVisible(document.activeElement));
                }}
            >
                {renderFloater(panelFloater)}

                {renderPanelLinkList()}
            </div>
        );

        const renderEntry = (entry: FlyoutMenuEntryRecord<T>, index: number) => {
            const isShown = getIsShown(index);

            return (
                <li
                    key={index}
                    ref={(target) => setEntryRef(index, target)}
                    class={[FlyoutMenuStyles.flyoutMenuEntry, isShown ? "" : FlyoutMenuStyles.flyoutMenuMeasuredEntry]}
                    aria-hidden={isShown ? undefined : "true"}
                    inert={isShown ? undefined : true}
                >
                    {renderLink(entry)}

                    {FlyoutMenuUtils.getHasPanel(entry) &&
                        renderToggle({
                            ariaLabel: props.computeToggleLabel(entry.value),
                            controlsId: panelId,
                            isOpen: openIndex.value === index,
                            ref: (element) => setToggleRef(index, element),
                            onPress: () => toggle(index),
                            onKeyDown: (e) => handleToggleKeyDown(index, e),
                            renderContent: (flags) => callSlot(slots.renderToggle, { entry, flags }),
                        })}
                </li>
            );
        };

        return () => {
            const isOverflowing = hasOverflow.value;
            const open = openIndex.value;

            return (
                <nav
                    ref={(target) => {
                        rootRef.value = toElement(target);
                    }}
                    class={FlyoutMenuStyles.flyoutMenuRoot}
                    aria-label={props.ariaLabel}
                >
                    {renderFloater(entryFloater)}

                    <ul
                        ref={(target) => {
                            listRef.value = toElement(target);
                        }}
                        class={FlyoutMenuStyles.flyoutMenuList}
                        style={{ gap: `${getGap()}px`, visibility: hasMeasured.value ? undefined : "hidden" }}
                        onPointerover={(e: PointerEvent) => {
                            hoveredIndex.value = findEntryIndex(e.target);
                        }}
                        onPointerleave={() => {
                            hoveredIndex.value = undefined;
                        }}
                        onFocusin={(e: FocusEvent) => {
                            focusVisibleIndex.value = findEntryIndex(readFocusVisible(e.target));
                        }}
                        onFocusout={() => {
                            focusVisibleIndex.value = undefined;
                        }}
                        onKeydown={() => {
                            focusVisibleIndex.value = findEntryIndex(readFocusVisible(document.activeElement));
                        }}
                    >
                        {props.entries.map(renderEntry)}

                        <li
                            ref={(target) => {
                                overflowRef.value = toElement(target);
                            }}
                            class={[
                                FlyoutMenuStyles.flyoutMenuEntry,
                                isOverflowing ? "" : FlyoutMenuStyles.flyoutMenuMeasuredEntry,
                            ]}
                            aria-hidden={isOverflowing ? undefined : "true"}
                            inert={isOverflowing ? undefined : true}
                        >
                            {renderToggle({
                                controlsId: panelId,
                                isOpen: open === OVERFLOW_INDEX,
                                ref: (element) => setToggleRef(OVERFLOW_INDEX, element),
                                onPress: () => toggle(OVERFLOW_INDEX),
                                onKeyDown: (e) => handleToggleKeyDown(OVERFLOW_INDEX, e),
                                renderContent: (flags) => callSlot(slots.renderOverflowToggle, flags),
                            })}
                        </li>
                    </ul>

                    {fader.isVisible.value && (
                        <Teleport to={viewportContext.getPortalRef() ?? document.body}>
                            <div
                                ref={(target) => {
                                    setContentRef(target);
                                    panelRef.value = toElement(target);
                                }}
                                id={panelId}
                                class={FlyoutMenuStyles.flyoutMenuPanel}
                                style={{
                                    visibility: position.value ? "visible" : "hidden",
                                    transform: `translate(${position.value?.x ?? 0}px, ${position.value?.y ?? 0}px)`,
                                    transition: isGliding.value
                                        ? FlyoutMenuUtils.getGlideTransition(getTransitionDurationMs())
                                        : undefined,
                                    zIndex: zIndex.value,
                                    pointerEvents: open === undefined ? "none" : "auto",
                                    ...assignInlineVars({
                                        [FlyoutMenuStyles.bridgeTopVar]: `${-bridge.value.top}px`,
                                        [FlyoutMenuStyles.bridgeRightVar]: `${-bridge.value.right}px`,
                                        [FlyoutMenuStyles.bridgeBottomVar]: `${-bridge.value.bottom}px`,
                                        [FlyoutMenuStyles.bridgeLeftVar]: `${-bridge.value.left}px`,
                                    }),
                                }}
                                inert={open === undefined}
                                onKeydown={(e: KeyboardEvent) =>
                                    HoverCardUtils.handleCardKeyDown(
                                        e,
                                        toggleRefs.get(shownIndex.value ?? OVERFLOW_INDEX),
                                        panelRef.value,
                                    )
                                }
                            >
                                {callSlot(slots.renderPanel, {
                                    renderLinks: renderPanelLinks,
                                    visibilityTarget: fader.transitionTarget.value,
                                    transitionDurationMs: getTransitionDurationMs(),
                                    placement: placement.value,
                                    size: getPanelSize(),
                                })}
                            </div>
                        </Teleport>
                    )}
                </nav>
            );
        };
    },
    {
        name: "FlyoutMenu",
        slots: Object as SlotsType<FlyoutMenuSlots<any>>,
        props: declareProps<FlyoutMenuProps<unknown>>({
            ariaLabel: null,
            gap: null,
            placement: null,
            offset: null,
            transitionDurationMs: null,
            floaterTransitionDurationMs: null,
            hoverShowDelayMs: null,
            skipDelayWindowMs: null,
            computeToggleLabel: null,
            entries: null,
            linkComponent: null,
        }),
    },
);

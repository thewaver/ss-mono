import { For, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";

import { CSSUtils, StringUtils } from "@thewaver/ss-utils";

import { ElementFader } from "../../Abstracts/ElementFader/ElementFader";
import { ElementObserver } from "../../Abstracts/ElementObserver/ElementObserver";
import { InteractionTracker } from "../../Abstracts/InteractionTracker/InteractionTracker";
import { LiveAnnouncer } from "../../Abstracts/LiveAnnouncer/LiveAnnouncer";
import { useViewportContext } from "../../Exotics/Viewport/Viewport.context";
import { access, accessSignal } from "../../Utils/propUtils";
import type {
    Toast,
    ToastState,
    ToastsAlignment,
    ToastsAriaLive,
    ToastsDir,
    ToastsItemProps,
    ToastsOverflow,
    ToastsProps,
} from "./Toasts.types";
import { ToastsUtils } from "./Toasts.utils";

import * as styles from "./Toasts.css";

const DEFAULT_TOASTS_TRANSITION_DURATION_MS = 200;
const DEFAULT_TOASTS_ALIGNMENT: ToastsAlignment = "bottom-right";
const DEFAULT_TOASTS_DIR: ToastsDir = "column";
const DEFAULT_TOASTS_ARIA_LIVE: ToastsAriaLive = "polite";
const DEFAULT_TOASTS_OVERFLOW: ToastsOverflow = "dismiss-oldest";
const DEFAULT_TOASTS_GAP = 10;
const DEFAULT_TOASTS_HOTKEY = "F8";
const TOASTS_Z_INDEX = 200;

const ToastsItem = <T,>(props: ToastsItemProps<T>) => {
    const { getTransitionTarget, getHasTransitionFinished } = ElementFader.createFader(() => !access(props.isExiting), {
        getTransitionDurationMs: () => access(props.transitionDurationMs),
        onShow: () => access(props.toast).onShow?.(),
        onHide: () => access(props.toast).onHide?.(),
    });

    const getDurationMs = createMemo(() => access(props.toast).durationMs);

    const getState = createMemo((): ToastState => ({
        index: access(props.index),
        count: access(props.count),
        isPaused: access(props.isPaused),
        sizes: access(props.sizes),
    }));

    let clockDurationMs: number | undefined;
    let remainingMs = 0;

    createEffect(() => {
        const durationMs = getDurationMs();

        if (durationMs === undefined) return;

        if (durationMs !== clockDurationMs) {
            clockDurationMs = durationMs;
            remainingMs = durationMs;
        }

        if (access(props.isPaused)) return;

        const startedAtMs = performance.now();
        const elapseTimeout = setTimeout(() => props.onElapse(), remainingMs);

        onCleanup(() => {
            clearTimeout(elapseTimeout);

            remainingMs = Math.max(remainingMs - (performance.now() - startedAtMs), 0);
        });
    });

    createEffect(() => {
        if (!access(props.isExiting) || !getHasTransitionFinished()) return;

        props.onExitEnd();
    });

    return (
        <div class={styles.toastsItem} ref={(element) => props.ref(element)}>
            {props.renderToast(
                () => access(props.toast),
                getTransitionTarget,
                () => access(props.transitionDurationMs),
                getState,
            )}
        </div>
    );
};

export const Toasts = <T,>(props: ToastsProps<T>) => {
    const toastsSignal = accessSignal(() => props.toastsSignal);

    const viewportContext = useViewportContext();

    const [getEntryIds, setEntryIds] = createSignal<string[]>([]);
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getEntryRefs, setEntryRefs] = createSignal<Record<string, HTMLElement>>({});

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? DEFAULT_TOASTS_TRANSITION_DURATION_MS,
    );

    const getAlignment = createMemo(() => access(props.alignment) ?? DEFAULT_TOASTS_ALIGNMENT);

    const getDir = createMemo(() => access(props.dir) ?? DEFAULT_TOASTS_DIR);

    const getOverflow = createMemo(() => access(props.overflow) ?? DEFAULT_TOASTS_OVERFLOW);

    const getMargins = createMemo(() => access(props.margins) ?? CSSUtils.spreadMargin(0));

    const getStackAlignment = createMemo(() => ToastsUtils.computeStackAlignment(getAlignment(), getDir()));

    const getIsPaused = InteractionTracker.trackHold(getRootRef);

    const getEntrySizes = ElementObserver.createBorderBoxSizeListObserver(() =>
        getEntryIds().map((id) => getEntryRefs()[id]),
    );

    const setEntryRef = (id: string, element: HTMLElement) => {
        setEntryRefs((prev) => (prev[id] === element ? prev : { ...prev, [id]: element }));
    };

    const getHotkey = createMemo(() => access(props.hotkey) ?? DEFAULT_TOASTS_HOTKEY);

    const getAnnouncementPoliteness = createMemo(() => access(props.ariaLive) ?? DEFAULT_TOASTS_ARIA_LIVE);

    onMount(() => {
        if (props.computeAnnouncement === undefined) return;

        LiveAnnouncer.reserve("polite");
        LiveAnnouncer.reserve("assertive");
    });

    const getAdmitted = createMemo(() => {
        const toasts = toastsSignal[0]();
        const limit = access(props.limit);

        if (limit === undefined || toasts.length <= limit) return toasts;

        return getOverflow() === "hold-newest" ? toasts.slice(0, limit) : toasts.slice(toasts.length - limit);
    });

    const dismiss = (id: string) => {
        toastsSignal[1]((prev) => {
            const next = prev.filter((toast) => toast.id !== id);

            return next.length === prev.length ? prev : next;
        });
    };

    const handleExitEnd = (id: string) => {
        if (getAdmitted().some((toast) => toast.id === id)) return;

        setEntryIds((prev) => prev.filter((entryId) => entryId !== id));
        setEntryRefs((prev) => {
            if (!(id in prev)) return prev;

            const next = { ...prev };

            delete next[id];

            return next;
        });
    };

    createEffect(() => {
        const admitted = getAdmitted();

        setEntryIds((prev) => {
            const added = admitted.filter((toast) => !prev.includes(toast.id)).map((toast) => toast.id);

            return added.length > 0 ? [...prev, ...added] : prev;
        });
    });

    createEffect<string[]>((previous) => {
        const entryIds = getEntryIds();
        const computeAnnouncement = props.computeAnnouncement;

        if (!computeAnnouncement) return entryIds;

        for (const id of entryIds) {
            if (previous.includes(id)) continue;

            const toast = getAdmitted().find((entry) => entry.id === id);

            if (!toast) continue;

            LiveAnnouncer.announce(computeAnnouncement(toast), toast.ariaLive ?? getAnnouncementPoliteness());
        }

        return entryIds;
    }, []);

    createEffect(() => {
        const hotkey = getHotkey();
        const root = getRootRef();

        if (!root || hotkey.length === 0) return;

        let restoreRef: HTMLElement | undefined;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === hotkey) {
                if (root.contains(document.activeElement)) return;

                e.preventDefault();
                restoreRef = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
                root.focus();

                return;
            }

            if (e.key !== "Escape" || !root.contains(document.activeElement)) return;

            e.preventDefault();
            restoreRef?.focus();
            restoreRef = undefined;
        };

        document.addEventListener("keydown", handleKeyDown);

        onCleanup(() => {
            document.removeEventListener("keydown", handleKeyDown);
        });
    });

    createEffect(() => {
        const [getToasts, setToasts] = toastsSignal;
        const limit = access(props.limit);
        const toasts = getToasts();

        if (limit === undefined || getOverflow() !== "dismiss-oldest" || toasts.length <= limit) return;

        setToasts((prev) => prev.slice(prev.length - limit));
    });

    return (
        <Portal
            mount={viewportContext.getPortalRef()}
            ref={(el) => {
                el.style.display = "contents";
            }}
        >
            <div
                ref={setRootRef}
                class={styles.toastsRegion}
                style={{
                    ...CSSUtils.spreadableToStyle(getMargins(), (key) => StringUtils.camelToKebabCase(key)),
                    "flex-direction": getDir(),
                    "justify-content": getStackAlignment().justifyContent,
                    "align-items": getStackAlignment().alignItems,
                    "gap": `${access(props.gap) ?? DEFAULT_TOASTS_GAP}px`,
                    "z-index": TOASTS_Z_INDEX,
                }}
                role="region"
                tabindex={-1}
                aria-live={props.computeAnnouncement === undefined ? getAnnouncementPoliteness() : undefined}
                aria-label={access(props.ariaLabel)}
            >
                <For each={getEntryIds()}>
                    {(id, getIndex) => {
                        const findToast = () => getAdmitted().find((toast) => toast.id === id);
                        const getToast = createMemo((prev: Toast<T>) => findToast() ?? prev, findToast()!);

                        return (
                            <ToastsItem
                                toast={getToast}
                                index={getIndex}
                                count={() => getEntryIds().length}
                                isExiting={() => findToast() === undefined}
                                isPaused={getIsPaused}
                                transitionDurationMs={getTransitionDurationMs}
                                sizes={getEntrySizes}
                                ref={(element) => setEntryRef(id, element)}
                                renderToast={props.renderToast}
                                onElapse={() => dismiss(id)}
                                onExitEnd={() => handleExitEnd(id)}
                            />
                        );
                    }}
                </For>
            </div>
        </Portal>
    );
};

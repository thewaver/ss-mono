<script lang="ts" generics="T">
    import { onMount, untrack } from "svelte";

    import {
        LiveAnnouncerUtils,
        type NavigatorDirection,
        TOASTS_DEFAULTS,
        type ToastRequest,
        type ToastsContextType,
        ToastUtils,
        ToastsStyles as styles,
    } from "@thewaver/ss-components";
    import { CSSUtils } from "@thewaver/ss-utils";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { getViewportContext } from "../../../Abstracts/Viewport/Viewport.context.js";
    import { attachPortal } from "../../../Utils/portalUtils.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import { setToastsContext } from "./Toasts.context.js";
    import type { Toast, ToastsProps } from "./Toasts.types.js";
    import ToastsItem from "./ToastsItem.svelte";

    const DEFAULT_MARGINS = CSSUtils.spreadMargin(0);

    let { toasts = $bindable([]), children, ...props }: ToastsProps<T> = $props();

    const viewportContext = getViewportContext();
    const portalTarget = $derived(viewportContext.getPortalRef() ?? document.body);

    const registerOwner = {};

    const directions = new Map<string, NavigatorDirection>();

    const lastSeen = new Map<string, Toast<T>>();

    let root = $state<HTMLDivElement>();
    let entryIds = $state.raw<string[]>([]);
    let entryRefs = $state.raw<Record<string, HTMLElement>>({});

    const transitionDurationMs = $derived(props.transitionDurationMs ?? TOASTS_DEFAULTS.transitionDurationMs);
    const alignment = $derived(props.alignment ?? TOASTS_DEFAULTS.alignment);
    const flexDirection = $derived(props.flexDirection ?? TOASTS_DEFAULTS.flexDirection);
    const overflow = $derived(props.overflow ?? TOASTS_DEFAULTS.overflow);
    const margins = $derived(props.margins ?? DEFAULT_MARGINS);
    const stackAlignment = $derived(ToastUtils.computeStackAlignment(alignment, flexDirection));
    const swipeDirection = $derived(
        (props.isDismissableOnSwipe ?? TOASTS_DEFAULTS.isDismissableOnSwipe)
            ? ToastUtils.computeSwipeDirection(alignment)
            : undefined,
    );

    const getIsPaused = InteractionTrackerSvelteUtils.trackHold(() => root ?? undefined);

    const getEntrySizes = ElementObserverSvelteUtils.createBorderBoxSizeListObserver(() =>
        entryIds.map((id) => entryRefs[id]),
    );

    const admitted = $derived.by(() => {
        const next = ToastUtils.computeAdmitted(toasts, props.limit, overflow);

        for (const toast of next) lastSeen.set(toast.id, toast);

        return next;
    });

    onMount(() => {
        LiveAnnouncerUtils.reserve("polite");
        LiveAnnouncerUtils.reserve("assertive");
    });

    $effect(() => {
        const region = root;
        const scope = portalTarget;
        const stackAlignmentKey = alignment;

        if (!region) return;

        return untrack(() =>
            ToastUtils.registerStack(registerOwner, {
                region,
                scope,
                alignment: stackAlignmentKey,
                getHasToasts: () => untrack(() => admitted).length > 0,
            }),
        );
    });

    const show = (toast: ToastRequest<Toast<T>>) => {
        const prev = untrack(() => toasts);
        const { toasts: next, id } = ToastUtils.withRequestedToast(prev, toast);

        if (id === undefined) return undefined;

        directions.set(id, ToastUtils.readRaiserDirection());
        toasts = next;

        return id;
    };

    const dismiss = (id: string) => {
        const prev = untrack(() => toasts);
        const next = ToastUtils.withoutToast(prev, id);

        if (next === prev) return false;

        toasts = next;

        return true;
    };

    const context: ToastsContextType<Toast<T>> = { show, dismiss };

    setToastsContext(context as ToastsContextType<Toast<unknown>>);

    $effect(() => {
        const next = admitted;

        entryIds = ToastUtils.computeEntryIds(untrack(() => entryIds), next);
    });

    let announcedIds: string[] = [];

    $effect(() => {
        const ids = entryIds;

        untrack(() => {
            const previous = announcedIds;

            announcedIds = ids;

            ToastUtils.announceArrivals(previous, ids, admitted);
        });
    });

    $effect(() => {
        const trimmed = ToastUtils.computeOverflowTrim(toasts, props.limit, overflow);

        if (trimmed) untrack(() => (toasts = trimmed));
    });

    const handleExitEnd = (id: string) => {
        if (admitted.some((toast) => toast.id === id)) return;

        lastSeen.delete(id);
        directions.delete(id);
        entryIds = entryIds.filter((entryId) => entryId !== id);

        if (!(id in entryRefs)) return;

        const next = { ...entryRefs };

        delete next[id];

        entryRefs = next;
    };

    const setEntryRef = (id: string, element: HTMLElement | undefined) =>
        untrack(() => {
            if (!element || entryRefs[id] === element) return;

            entryRefs = { ...entryRefs, [id]: element };
        });

    const style = $derived(
        toStyle({
            ...CSSUtils.spreadableToStyle(margins, (key) => key),
            flexDirection,
            justifyContent: stackAlignment.justifyContent,
            alignItems: stackAlignment.alignItems,
            gap: `${props.gap ?? TOASTS_DEFAULTS.gap}px`,
            zIndex: ToastUtils.Z_INDEX,
        }),
    );
</script>

{@render children?.()}

{#if portalTarget}
    <div
        bind:this={root}
        {@attach attachPortal(portalTarget)}
        class={styles.toastsRegion}
        {style}
        dir="ltr"
        role="region"
        tabindex="-1"
        aria-label={props.ariaLabel}
    >
        {#each entryIds as id, index (id)}
            {@const toast = admitted.find((entry) => entry.id === id) ?? lastSeen.get(id)}
            {#if toast}
                <ToastsItem
                    bind:ref={() => entryRefs[id], (element) => setEntryRef(id, element)}
                    {toast}
                    {index}
                    count={entryIds.length}
                    isExiting={!admitted.some((entry) => entry.id === id)}
                    isPaused={getIsPaused()}
                    {transitionDurationMs}
                    sizes={getEntrySizes()}
                    {swipeDirection}
                    direction={directions.get(id) ?? ToastUtils.readPageDirection()}
                    renderDefaultToast={props.renderToast}
                    onElapse={() => dismiss(id)}
                    onSwipeDismiss={() => dismiss(id)}
                    onDismiss={() => dismiss(id)}
                    onExitEnd={() => handleExitEnd(id)}
                />
            {/if}
        {/each}
    </div>
{/if}

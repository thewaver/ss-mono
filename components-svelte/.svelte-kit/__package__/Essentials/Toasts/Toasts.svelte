<script lang="ts" generics="T">
    import { untrack } from "svelte";

    import {
        LiveAnnouncerUtils,
        TOASTS_DEFAULTS,
        type Toast,
        ToastUtils,
        ToastsStyles as styles,
    } from "@thewaver/ss-components";
    import { CSSUtils } from "@thewaver/ss-utils";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { getViewportContext } from "../../Abstracts/Viewport/Viewport.context.js";
    import { attachPortal } from "../../Utils/portalUtils.js";
    import { toStyle } from "../../Utils/styleUtils.js";
    import type { ToastsProps } from "./Toasts.types.js";
    import ToastsItem from "./ToastsItem.svelte";

    const DEFAULT_MARGINS = CSSUtils.spreadMargin(0);

    let { toasts = $bindable(), ...props }: ToastsProps<T> = $props();

    const viewportContext = getViewportContext();
    const portalTarget = $derived(viewportContext.getPortalRef() ?? document.body);

    const lastSeen = new Map<string, Toast<T>>();

    let root = $state<HTMLDivElement>();
    let entryIds = $state.raw<string[]>([]);
    let entryRefs = $state.raw<Record<string, HTMLElement>>({});

    const transitionDurationMs = $derived(props.transitionDurationMs ?? TOASTS_DEFAULTS.transitionDurationMs);
    const alignment = $derived(props.alignment ?? TOASTS_DEFAULTS.alignment);
    const dir = $derived(props.dir ?? TOASTS_DEFAULTS.dir);
    const overflow = $derived(props.overflow ?? TOASTS_DEFAULTS.overflow);
    const margins = $derived(props.margins ?? DEFAULT_MARGINS);
    const hotkey = $derived(props.hotkey ?? TOASTS_DEFAULTS.hotkey);
    const politeness = $derived(props.ariaLive ?? TOASTS_DEFAULTS.ariaLive);
    const stackAlignment = $derived(ToastUtils.computeStackAlignment(alignment, dir));
    const swipeDirection = $derived(
        (props.isDismissableOnSwipe ?? TOASTS_DEFAULTS.isDismissableOnSwipe)
            ? ToastUtils.computeSwipeDirection(alignment)
            : undefined,
    );
    const hasAnnouncer = $derived(props.computeAnnouncement !== undefined);

    const getIsPaused = InteractionTrackerSvelteUtils.trackHold(() => root ?? undefined);

    const getEntrySizes = ElementObserverSvelteUtils.createBorderBoxSizeListObserver(() =>
        entryIds.map((id) => entryRefs[id]),
    );

    const admitted = $derived.by(() => {
        const next = ToastUtils.computeAdmitted(toasts, props.limit, overflow);

        for (const toast of next) lastSeen.set(toast.id, toast);

        return next;
    });

    $effect(() => {
        if (!hasAnnouncer) return;

        untrack(() => {
            LiveAnnouncerUtils.reserve("polite");
            LiveAnnouncerUtils.reserve("assertive");
        });
    });

    $effect(() => {
        const next = admitted;

        entryIds = ToastUtils.computeEntryIds(untrack(() => entryIds), next);
    });

    let announcedIds: string[] = [];

    $effect(() => {
        const ids = entryIds;

        untrack(() => {
            const previous = announcedIds;
            const computeAnnouncement = props.computeAnnouncement;

            announcedIds = ids;

            if (!computeAnnouncement) return;

            ToastUtils.announceArrivals(previous, ids, admitted, computeAnnouncement, politeness);
        });
    });

    $effect(() => {
        const element = root;
        const key = hotkey;

        if (!element) return;

        return untrack(() => ToastUtils.observeHotkey(element, key));
    });

    $effect(() => {
        const trimmed = ToastUtils.computeOverflowTrim(toasts, props.limit, overflow);

        if (trimmed) untrack(() => (toasts = trimmed));
    });

    const dismiss = (id: string) => {
        const next = ToastUtils.withoutToast(toasts, id);

        if (next !== toasts) toasts = next;
    };

    const handleExitEnd = (id: string) => {
        if (admitted.some((toast) => toast.id === id)) return;

        lastSeen.delete(id);
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
            flexDirection: dir,
            justifyContent: stackAlignment.justifyContent,
            alignItems: stackAlignment.alignItems,
            gap: `${props.gap ?? TOASTS_DEFAULTS.gap}px`,
            zIndex: ToastUtils.Z_INDEX,
        }),
    );
</script>

{#if portalTarget}
    <div
        bind:this={root}
        {@attach attachPortal(portalTarget)}
        class={styles.toastsRegion}
        {style}
        role="region"
        tabindex="-1"
        aria-live={hasAnnouncer ? undefined : politeness}
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
                    renderToast={props.renderToast}
                    onElapse={() => dismiss(id)}
                    onSwipeDismiss={() => dismiss(id)}
                    onExitEnd={() => handleExitEnd(id)}
                />
            {/if}
        {/each}
    </div>
{/if}

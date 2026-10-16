<script lang="ts" generics="T">
    import { on } from "svelte/events";

    import {
        CarouselUtils,
        INFINITE_CORRIDOR_DEFAULTS,
        type InfiniteCorridorItemState,
        InfiniteCorridorUtils,
        InfiniteCorridorStyles as styles,
    } from "@thewaver/ss-components";
    import { InfiniteCorridorConst } from "@thewaver/ss-components/internal";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import type { InfiniteCorridorProps } from "./InfiniteCorridor.types.js";

    let { progress = $bindable(InfiniteCorridorConst.NO_PROGRESS), ...props }: InfiniteCorridorProps<T> = $props();

    let root = $state<HTMLDivElement>();

    const itemRefs: (HTMLElement | undefined)[] = [];

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);

    const count = $derived(props.items.length);
    const behindDistance = $derived(props.layout.behindDistance);

    const copies = $derived(
        InfiniteCorridorUtils.getCopyCount(
            count,
            props.layout.reach,
            props.layout.behindDistance,
            props.layout.placeMultiple?.(count),
        ),
    );

    const placeCount = $derived(count * copies);
    const position = $derived(InfiniteCorridorUtils.toPosition(progress, count));

    let followedRing: number | undefined;

    const ringPosition = $derived.by(() => {
        followedRing = InfiniteCorridorUtils.followCopies(followedRing, position, count, copies);

        return followedRing;
    });

    const places = $derived(
        Array.from({ length: placeCount }, (_, order) => Math.floor(order / copies) + (order % copies) * count),
    );

    const viewDistance = $derived(InfiniteCorridorUtils.getViewDistance(props.layout.viewDistance, count));

    const toIndex = (place: number) => place % Math.max(count, 1);

    const getDistance = (place: number) =>
        InfiniteCorridorUtils.getDistance(place, ringPosition ?? 0, placeCount, behindDistance);

    const getIsCopy = (place: number) =>
        place !==
        InfiniteCorridorUtils.getRealPlace(toIndex(place), ringPosition ?? 0, count, copies, behindDistance);

    let stopGlide: (() => void) | undefined;
    let recentWrites: number[] = [];

    const glideTo = (place: number) => {
        const glideCount = count;
        const from = position;

        stopGlide?.();

        stopGlide = CarouselUtils.glide({
            from,
            to: InfiniteCorridorUtils.getGlideTarget(from, getDistance(place), viewDistance),
            durationMs: props.glideDurationMs ?? INFINITE_CORRIDOR_DEFAULTS.glideDurationMs,
            onFrame: (next) => {
                const written = InfiniteCorridorUtils.toProgress(next, glideCount);

                recentWrites = InfiniteCorridorUtils.rememberWrite(recentWrites, written);
                progress = written;
            },
        });
    };

    watchChange(
        () => progress,
        (next) => {
            if (!InfiniteCorridorUtils.getIsEcho(next, recentWrites)) stopGlide?.();
        },
    );

    $effect(() => () => stopGlide?.());

    const handleFocusIn = (e: FocusEvent) => {
        const place = itemRefs.findIndex((element) => element?.contains(e.target as Node));

        if (place < 0 || InfiniteCorridorUtils.getIsInView(getDistance(place), viewDistance)) return;

        glideTo(place);
    };

    const getState = (place: number): InfiniteCorridorItemState => ({
        index: toIndex(place),
        count,
        distance: getDistance(place),
        isCopy: getIsCopy(place),
    });

    const setStyle = (element: HTMLElement, style: Record<string, string>) => {
        for (const [name, value] of Object.entries(style)) element.style.setProperty(name, value);
    };

    const attachItem = (place: number) => (element: HTMLElement) => {
        itemRefs[place] = element;

        const placement = props.layout.place({
            distance: getDistance(place),
            place,
            placeCount,
            index: toIndex(place),
            count,
            size: getSize(),
        });

        setStyle(element, InfiniteCorridorUtils.toItemStyle(placement, getDistance(place)));

        return () => {
            itemRefs[place] = undefined;
        };
    };
</script>

<div
    bind:this={root}
    {@attach (element) => on(element, "focusin", handleFocusIn)}
    class={styles.infiniteCorridorRoot}
    role="region"
    aria-roledescription={props.roleDescription ?? INFINITE_CORRIDOR_DEFAULTS.roleDescription}
    aria-label={props.ariaLabel}
>
    {#each places as place (place)}
        <div
            {@attach attachItem(place)}
            class={styles.infiniteCorridorItem}
            aria-hidden={getIsCopy(place) ? "true" : undefined}
            inert={getIsCopy(place)}
        >
            {@render props.renderItem(props.items[toIndex(place)], getState(place))}
        </div>
    {/each}
</div>

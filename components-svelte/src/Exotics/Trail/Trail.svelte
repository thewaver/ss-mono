<script lang="ts">
    import { untrack } from "svelte";

    import { TRAIL_DEFAULTS, TrailUtils, TrailStyles as styles } from "@thewaver/ss-components";
    import { MathUtils } from "@thewaver/ss-utils";

    import { InteractionTrackerSvelteUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import type { TrailController, TrailProps } from "./Trail.types.js";

    const NO_LENGTH = 0;
    const NO_PROGRESS = 0;
    const NO_OFFSET = 0;

    let { progress = $bindable(NO_PROGRESS), playback = $bindable(true), ...props }: TrailProps = $props();

    let path = $state<SVGPathElement>();
    let pathLength = $state(NO_LENGTH);

    const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();

    const durationMs = $derived(props.durationMs ?? TRAIL_DEFAULTS.durationMs);
    const isLooping = $derived(props.isLooping ?? false);
    const isTurning = $derived(props.isTurning ?? false);
    const isDisabled = $derived(props.isDisabled ?? false);
    const followerOffsets = $derived(props.followerOffsets ?? TRAIL_DEFAULTS.followerOffsets);
    const runExtent = $derived(TrailUtils.getRunExtent(followerOffsets, isLooping));

    const isRunning = $derived(playback && !isDisabled && !getIsPageHidden() && pathLength > NO_LENGTH);

    $effect(() => {
        const element = path;

        void props.path;

        pathLength = element ? element.getTotalLength() : NO_LENGTH;
    });

    const computePlace = (offset: number) =>
        TrailUtils.computePlace(
            path ?? undefined,
            pathLength,
            TrailUtils.getTravelerProgress(progress, offset, runExtent, isLooping),
        );

    const places = $derived(followerOffsets.map(computePlace));
    const place = $derived(computePlace(NO_OFFSET));

    const controller: TrailController = {
        getPlace: () => place,
        getIsPlaying: () => playback,
        seek: (target: number) => {
            const next = MathUtils.clamp01(target);

            if (next === progress) return false;

            progress = next;

            return true;
        },
    };

    $effect(() => {
        untrack(() => props.onMount?.(controller));
    });

    $effect(() => {
        if (!isRunning) return;

        return untrack(() =>
            TrailUtils.run({
                getProgress: () => progress,
                setProgress: (value) => {
                    progress = value;
                },
                getRunDurationMs: () => durationMs * runExtent,
                getIsLooping: () => isLooping,
                onLap: () => props.onLap?.(),
                onEnd: () => {
                    playback = false;
                },
            }),
        );
    });
</script>

<div class={styles.trailRoot} style:width={`${props.size.width}px`} style:height={`${props.size.height}px`}>
    <svg class={styles.trailTrack} viewBox={`0 0 ${props.size.width} ${props.size.height}`} aria-hidden="true">
        <path bind:this={path} class={styles.trailPath} d={props.path} />

        {@render props.renderTrack?.(props.path)}
    </svg>

    {#each places as travelerPlace, index (index)}
        <div class={styles.trailTraveler} style:transform={TrailUtils.getTravelerTransform(travelerPlace, isTurning)}>
            {@render props.renderTraveler(travelerPlace, index)}
        </div>
    {/each}
</div>

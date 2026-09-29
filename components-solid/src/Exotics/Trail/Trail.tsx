import { Index, createEffect, createMemo, createSignal, onCleanup, onMount, untrack } from "solid-js";

import { TRAIL_DEFAULTS, type TrailPlace, TrailUtils, TrailStyles as styles } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import { InteractionTrackerSolidUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../Utils/propUtils";
import type { TrailController, TrailProps } from "./TrailSolid.types";

const NO_LENGTH = 0;
const NO_PROGRESS = 0;
const NO_OFFSET = 0;

export const Trail = (props: TrailProps) => {
    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(() => props.progress, NO_PROGRESS);
    const [getIsPlaying, setIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);

    const [getPathRef, setPathRef] = createSignal<SVGPathElement>();
    const [getPathLength, setPathLength] = createSignal(NO_LENGTH);

    const getIsPageHidden = InteractionTrackerSolidUtils.trackPageHidden();

    const getPath = createMemo(() => access(props.path));

    const getSize = createMemo(() => access(props.size));

    const getDurationMs = createMemo(() => access(props.durationMs) ?? TRAIL_DEFAULTS.durationMs);

    const getIsLooping = createMemo(() => access(props.isLooping) ?? false);

    const getIsTurning = createMemo(() => access(props.isTurning) ?? false);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getFollowerOffsets = createMemo(() => access(props.followerOffsets) ?? TRAIL_DEFAULTS.followerOffsets);

    const getRunExtent = createMemo(() => TrailUtils.getRunExtent(getFollowerOffsets(), getIsLooping()));

    const getIsRunning = createMemo(
        () => getIsPlaying() && !getIsDisabled() && !getIsPageHidden() && getPathLength() > NO_LENGTH,
    );

    const computePlace = (offset: number): TrailPlace =>
        TrailUtils.computePlace(
            getPathRef(),
            getPathLength(),
            TrailUtils.getTravelerProgress(getProgress(), offset, getRunExtent(), getIsLooping()),
        );

    const getPlace = createMemo(() => computePlace(NO_OFFSET));

    const getPlaces = createMemo(() => getFollowerOffsets().map((offset) => computePlace(offset)));

    const controller: TrailController = {
        getPlace,
        getIsPlaying,
        seek: (progress: number) => {
            const next = MathUtils.clamp01(progress);

            if (next === untrack(getProgress)) return false;

            setProgress(next);

            return true;
        },
    };

    createEffect(() => {
        const path = getPathRef();

        getPath();

        setPathLength(path ? path.getTotalLength() : NO_LENGTH);
    });

    createEffect(() => {
        if (!getIsRunning()) return;

        onCleanup(
            TrailUtils.run({
                getProgress: () => untrack(getProgress),
                setProgress,
                getRunDurationMs: () => getDurationMs() * getRunExtent(),
                getIsLooping,
                onLap: () => props.onLap?.(),
                onEnd: () => setIsPlaying(false),
            }),
        );
    });

    onMount(() => {
        props.onMount?.(controller);
    });

    return (
        <div class={styles.trailRoot} style={{ width: `${getSize().width}px`, height: `${getSize().height}px` }}>
            <svg class={styles.trailTrack} viewBox={`0 0 ${getSize().width} ${getSize().height}`} aria-hidden="true">
                <path ref={setPathRef} class={styles.trailPath} d={getPath()} />

                {props.renderTrack?.(getPath)}
            </svg>

            <Index each={getFollowerOffsets()}>
                {(_unused, index) => {
                    const getTravelerPlace = () => getPlaces()[index];

                    return (
                        <div
                            class={styles.trailTraveler}
                            style={{ transform: TrailUtils.getTravelerTransform(getTravelerPlace(), getIsTurning()) }}
                        >
                            {props.renderTraveler(getTravelerPlace, index)}
                        </div>
                    );
                }}
            </Index>
        </div>
    );
};

import { Index, createEffect, createMemo, createSignal, onCleanup, onMount, untrack } from "solid-js";

import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import { InteractionTrackerUtils } from "../../Abstracts/InteractionTracker/InteractionTracker.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../Utils/propUtils";
import { TRAIL_DEFAULTS } from "./Trail.const";
import type { TrailController, TrailPlace, TrailProps } from "./Trail.types";
import { TrailUtils } from "./Trail.utils";

import * as styles from "./Trail.css";

const NO_LENGTH = 0;
const NO_PROGRESS = 0;
const NO_ANGLE = 0;
const NO_OFFSET = 0;
const ORIGIN: Point2d = { x: 0, y: 0 };
const SAMPLE_STEP_PX = 1;

export const Trail = (props: TrailProps) => {
    const [getProgress, setProgress] = SignalMirrorUtils.createOptional(() => props.progressSignal, NO_PROGRESS);
    const [getIsPlaying, setIsPlaying] = SignalMirrorUtils.createOptional(() => props.playbackSignal, true);

    const [getPathRef, setPathRef] = createSignal<SVGPathElement>();
    const [getPathLength, setPathLength] = createSignal(NO_LENGTH);

    const getIsPageHidden = InteractionTrackerUtils.trackPageHidden();

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

    const computePlace = (offset: number): TrailPlace => {
        const path = getPathRef();
        const length = getPathLength();
        const progress = TrailUtils.getTravelerProgress(getProgress(), offset, getRunExtent(), getIsLooping());

        if (!path || length <= NO_LENGTH) return { progress, point: ORIGIN, angle: NO_ANGLE };

        const at = length * progress;
        const span = TrailUtils.getSampleSpan(length, at, SAMPLE_STEP_PX);
        const point = path.getPointAtLength(at);
        const behind = path.getPointAtLength(span.from);
        const ahead = path.getPointAtLength(span.to);

        return {
            progress,
            point: { x: point.x, y: point.y },
            angle: TrailUtils.getAngle(behind, ahead),
        };
    };

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

        let frameId: number | undefined;
        let lastMs = performance.now();

        const advance = () => {
            const nowMs = performance.now();
            const step = TrailUtils.getSteppedProgress(
                untrack(getProgress),
                nowMs - lastMs,
                getDurationMs() * getRunExtent(),
                getIsLooping(),
            );

            lastMs = nowMs;
            setProgress(step.progress);

            if (step.hasLapped) {
                props.onLap?.();

                if (!getIsLooping()) {
                    setIsPlaying(false);

                    return;
                }
            }

            frameId = requestAnimationFrame(advance);
        };

        frameId = requestAnimationFrame(advance);

        onCleanup(() => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);
        });
    });

    onMount(() => {
        props.onMount?.(controller);
    });

    const getTravelerTransform = (place: TrailPlace) => {
        const turn = getIsTurning() ? ` rotate(${place.angle}deg)` : "";

        return `translate(${place.point.x}px, ${place.point.y}px) translate(-50%, -50%)${turn}`;
    };

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
                            style={{ transform: getTravelerTransform(getTravelerPlace()) }}
                        >
                            {props.renderTraveler(getTravelerPlace, index)}
                        </div>
                    );
                }}
            </Index>
        </div>
    );
};

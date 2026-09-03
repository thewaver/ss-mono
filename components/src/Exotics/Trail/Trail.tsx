import { createEffect, createMemo, createSignal, onCleanup, onMount, untrack } from "solid-js";

import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import { InteractionTracker } from "../../Abstracts/InteractionTracker/InteractionTracker";
import { SignalMirror } from "../../Abstracts/SignalMirror/SignalMirror";
import { access } from "../../Utils/propUtils";
import type { TrailController, TrailPlace, TrailProps } from "./Trail.types";
import { TrailUtils } from "./Trail.utils";

import * as styles from "./Trail.css";

const DEFAULT_TRAIL_DURATION_MS = 4000;
const NO_LENGTH = 0;
const NO_PROGRESS = 0;
const NO_ANGLE = 0;
const ORIGIN: Point2d = { x: 0, y: 0 };
const SAMPLE_STEP_PX = 1;

export const Trail = (props: TrailProps) => {
    const [getProgress, setProgress] = SignalMirror.createOptional(() => props.progressSignal, NO_PROGRESS);
    const [getIsPlaying, setIsPlaying] = SignalMirror.createOptional(() => props.isPlayingSignal, true);

    const [getPathRef, setPathRef] = createSignal<SVGPathElement>();
    const [getPathLength, setPathLength] = createSignal(NO_LENGTH);

    const getIsPageHidden = InteractionTracker.trackPageHidden();

    const getPath = createMemo(() => access(props.path));

    const getSize = createMemo(() => access(props.size));

    const getDurationMs = createMemo(() => access(props.durationMs) ?? DEFAULT_TRAIL_DURATION_MS);

    const getIsLooping = createMemo(() => access(props.isLooping) ?? false);

    const getIsTurning = createMemo(() => access(props.isTurning) ?? false);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsRunning = createMemo(
        () => getIsPlaying() && !getIsDisabled() && !getIsPageHidden() && getPathLength() > NO_LENGTH,
    );

    const getPlace = createMemo((): TrailPlace => {
        const path = getPathRef();
        const length = getPathLength();
        const progress = MathUtils.clamp01(getProgress());

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
    });

    const controller: TrailController = {
        getPlace,
        getIsPlaying,
        play: () => setIsPlaying(true),
        pause: () => setIsPlaying(false),
        seek: (progress: number) => setProgress(MathUtils.clamp01(progress)),
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
                getDurationMs(),
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

    const getTravellerTransform = () => {
        const place = getPlace();
        const turn = getIsTurning() ? ` rotate(${place.angle}deg)` : "";

        return `translate(${place.point.x}px, ${place.point.y}px) translate(-50%, -50%)${turn}`;
    };

    return (
        <div class={styles.trailRoot} style={{ width: `${getSize().width}px`, height: `${getSize().height}px` }}>
            <svg class={styles.trailTrack} viewBox={`0 0 ${getSize().width} ${getSize().height}`} aria-hidden="true">
                <path ref={setPathRef} class={styles.trailPath} d={getPath()} />

                {props.renderTrack?.(getPath)}
            </svg>

            <div class={styles.trailTraveller} style={{ transform: getTravellerTransform() }}>
                {props.renderTraveller(getPlace)}
            </div>
        </div>
    );
};

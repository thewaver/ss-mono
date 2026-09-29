import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { TRAIL_DEFAULTS, type TrailPlace, TrailStyles, TrailUtils } from "@thewaver/ss-components";
import { MathUtils, StoreUtils } from "@thewaver/ss-utils";

import { InteractionTrackerReactUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest } from "../../Utils/refUtils";
import type { TrailController, TrailProps } from "./Trail.types";

const NO_LENGTH = 0;
const NO_PROGRESS = 0;
const NO_OFFSET = 0;

type TrailSnapshot = {
    place: TrailPlace;
    isPlaying: boolean;
};

const getIsSameSnapshot = (a: TrailSnapshot, b: TrailSnapshot) =>
    a.isPlaying === b.isPlaying &&
    a.place.progress === b.place.progress &&
    a.place.angle === b.place.angle &&
    a.place.point.x === b.place.point.x &&
    a.place.point.y === b.place.point.y;

export const Trail = (props: TrailProps) => {
    const [progress, setProgressState] = SignalMirrorReactUtils.useOptionalState(props.progress, NO_PROGRESS);
    const [isPlaying, setIsPlaying] = SignalMirrorReactUtils.useOptionalState(props.playback, true);

    const pathRef = useRef<SVGPathElement | null>(null);
    const [pathLength, setPathLength] = useState(NO_LENGTH);

    const isPageHidden = InteractionTrackerReactUtils.usePageHidden();

    const durationMs = props.durationMs ?? TRAIL_DEFAULTS.durationMs;
    const isLooping = props.isLooping ?? false;
    const isTurning = props.isTurning ?? false;
    const isDisabled = props.isDisabled ?? false;
    const followerOffsets = props.followerOffsets ?? TRAIL_DEFAULTS.followerOffsets;
    const runExtent = TrailUtils.getRunExtent(followerOffsets, isLooping);

    const isRunning = isPlaying && !isDisabled && !isPageHidden && pathLength > NO_LENGTH;

    const progressRef = useLatest(progress);

    const setProgress = (value: number) => {
        progressRef.current = value;
        setProgressState(value);
    };

    const latest = useLatest({ props, durationMs, runExtent, isLooping, setProgress, setIsPlaying });

    useLayoutEffect(() => {
        setPathLength(pathRef.current ? pathRef.current.getTotalLength() : NO_LENGTH);
    }, [props.path]);

    const computePlace = (offset: number) =>
        TrailUtils.computePlace(
            pathRef.current ?? undefined,
            pathLength,
            TrailUtils.getTravelerProgress(progress, offset, runExtent, isLooping),
        );

    const places = followerOffsets.map(computePlace);
    const snapshot: TrailSnapshot = { place: computePlace(NO_OFFSET), isPlaying };

    const [controllerStore] = useState(() => StoreUtils.create(snapshot, { isEqual: getIsSameSnapshot }));

    useLayoutEffect(() => {
        controllerStore.set(snapshot);
    });

    const [controller] = useState<TrailController>(() => ({
        getPlace: () => controllerStore.get().place,
        getIsPlaying: () => controllerStore.get().isPlaying,
        seek: (target: number) => {
            const next = MathUtils.clamp01(target);

            if (next === progressRef.current) return false;

            latest.current.setProgress(next);

            return true;
        },
        subscribe: controllerStore.subscribe,
    }));

    useEffect(() => {
        latest.current.props.onMount?.(controller);
    }, [controller]);

    useEffect(() => {
        if (!isRunning) return;

        return TrailUtils.run({
            getProgress: () => progressRef.current,
            setProgress: (value) => latest.current.setProgress(value),
            getRunDurationMs: () => latest.current.durationMs * latest.current.runExtent,
            getIsLooping: () => latest.current.isLooping,
            onLap: () => latest.current.props.onLap?.(),
            onEnd: () => latest.current.setIsPlaying(false),
        });
    }, [isRunning]);

    return (
        <div
            className={TrailStyles.trailRoot}
            style={{ width: `${props.size.width}px`, height: `${props.size.height}px` }}
        >
            <svg
                className={TrailStyles.trailTrack}
                viewBox={`0 0 ${props.size.width} ${props.size.height}`}
                aria-hidden="true"
            >
                <path ref={pathRef} className={TrailStyles.trailPath} d={props.path} />

                {props.renderTrack?.(props.path)}
            </svg>

            {places.map((place, index) => (
                <div
                    key={index}
                    className={TrailStyles.trailTraveler}
                    style={{ transform: TrailUtils.getTravelerTransform(place, isTurning) }}
                >
                    {props.renderTraveler(place, index)}
                </div>
            ))}
        </div>
    );
};

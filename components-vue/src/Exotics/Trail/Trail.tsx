import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import { TRAIL_DEFAULTS, TrailStyles, TrailUtils } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import { InteractionTrackerVueUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { TrailController, TrailProps, TrailSlots } from "./Trail.types";

const NO_LENGTH = 0;
const NO_PROGRESS = 0;
const NO_OFFSET = 0;

export const Trail = defineComponent(
    (props: TrailProps, { slots }: SlotsContext<TrailSlots>) => {
        const progress = useTwoWay(props, "progress", NO_PROGRESS);
        const isPlaying = useTwoWay(props, "playback", true);

        const pathRef = shallowRef<SVGPathElement>();
        const pathLength = shallowRef(NO_LENGTH);

        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();

        const getDurationMs = () => props.durationMs ?? TRAIL_DEFAULTS.durationMs;
        const getIsLooping = () => props.isLooping ?? false;
        const getFollowerOffsets = () => props.followerOffsets ?? TRAIL_DEFAULTS.followerOffsets;
        const getRunExtent = () => TrailUtils.getRunExtent(getFollowerOffsets(), getIsLooping());

        const isRunning = computed(
            () =>
                isPlaying.value &&
                !(props.isDisabled ?? false) &&
                !isPageHidden.value &&
                pathLength.value > NO_LENGTH,
        );

        watchAfterRender([() => props.path], () => {
            pathLength.value = pathRef.value ? pathRef.value.getTotalLength() : NO_LENGTH;
        });

        const computePlace = (offset: number) =>
            TrailUtils.computePlace(
                pathRef.value,
                pathLength.value,
                TrailUtils.getTravelerProgress(progress.value, offset, getRunExtent(), getIsLooping()),
            );

        const leadPlace = computed(() => computePlace(NO_OFFSET));

        const controller: TrailController = {
            getPlace: () => leadPlace.value,
            getIsPlaying: () => isPlaying.value,
            seek: (target: number) => {
                const next = MathUtils.clamp01(target);

                if (next === progress.value) return false;

                progress.value = next;

                return true;
            },
        };

        watchAfterRender([], () => {
            props.onMount?.(controller);
        });

        watchAfterRender([isRunning], ([running]) => {
            if (!running) return;

            return TrailUtils.run({
                getProgress: () => progress.value,
                setProgress: (value) => {
                    progress.value = value;
                },
                getRunDurationMs: () => getDurationMs() * getRunExtent(),
                getIsLooping,
                onLap: () => props.onLap?.(),
                onEnd: () => {
                    isPlaying.value = false;
                },
            });
        });

        return () => {
            const isTurning = props.isTurning ?? false;
            const places = getFollowerOffsets().map(computePlace);

            return (
                <div
                    class={TrailStyles.trailRoot}
                    style={{ width: `${props.size.width}px`, height: `${props.size.height}px` }}
                >
                    <svg
                        class={TrailStyles.trailTrack}
                        viewBox={`0 0 ${props.size.width} ${props.size.height}`}
                        aria-hidden="true"
                    >
                        <path ref={pathRef} class={TrailStyles.trailPath} d={props.path} />

                        {callSlot(slots.renderTrack, props.path)}
                    </svg>

                    {places.map((place, index) => (
                        <div
                            key={index}
                            class={TrailStyles.trailTraveler}
                            style={{ transform: TrailUtils.getTravelerTransform(place, isTurning) }}
                        >
                            {callSlot(slots.renderTraveler, { place, index })}
                        </div>
                    ))}
                </div>
            );
        };
    },
    {
        name: "Trail",
        slots: Object as SlotsType<TrailSlots>,
        props: declareProps<TrailProps>({
            "path": null,
            "size": null,
            "durationMs": null,
            "isLooping": Boolean,
            "isTurning": Boolean,
            "isDisabled": Boolean,
            "followerOffsets": null,
            "progress": null,
            "onUpdate:progress": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "onLap": null,
            "onMount": null,
        }),
    },
);

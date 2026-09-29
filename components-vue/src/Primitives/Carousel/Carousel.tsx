import { type SlotsType, type VNodeChild, computed, defineComponent, shallowRef } from "vue";

import {
    CAROUSEL_DEFAULTS,
    type CarouselFace,
    type CarouselPickRenderProps,
    type CarouselRotationFlags,
    type CarouselSlideState,
    type CarouselStep,
    type CarouselStepRenderProps,
    CarouselStyles,
    CarouselUtils,
    LiveAnnouncerUtils,
} from "@thewaver/ss-components";

import { InteractionTrackerVueUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { Barrel } from "../Barrel/Barrel";
import type { BarrelSlots } from "../Barrel/Barrel.types";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import type { InteractionControlSlots, InteractionWrapperSlots } from "../InteractionWrapper/InteractionWrapper.types";
import type {
    CarouselBackSlot,
    CarouselControlProps,
    CarouselControls,
    CarouselProps,
    CarouselSlots,
} from "./Carousel.types";

const CarouselControl = defineComponent(
    (props: CarouselControlProps, { slots }: SlotsContext<InteractionControlSlots>) => () => {
        const isDisabled = props.flags.isDisabled ?? false;

        return (
            <button
                type="button"
                class={CarouselStyles.carouselControl}
                aria-label={props.ariaLabel}
                aria-disabled={isDisabled || undefined}
                aria-current={props.isCurrent || undefined}
                onClick={() => {
                    if (isDisabled) return;

                    props.onActivate();
                }}
            >
                {callSlot(slots.renderContent, props.flags)}
            </button>
        );
    },
    {
        name: "CarouselControl",
        props: declareProps<CarouselControlProps>({
            id: null,
            ariaLabel: null,
            flags: null,
            isCurrent: Boolean,
            onActivate: null,
        }),
    },
);

export const Carousel = defineComponent(
    <T,>(props: CarouselProps<T>, { slots }: SlotsContext<CarouselSlots<T> & Partial<CarouselBackSlot<T>>>) => {
        watchAfterRender([], () => LiveAnnouncerUtils.reserve("polite"));

        const rootRef = shallowRef<HTMLDivElement>();
        const viewportRef = shallowRef<HTMLDivElement>();
        const swipeRatio = shallowRef(0);

        const index = useTwoWay(props, "index", 0);
        const isPlaying = useTwoWay(props, "playback", true);

        const count = computed(() => props.slides.length);
        const currentIndex = computed(() => CarouselUtils.wrapIndex(index.value, count.value));
        const getIsDisabled = () => props.isDisabled ?? false;
        const getIsLooping = () => props.isLooping ?? CAROUSEL_DEFAULTS.isLooping;
        const getIsDrum = () => props.variant === "drum";
        const getOrientation = () => props.orientation ?? CAROUSEL_DEFAULTS.orientation;
        const getAxis = () => props.axis ?? CAROUSEL_DEFAULTS.axis;
        const getTravelsAcross = () => CarouselUtils.getTravelsAcross(getIsDrum(), getAxis(), getOrientation());

        const isHeld = InteractionTrackerVueUtils.useHold(rootRef);

        const goTo = (target: number) => {
            const next = CarouselUtils.resolveIndex(target, count.value, getIsLooping());

            if (next === undefined || next === currentIndex.value) return;

            index.value = next;

            void props.onIndexChange?.(next);
        };

        const { isSwiping } = InteractionTrackerVueUtils.useAxialSwipe(
            viewportRef,
            () => CarouselUtils.getIsSwipeDisabled(slots.renderControls !== undefined, getIsDisabled(), count.value),
            {
                axis: () => (getTravelsAcross() ? "horizontal" : "vertical"),
                commitRatio: CarouselUtils.SWIPE_COMMIT_RATIO,
                onSwipe: (progressRatio) => {
                    swipeRatio.value = CarouselUtils.clampSwipeRatio(progressRatio);
                },
                onSwipeEnd: (direction) => {
                    swipeRatio.value = 0;

                    if (direction === undefined) return;

                    goTo(currentIndex.value + CarouselUtils.getSwipeStep(direction));
                },
            },
        );

        const isRotating = computed(() =>
            CarouselUtils.getIsRotating({
                autoplayDelayMs: props.autoplayDelayMs,
                isPlaying: isPlaying.value,
                isHeld: isHeld.value,
                isSwiping: isSwiping.value,
                isDisabled: getIsDisabled(),
                count: count.value,
            }),
        );

        const turn = computed<{ angle: number; index: number; count: number }>((previous) => {
            if (previous && previous.index === currentIndex.value && previous.count === count.value) return previous;

            return {
                angle: CarouselUtils.computeTurnAngle(previous?.angle ?? 0, previous, currentIndex.value, count.value),
                index: currentIndex.value,
                count: count.value,
            };
        });

        watchAfterRender(
            [isRotating, () => props.autoplayDelayMs, currentIndex],
            ([isTurning, autoplayDelayMs, current]) => {
                if (!isTurning || autoplayDelayMs === undefined) return;

                const advance = setTimeout(() => goTo(current + 1), autoplayDelayMs);

                return () => {
                    clearTimeout(advance);
                };
            },
        );

        let announcedIndex: number | undefined;

        watchAfterRender([currentIndex], ([current]) => {
            if (CarouselUtils.getIsAnnounced(announcedIndex, current, isRotating.value)) {
                LiveAnnouncerUtils.announce(props.computeSlideLabel(current, count.value));
            }

            announcedIndex = current;
        });

        const isPlaybackAtEnd = computed(() =>
            CarouselUtils.getIsPlaybackAtEnd({
                isLooping: getIsLooping(),
                autoplayDelayMs: props.autoplayDelayMs,
                isPlaying: isPlaying.value,
                isDisabled: getIsDisabled(),
                count: count.value,
                index: currentIndex.value,
            }),
        );

        watchAfterRender([isPlaybackAtEnd], ([isAtEnd]) => {
            if (isAtEnd) isPlaying.value = false;
        });

        const getSlideLabel = (slideIndex: number) => props.computeSlideLabel(slideIndex, count.value);

        const getSlideState = (slideIndex: number, face: CarouselFace): CarouselSlideState => ({
            index: slideIndex,
            count: count.value,
            face,
            isCurrent: slideIndex === currentIndex.value,
        });

        const renderStepControl = (step: CarouselStep): VNodeChild => {
            const targetIndex = CarouselUtils.getStepTarget(step, currentIndex.value, count.value, getIsLooping());

            return (
                <InteractionWrapper
                    key={step}
                    isDisabled={CarouselUtils.getIsStepDisabled(
                        step,
                        currentIndex.value,
                        count.value,
                        getIsLooping(),
                        getIsDisabled(),
                    )}
                    extraFlags={{ step, targetIndex }}
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags: renderProps }) => (
                                <CarouselControl
                                    ref={setElementRef}
                                    isCurrent={false}
                                    ariaLabel={props.computeStepLabel(step)}
                                    flags={renderProps}
                                    onActivate={() => goTo(targetIndex)}
                                >
                                    {{ renderContent: () => callSlot(slots.renderStep, { step, renderProps }) }}
                                </CarouselControl>
                            ),
                        } satisfies InteractionWrapperSlots<CarouselStepRenderProps>
                    }
                </InteractionWrapper>
            );
        };

        const renderPickControl = (pickIndex: number): VNodeChild => (
            <InteractionWrapper
                key={pickIndex}
                isDisabled={getIsDisabled()}
                extraFlags={{ index: pickIndex, isCurrent: pickIndex === currentIndex.value }}
            >
                {
                    {
                        renderControl: ({ setElementRef, flags: renderProps }) => (
                            <CarouselControl
                                ref={setElementRef}
                                isCurrent={renderProps.isCurrent}
                                ariaLabel={getSlideLabel(pickIndex)}
                                flags={renderProps}
                                onActivate={() => goTo(pickIndex)}
                            >
                                {{
                                    renderContent: () =>
                                        callSlot(slots.renderPick, { index: pickIndex, renderProps }),
                                }}
                            </CarouselControl>
                        ),
                    } satisfies InteractionWrapperSlots<CarouselPickRenderProps>
                }
            </InteractionWrapper>
        );

        const renderRotationControl = (): VNodeChild => (
            <InteractionWrapper
                key="rotation"
                isDisabled={getIsDisabled()}
                extraFlags={{ isPlaying: isPlaying.value, isHeld: isHeld.value }}
            >
                {
                    {
                        renderControl: ({ setElementRef, flags }) => (
                            <CarouselControl
                                ref={setElementRef}
                                isCurrent={false}
                                ariaLabel={props.computeRotationLabel(isPlaying.value)}
                                flags={flags}
                                onActivate={() => {
                                    isPlaying.value = !isPlaying.value;
                                }}
                            >
                                {{ renderContent: () => callSlot(slots.renderRotationControl, flags) }}
                            </CarouselControl>
                        ),
                    } satisfies InteractionWrapperSlots<CarouselRotationFlags>
                }
            </InteractionWrapper>
        );

        const renderSlide = (slide: T, slideIndex: number, face: CarouselFace) =>
            face === "back"
                ? callSlot(slots.renderSlideBack, { slide, state: getSlideState(slideIndex, face) })
                : callSlot(slots.renderSlide, { slide, state: getSlideState(slideIndex, face) });

        return () => {
            const isDrum = getIsDrum();
            const orientation = getOrientation();
            const travelsAcross = getTravelsAcross();
            const transitionDurationMs = props.transitionDurationMs ?? CAROUSEL_DEFAULTS.transitionDurationMs;
            const slideRoleDescription = props.slideRoleDescription ?? CAROUSEL_DEFAULTS.slideRoleDescription;
            const angle = CarouselUtils.getDrumAngle(turn.value.angle, swipeRatio.value, count.value);

            const controls: CarouselControls = {
                index: currentIndex.value,
                count: count.value,
                isPlaying: isPlaying.value,
                isHeld: isHeld.value,
                renderStep: renderStepControl,
                renderPick: renderPickControl,
                renderRotationControl,
            };

            return (
                <div
                    ref={rootRef}
                    class={CarouselStyles.carouselRoot}
                    style={{
                        height: !isDrum && orientation === "vertical" ? "100%" : undefined,
                        gap: `${props.gap ?? CAROUSEL_DEFAULTS.gap}px`,
                    }}
                    role="region"
                    aria-roledescription={props.roleDescription ?? CAROUSEL_DEFAULTS.roleDescription}
                    aria-label={props.ariaLabel}
                >
                    {isDrum ? (
                        <div ref={viewportRef} class={CarouselStyles.carouselStage}>
                            <Barrel
                                faces={props.slides}
                                axis={getAxis()}
                                faceSize={props.slideSize ?? CAROUSEL_DEFAULTS.slideSize}
                                angle={angle}
                                transitionDurationMs={isSwiping.value ? 0 : transitionDurationMs}
                                faceRoleDescription={slideRoleDescription}
                                computeFaceDefs={(faceIndex, face) => ({
                                    ariaLabel: getSlideLabel(faceIndex),
                                    isHidden: face === "back" || faceIndex !== currentIndex.value,
                                })}
                            >
                                {
                                    {
                                        renderFace: ({ item, index: faceIndex, face }) =>
                                            renderSlide(item, faceIndex, face),
                                    } satisfies BarrelSlots<T>
                                }
                            </Barrel>
                        </div>
                    ) : (
                        <div ref={viewportRef} class={CarouselStyles.carouselViewport}>
                            <div
                                class={CarouselStyles.carouselTrack}
                                style={{
                                    flexDirection: orientation === "horizontal" ? "row" : "column",
                                    height: orientation === "vertical" ? "100%" : undefined,
                                    transform: CarouselUtils.getTrackTransform(
                                        travelsAcross,
                                        swipeRatio.value,
                                        currentIndex.value,
                                    ),
                                    transitionDuration: `${isSwiping.value ? 0 : transitionDurationMs}ms`,
                                }}
                            >
                                {props.slides.map((slide, slideIndex) => (
                                    <div
                                        key={slideIndex}
                                        class={CarouselStyles.carouselSlide}
                                        role="group"
                                        aria-roledescription={slideRoleDescription}
                                        aria-label={getSlideLabel(slideIndex)}
                                        aria-hidden={slideIndex !== currentIndex.value ? "true" : undefined}
                                        inert={slideIndex !== currentIndex.value}
                                    >
                                        {renderSlide(slide, slideIndex, "front")}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {callSlot(slots.renderControls, controls)}
                </div>
            );
        };
    },
    {
        name: "Carousel",
        slots: Object as SlotsType<CarouselSlots<any> & Partial<CarouselBackSlot<any>>>,
        props: declareProps<CarouselProps<unknown>>({
            "autoplayDelayMs": null,
            "transitionDurationMs": null,
            "gap": null,
            "isDisabled": Boolean,
            "isLooping": Boolean,
            "ariaLabel": null,
            "computeSlideLabel": null,
            "computeStepLabel": null,
            "computeRotationLabel": null,
            "roleDescription": null,
            "slideRoleDescription": null,
            "slides": null,
            "index": null,
            "onUpdate:index": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "onIndexChange": null,
            "variant": null,
            "orientation": null,
            "axis": null,
            "slideSize": null,
        }),
    },
);

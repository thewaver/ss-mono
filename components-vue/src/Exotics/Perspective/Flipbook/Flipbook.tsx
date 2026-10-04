import { type SlotsType, type VNodeChild, computed, defineComponent, onScopeDispose, shallowRef } from "vue";

import {
    FLIPBOOK_DEFAULTS,
    type FlipbookStep,
    type FlipbookStepRenderProps,
    FlipbookStyles,
    FlipbookUtils,
    LiveAnnouncerUtils,
    type SpineSide,
    SpineUtils,
} from "@thewaver/ss-components";

import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { Spine } from "../../../Primitives/Spine/Spine";
import type { SpineSlots } from "../../../Primitives/Spine/Spine.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { FlipbookControlProps, FlipbookControls, FlipbookProps, FlipbookSlots } from "./Flipbook.types";

const FIRST_SPREAD = 0;

const FlipbookControl = defineComponent(
    (props: FlipbookControlProps, { slots }: SlotsContext<InteractionControlSlots<FlipbookStepRenderProps>>) =>
        () => {
            const isDisabled = props.flags.isDisabled ?? false;

            return (
                <button
                    type="button"
                    class={FlipbookStyles.flipbookControl}
                    aria-label={props.ariaLabel}
                    aria-disabled={isDisabled || undefined}
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
        name: "FlipbookControl",
        props: declareProps<FlipbookControlProps>({
            id: null,
            ariaLabel: null,
            flags: null,
            onActivate: null,
        }),
    },
);

export const Flipbook = defineComponent(
    <T,>(props: FlipbookProps<T>, { slots }: SlotsContext<FlipbookSlots<T>>) => {
        watchAfterRender([], () => LiveAnnouncerUtils.reserve("polite"));

        const bookRef = shallowRef<HTMLDivElement>();

        const index = useTwoWay(props, "index", FIRST_SPREAD);

        const getPageCount = () => props.pages.length;
        const getIsDisabled = () => props.isDisabled ?? false;
        const getTransitionDurationMs = () => props.transitionDurationMs ?? FLIPBOOK_DEFAULTS.transitionDurationMs;

        const currentIndex = computed(() => FlipbookUtils.clampSpread(index.value, getPageCount()));

        const book = FlipbookUtils.createBook({
            getPageCount,
            getIndex: () => index.value,
            setIndex: (next) => {
                index.value = next;
            },
            getIsDisabled,
            getTransitionDurationMs,
        });

        onScopeDispose(book.stop);

        const position = useStore(book.position);

        InteractionTrackerVueUtils.useAxialSwipe(
            bookRef,
            () => FlipbookUtils.getIsDragDisabled(slots.renderControls !== undefined, getIsDisabled(), getPageCount()),
            {
                axis: "horizontal",
                commitRatio: () => props.commitRatio ?? FLIPBOOK_DEFAULTS.commitRatio,
                onSwipe: book.push,
                onSwipeEnd: book.release,
            },
        );

        let glidedIndex = currentIndex.value;
        let announcedIndex: number | undefined;

        watchAfterRender([currentIndex], ([current]) => {
            if (glidedIndex !== current) book.glideTo(current);

            glidedIndex = current;

            if (FlipbookUtils.getIsAnnounced(announcedIndex, current)) {
                LiveAnnouncerUtils.announce(
                    props.computeSpreadAnnouncement(
                        FlipbookUtils.getShowingPages(current, getPageCount()),
                        getPageCount(),
                    ),
                );
            }

            announcedIndex = current;
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target !== e.currentTarget) return;

            const step = FlipbookUtils.getKeyStep(e.key);

            if (step === undefined || !book.turn(step)) return;

            e.preventDefault();
        };

        const renderStepControl = (step: FlipbookStep): VNodeChild => (
            <InteractionWrapper
                key={step}
                isDisabled={FlipbookUtils.getIsStepDisabled(step, currentIndex.value, getPageCount(), getIsDisabled())}
                extraFlags={{
                    step,
                    targetIndex: FlipbookUtils.getStepTarget(step, currentIndex.value, getPageCount()),
                }}
            >
                {
                    {
                        renderControl: ({ setElementRef, flags: renderProps }) => (
                            <FlipbookControl
                                ref={setElementRef}
                                ariaLabel={props.computeStepLabel(step)}
                                flags={renderProps}
                                onActivate={() => book.turn(step)}
                            >
                                {{ renderContent: () => callSlot(slots.renderStep, { step, renderProps }) }}
                            </FlipbookControl>
                        ),
                    } satisfies InteractionWrapperSlots<FlipbookStepRenderProps>
                }
            </InteractionWrapper>
        );

        const renderLeafPage = (leaf: number, side: SpineSide): VNodeChild => {
            const page = FlipbookUtils.getLeafPage(leaf, side, getPageCount());

            if (page === undefined) return null;

            return (
                <div
                    class={[
                        FlipbookStyles.flipbookPage,
                        side === "front" ? FlipbookStyles.flipbookPageFront : FlipbookStyles.flipbookPageBack,
                    ]}
                >
                    {callSlot(slots.renderPage, {
                        page: props.pages[page],
                        state: FlipbookUtils.getPageState(page, getPageCount(), currentIndex.value),
                    })}
                </div>
            );
        };

        return () => {
            const pageCount = getPageCount();

            const controls: FlipbookControls = {
                index: currentIndex.value,
                spreadCount: FlipbookUtils.getSpreadCount(pageCount),
                renderStep: renderStepControl,
            };

            return (
                <div
                    class={FlipbookStyles.flipbookRoot}
                    style={{ gap: `${props.gap ?? FLIPBOOK_DEFAULTS.gap}px` }}
                    role="region"
                    aria-roledescription={props.roleDescription ?? FLIPBOOK_DEFAULTS.roleDescription}
                    aria-label={props.ariaLabel}
                    tabindex={0}
                    onKeydown={handleKeyDown}
                >
                    <div ref={bookRef} class={FlipbookStyles.flipbookBook}>
                        <Spine
                            position={position.value}
                            hasBacks={true}
                            faceRoleDescription={props.pageRoleDescription ?? FLIPBOOK_DEFAULTS.pageRoleDescription}
                            computeFaceAngle={SpineUtils.leaves}
                            computeFaceDefs={(leaf: number, side: SpineSide) =>
                                FlipbookUtils.getLeafFaceDefs(
                                    leaf,
                                    side,
                                    pageCount,
                                    currentIndex.value,
                                    props.computePageLabel,
                                )
                            }
                            faces={Array.from({ length: FlipbookUtils.getLeafCount(pageCount) }, (_, leaf) => leaf)}
                        >
                            {
                                {
                                    renderFace: ({ index: leaf, side }) => renderLeafPage(leaf, side),
                                } satisfies SpineSlots<number>
                            }
                        </Spine>
                    </div>

                    {callSlot(slots.renderControls, controls)}
                </div>
            );
        };
    },
    {
        name: "Flipbook",
        slots: Object as SlotsType<FlipbookSlots<any>>,
        props: declareProps<FlipbookProps<unknown>>({
            "transitionDurationMs": null,
            "commitRatio": null,
            "gap": null,
            "isDisabled": Boolean,
            "ariaLabel": null,
            "computePageLabel": null,
            "computeSpreadAnnouncement": null,
            "computeStepLabel": null,
            "roleDescription": null,
            "pageRoleDescription": null,
            "pages": null,
            "index": null,
            "onUpdate:index": null,
        }),
    },
);

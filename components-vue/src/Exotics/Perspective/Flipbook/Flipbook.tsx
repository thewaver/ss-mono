import { type SlotsType, type VNodeChild, computed, defineComponent, onScopeDispose, shallowRef } from "vue";

import {
    FLIPBOOK_DEFAULTS,
    FlipbookStyles,
    FlipbookUtils,
    LiveAnnouncerUtils,
    type SpineSide,
    SpineUtils,
} from "@thewaver/ss-components";
import { FlipbookConst } from "@thewaver/ss-components/internal";

import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { Spine } from "../../../Primitives/Spine/Spine";
import type { SpineSlots } from "../../../Primitives/Spine/Spine.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { FlipbookControls, FlipbookProps, FlipbookSlots } from "./Flipbook.types";

export const Flipbook = defineComponent(
    <T,>(props: FlipbookProps<T>, { slots }: SlotsContext<FlipbookSlots<T>>) => {
        watchAfterRender([], () => LiveAnnouncerUtils.reserve("polite"));

        const bookRef = shallowRef<HTMLDivElement>();

        const index = useTwoWay(props, "index", FlipbookConst.FIRST_SPREAD);

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
            () => FlipbookUtils.getIsDragDisabled(getIsDisabled(), getPageCount()),
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

        const controls: FlipbookControls = {
            getIndex: () => currentIndex.value,
            getSpreadCount: () => FlipbookUtils.getSpreadCount(getPageCount()),
            getCanTurn: (step) =>
                !FlipbookUtils.getIsStepDisabled(step, currentIndex.value, getPageCount(), getIsDisabled()),
            turn: (step) => book.turn(step),
        };

        watchAfterRender([], () => {
            props.onMount?.(controls);
        });

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

            return (
                <div
                    class={FlipbookStyles.flipbookRoot}
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
            "isDisabled": Boolean,
            "ariaLabel": null,
            "computePageLabel": null,
            "computeSpreadAnnouncement": null,
            "roleDescription": null,
            "pageRoleDescription": null,
            "pages": null,
            "index": null,
            "onUpdate:index": null,
            "onMount": null,
        }),
    },
);

import { Fragment, type SlotsType, defineComponent, shallowRef } from "vue";

import type { ScrollerMetrics, ScrollerStep, ScrollerStepper } from "@thewaver/ss-components";
import { SCROLLER_DEFAULTS, ScrollerStyles, ScrollerUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { ScrollerProps, ScrollerSlots } from "./Scroller.types";

const getIsSameMetrics = (a: ScrollerMetrics, b: ScrollerMetrics) =>
    a.start === b.start && a.visible === b.visible && a.total === b.total;

export const Scroller = defineComponent(
    (props: ScrollerProps, { slots }: SlotsContext<ScrollerSlots>) => {
        const trackRef = shallowRef<HTMLDivElement>();

        const metrics = shallowRef(ScrollerUtils.NO_METRICS);
        const progressRatio = useTwoWay(props, "progress", ScrollerUtils.RATIO_MIN);

        let reportedRatio = ScrollerUtils.RATIO_MIN;

        const stepper: ScrollerStepper = {
            getIsAtStart: () => ScrollerUtils.getIsAtStart(metrics.value),
            getIsAtEnd: () => ScrollerUtils.getIsAtEnd(metrics.value),
            stepToPrevious: () => ScrollerUtils.stepTo(trackRef.value, "previous"),
            stepToNext: () => ScrollerUtils.stepTo(trackRef.value, "next"),
        };

        watchAfterRender([trackRef], ([track]) => {
            if (!track) return undefined;

            return ScrollerUtils.observe(track, (next) => {
                if (!getIsSameMetrics(metrics.value, next)) metrics.value = next;
            });
        });

        watchAfterRender([metrics], ([current]) => {
            reportedRatio = ScrollerUtils.computeProgressRatio(current);

            progressRatio.value = reportedRatio;
        });

        watchAfterRender([trackRef, progressRatio], ([track, ratio]) => {
            if (!track || ratio === reportedRatio) return;

            track.scrollTo({ left: ratio * ScrollerUtils.computeScrollRange(ScrollerUtils.readMetrics(track)) });
        });

        const handleFocus = (e: FocusEvent) => {
            const track = trackRef.value;
            const target = e.target as HTMLElement | null;

            if (!track || !target || target === track) return;

            track.scrollTo({
                left: ScrollerUtils.computeRevealTarget(track, target, props.padding ?? SCROLLER_DEFAULTS.padding),
            });
        };

        const renderButton = (step: ScrollerStep, index: number) => (
            <Fragment key={index}>{callSlot(slots.renderButton, { step, stepper })}</Fragment>
        );

        return () => {
            const gap = props.gap ?? SCROLLER_DEFAULTS.gap;
            const padding = props.padding ?? SCROLLER_DEFAULTS.padding;
            const steps = ScrollerUtils.getSteps(
                props.buttonPlacement ?? SCROLLER_DEFAULTS.buttonPlacement,
                ScrollerUtils.getIsScrollable(metrics.value),
            );

            return (
                <div class={ScrollerStyles.scrollerRoot} style={{ gap: `${gap}px` }}>
                    {steps.leading.map(renderButton)}

                    <div
                        ref={trackRef}
                        class={ScrollerStyles.scrollerTrack}
                        style={{ paddingBlock: `${padding}px`, paddingInlineStart: `${padding}px` }}
                        onFocusin={handleFocus}
                    >
                        {slots.default?.()}

                        <div class={ScrollerStyles.scrollerTrackEnd} style={{ flexBasis: `${padding}px` }} />
                    </div>

                    {steps.trailing.map(renderButton)}
                </div>
            );
        };
    },
    {
        name: "Scroller",
        slots: Object as SlotsType<ScrollerSlots>,
        props: declareProps<ScrollerProps>({
            "gap": null,
            "padding": null,
            "buttonPlacement": null,
            "progress": null,
            "onUpdate:progress": null,
        }),
    },
);

import { createMemo, createSignal } from "solid-js";

import { CIRCLE_PACKING_DEFAULTS, MediaQueryMonitorUtils, TreemapUtils } from "@thewaver/ss-components";
import type { CirclePackingNode } from "@thewaver/ss-components";

import { CirclePackingKnobs } from "../../Knobs/CirclePackings.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField } from "../../StyledComponents/Field/Field";
import { LIBRARY } from "../TreemapPage/TreemapPage.const";
import { LibraryExample } from "./Examples/Library";

const EXAMPLES_ROOT = "/src/App/Pages/CirclePackingPage/Examples";

const NO_MOTION_DURATION_MS = 0;
const WIDE_SPAN = 2;

export const CirclePackingPage = () => {
    const [getPadding, setPadding] = createSignal(CIRCLE_PACKING_DEFAULTS.padding);
    const [getZoomDurationMs, setZoomDurationMs] = createSignal(CIRCLE_PACKING_DEFAULTS.zoomDurationMs);

    const branchSignal = createSignal<CirclePackingNode<string>>(LIBRARY);

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    const getShowing = () =>
        (TreemapUtils.findPath(LIBRARY, branchSignal[0]()) ?? [LIBRARY]).map((node) => node.value).join("/");

    const getExamples = createMemo(() => [
        {
            key: "library",
            name: "This library, by lines of code",
            span: WIDE_SPAN,
            readout: () =>
                `showing ${getShowing()} — press a circle with circles inside it to zoom into it, anywhere else to go back to the top, or Escape to go up one level`,
            component: () => (
                <LibraryExample
                    padding={getPadding}
                    zoomDurationMs={() => (getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : getZoomDurationMs())}
                    branchSignal={branchSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/Library.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"padding"}
                    label={"Padding (px)"}
                    hint={"The space left between neighboring circles and around the inside of their parent."}
                >
                    <PageNumberField
                        value={getPadding}
                        min={() => CirclePackingKnobs.MIN_PADDING}
                        max={() => CirclePackingKnobs.MAX_PADDING}
                        step={() => CirclePackingKnobs.PADDING_STEP}
                        ariaLabel={"Padding in pixels"}
                        onInput={setPadding}
                    />
                </PageProp>

                <PageProp
                    key={"zoomDurationMs"}
                    label={"Zoom duration (ms)"}
                    hint={
                        "How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new view."
                    }
                >
                    <PageNumberField
                        value={getZoomDurationMs}
                        min={() => CirclePackingKnobs.MIN_ZOOM_DURATION_MS}
                        max={() => CirclePackingKnobs.MAX_ZOOM_DURATION_MS}
                        step={() => CirclePackingKnobs.ZOOM_DURATION_STEP_MS}
                        isDisabled={getPrefersReducedMotion}
                        ariaLabel={"Zoom duration in milliseconds"}
                        onInput={setZoomDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

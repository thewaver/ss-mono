import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitorUtils, SUNBURST_DEFAULTS, TreemapUtils } from "@thewaver/ss-components";
import type { SunburstNode } from "@thewaver/ss-components";

import { SunburstKnobs } from "../../Knobs/Sunbursts.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { LIBRARY } from "../TreemapPage/TreemapPage.const";
import { LibraryExample } from "./Examples/Library";

const EXAMPLES_ROOT = "/src/App/Pages/SunburstPage/Examples";

const NO_MOTION_DURATION_MS = 0;
const WIDE_SPAN = 2;

export const SunburstPage = () => {
    const [getRingCount, setRingCount] = createSignal(SUNBURST_DEFAULTS.ringCount);
    const [getZoomDurationMs, setZoomDurationMs] = createSignal(SUNBURST_DEFAULTS.zoomDurationMs);

    const branchSignal = createSignal<SunburstNode<string>>(LIBRARY);

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    const getShowing = () =>
        (TreemapUtils.findPath(LIBRARY, branchSignal[0]()) ?? [LIBRARY]).map((node) => node.value).join("/");

    const getExamples = createMemo(() => [
        {
            key: "library",
            name: "This library, by lines of code",
            span: WIDE_SPAN,
            readout: () =>
                `showing ${getShowing()} — press an arc with rings outside it to zoom into it, and the middle or Escape to come back out`,
            component: () => (
                <LibraryExample
                    ringCount={getRingCount}
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
                    key={"ringCount"}
                    label={"Rings"}
                    hint={"How many levels are drawn around the middle at once."}
                >
                    <PageNumberField
                        value={getRingCount}
                        min={() => SunburstKnobs.MIN_RING_COUNT}
                        max={() => SunburstKnobs.MAX_RING_COUNT}
                        step={() => SunburstKnobs.RING_COUNT_STEP}
                        ariaLabel={"Rings"}
                        onInput={setRingCount}
                    />
                </PageProp>

                <PageProp
                    key={"zoomDurationMs"}
                    label={"Zoom duration (ms)"}
                    hint={
                        "How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new level."
                    }
                >
                    <PageNumberField
                        value={getZoomDurationMs}
                        min={() => SunburstKnobs.MIN_ZOOM_DURATION_MS}
                        max={() => SunburstKnobs.MAX_ZOOM_DURATION_MS}
                        step={() => SunburstKnobs.ZOOM_DURATION_STEP_MS}
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

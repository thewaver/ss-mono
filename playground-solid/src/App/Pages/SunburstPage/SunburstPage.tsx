import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitorSolidUtils, SUNBURST_DEFAULTS, TreemapUtils } from "@thewaver/ss-components-solid";
import type { SunburstNode } from "@thewaver/ss-components-solid";
import { SunburstKnobs } from "@thewaver/ss-playground/App/Knobs/Sunbursts.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    NO_MOTION_DURATION_MS,
    WIDE_SPAN,
} from "@thewaver/ss-playground/App/Pages/SunburstPage/SunburstPage.const";
import { LIBRARY } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { LibraryExample } from "./Examples/Library";

export const SunburstPage = () => {
    const [getRingCount, setRingCount] = createSignal(SUNBURST_DEFAULTS.ringCount);
    const [getZoomDurationMs, setZoomDurationMs] = createSignal(SUNBURST_DEFAULTS.zoomDurationMs);

    const branchSignal = createSignal<SunburstNode<string>>(LIBRARY);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const getShowing = () =>
        (TreemapUtils.findPath(LIBRARY, branchSignal[0]()) ?? [LIBRARY]).map((node) => node.value).join("/");

    const getExamples = createMemo(() => [
        {
            key: "library",
            name: EXAMPLE_NAMES.library,
            span: WIDE_SPAN,
            readout: () =>
                `showing ${getShowing()} — press an arc with rings outside it to zoom into it, and the middle or Escape to come back out`,
            component: () => (
                <LibraryExample
                    ringCount={getRingCount}
                    zoomDurationMs={() => (getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : getZoomDurationMs())}
                    branch={branchSignal}
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
                    controls={"Sets SunburstProps.ringCount"}
                >
                    <PageNumberField
                        value={getRingCount}
                        min={SunburstKnobs.MIN_RING_COUNT}
                        max={SunburstKnobs.MAX_RING_COUNT}
                        step={SunburstKnobs.RING_COUNT_STEP}
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
                    controls={"Sets SunburstProps.zoomDurationMs"}
                >
                    <PageNumberField
                        value={getZoomDurationMs}
                        min={SunburstKnobs.MIN_ZOOM_DURATION_MS}
                        max={SunburstKnobs.MAX_ZOOM_DURATION_MS}
                        step={SunburstKnobs.ZOOM_DURATION_STEP_MS}
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

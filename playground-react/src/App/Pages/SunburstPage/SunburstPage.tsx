import { useState } from "react";

import { MediaQueryMonitorReactUtils, SUNBURST_DEFAULTS, TreemapUtils } from "@thewaver/ss-components-react";
import type { SunburstNode } from "@thewaver/ss-components-react";
import { SunburstKnobs } from "@thewaver/ss-playground/App/Knobs/Sunbursts.const";
import { LIBRARY } from "@thewaver/ss-playground/App/LibraryTree.generated";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    NO_MOTION_DURATION_MS,
    WIDE_SPAN,
} from "@thewaver/ss-playground/App/Pages/SunburstPage/SunburstPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { LibraryExample } from "./Examples/Library";

export const SunburstPage = () => {
    const [ringCount, setRingCount] = useState(SUNBURST_DEFAULTS.ringCount);
    const [zoomDurationMs, setZoomDurationMs] = useState(SUNBURST_DEFAULTS.zoomDurationMs);

    const branchState = useState<SunburstNode<string>>(LIBRARY);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const showing = (TreemapUtils.findPath(LIBRARY, branchState[0]) ?? [LIBRARY]).map((node) => node.value).join("/");

    const examples = [
        {
            key: "library",
            name: EXAMPLE_NAMES.library,
            span: WIDE_SPAN,
            readout: () =>
                `showing ${showing} — press an arc with rings outside it to zoom into it, and the middle or Escape to come back out`,
            component: () => (
                <LibraryExample
                    ringCount={ringCount}
                    zoomDurationMs={prefersReducedMotion ? NO_MOTION_DURATION_MS : zoomDurationMs}
                    branch={branchState}
                />
            ),
            path: `${EXAMPLES_ROOT}/Library.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"ringCount"} {...SunburstKnobs.RING_COUNT_TEXT}>
                    <PageNumberField
                        value={ringCount}
                        min={SunburstKnobs.MIN_RING_COUNT}
                        max={SunburstKnobs.MAX_RING_COUNT}
                        step={SunburstKnobs.RING_COUNT_STEP}
                        ariaLabel={"Rings"}
                        onInput={setRingCount}
                    />
                </PageProp>

                <PageProp itemKey={"zoomDurationMs"} {...SunburstKnobs.ZOOM_DURATION_MS_TEXT}>
                    <PageNumberField
                        value={zoomDurationMs}
                        min={SunburstKnobs.MIN_ZOOM_DURATION_MS}
                        max={SunburstKnobs.MAX_ZOOM_DURATION_MS}
                        step={SunburstKnobs.ZOOM_DURATION_STEP_MS}
                        isDisabled={prefersReducedMotion}
                        ariaLabel={"Zoom duration in milliseconds"}
                        onInput={setZoomDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};

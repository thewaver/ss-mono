import { useState } from "react";

import { CIRCLE_PACKING_DEFAULTS, MediaQueryMonitorReactUtils, TreemapUtils } from "@thewaver/ss-components-react";
import type { CirclePackingNode } from "@thewaver/ss-components-react";
import { CirclePackingKnobs } from "@thewaver/ss-playground-core/App/Knobs/CirclePackings.const";
import { LIBRARY } from "@thewaver/ss-playground-core/App/Pages/TreemapPage/TreemapPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { LibraryExample } from "./Examples/Library";

const EXAMPLES_ROOT = "/src/App/Pages/CirclePackingPage/Examples";

const NO_MOTION_DURATION_MS = 0;
const WIDE_SPAN = 2;

export const CirclePackingPage = () => {
    const [padding, setPadding] = useState(CIRCLE_PACKING_DEFAULTS.padding);
    const [zoomDurationMs, setZoomDurationMs] = useState(CIRCLE_PACKING_DEFAULTS.zoomDurationMs);

    const branchState = useState<CirclePackingNode<string>>(LIBRARY);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const showing = (TreemapUtils.findPath(LIBRARY, branchState[0]) ?? [LIBRARY]).map((node) => node.value).join("/");

    const examples = [
        {
            key: "library",
            name: "This library, by lines of code",
            span: WIDE_SPAN,
            readout: () =>
                `showing ${showing} — press a circle with circles inside it to zoom into it, anywhere else to go back to the top, or Escape to go up one level`,
            component: () => (
                <LibraryExample
                    padding={padding}
                    zoomDurationMs={prefersReducedMotion ? NO_MOTION_DURATION_MS : zoomDurationMs}
                    branchState={branchState}
                />
            ),
            path: `${EXAMPLES_ROOT}/Library.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"padding"}
                    label={"Padding (px)"}
                    hint={"The space left between neighboring circles and around the inside of their parent."}
                >
                    <PageNumberField
                        value={padding}
                        min={CirclePackingKnobs.MIN_PADDING}
                        max={CirclePackingKnobs.MAX_PADDING}
                        step={CirclePackingKnobs.PADDING_STEP}
                        ariaLabel={"Padding in pixels"}
                        onInput={setPadding}
                    />
                </PageProp>

                <PageProp
                    itemKey={"zoomDurationMs"}
                    label={"Zoom duration (ms)"}
                    hint={
                        "How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new view."
                    }
                >
                    <PageNumberField
                        value={zoomDurationMs}
                        min={CirclePackingKnobs.MIN_ZOOM_DURATION_MS}
                        max={CirclePackingKnobs.MAX_ZOOM_DURATION_MS}
                        step={CirclePackingKnobs.ZOOM_DURATION_STEP_MS}
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

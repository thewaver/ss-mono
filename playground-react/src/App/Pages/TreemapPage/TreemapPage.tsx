import { useState } from "react";

import { MediaQueryMonitorReactUtils, TREEMAP_DEFAULTS, TreemapUtils } from "@thewaver/ss-components-react";
import { TreemapKnobs } from "@thewaver/ss-playground/App/Knobs/Treemaps.const";
import { LIBRARY } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { LibraryExample } from "./Examples/Library";

const EXAMPLES_ROOT = "/src/App/Pages/TreemapPage/Examples";

const NO_MOTION_DURATION_MS = 0;
const WIDE_SPAN = 2;

export const TreemapPage = () => {
    const [zoomDurationMs, setZoomDurationMs] = useState(TREEMAP_DEFAULTS.zoomDurationMs);

    const branchState = useState(LIBRARY);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const showing = (TreemapUtils.findPath(LIBRARY, branchState[0]) ?? [LIBRARY]).map((node) => node.value).join("/");

    const examples = [
        {
            key: "library",
            name: "This library, by lines of code",
            span: WIDE_SPAN,
            readout: () =>
                `showing ${showing} — press a branch to zoom into it, and the bar above or Escape to come back out; a leaf has nothing inside it and does not answer a press`,
            component: () => (
                <LibraryExample
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
                <PageProp
                    itemKey={"zoomDurationMs"}
                    label={"Zoom duration (ms)"}
                    hint={
                        "How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new level."
                    }
                >
                    <PageNumberField
                        value={zoomDurationMs}
                        min={TreemapKnobs.MIN_ZOOM_DURATION_MS}
                        max={TreemapKnobs.MAX_ZOOM_DURATION_MS}
                        step={TreemapKnobs.ZOOM_DURATION_STEP_MS}
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

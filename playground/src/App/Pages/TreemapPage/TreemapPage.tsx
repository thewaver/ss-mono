import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitorUtils, TREEMAP_DEFAULTS, TreemapUtils } from "@thewaver/ss-components";

import { TreemapKnobs } from "../../Knobs/Treemaps.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { LibraryExample } from "./Examples/Library";
import { LIBRARY } from "./TreemapPage.const";

const EXAMPLES_ROOT = "/src/App/Pages/TreemapPage/Examples";

const NO_MOTION_DURATION_MS = 0;
const WIDE_SPAN = 2;

export const TreemapPage = () => {
    const [getZoomDurationMs, setZoomDurationMs] = createSignal(TREEMAP_DEFAULTS.zoomDurationMs);

    const branchSignal = createSignal(LIBRARY);

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    const getShowing = () =>
        (TreemapUtils.findPath(LIBRARY, branchSignal[0]()) ?? [LIBRARY]).map((node) => node.value).join("/");

    const getExamples = createMemo(() => [
        {
            key: "library",
            name: "This library, by lines of code",
            span: WIDE_SPAN,
            readout: () =>
                `showing ${getShowing()} — press a branch to zoom into it, and the bar above or Escape to come back out; a leaf has nothing inside it and does not answer a press`,
            component: () => (
                <LibraryExample
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
                    key={"zoomDurationMs"}
                    label={"Zoom duration (ms)"}
                    hint={
                        "How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new level."
                    }
                >
                    <PageNumberField
                        value={getZoomDurationMs}
                        min={() => TreemapKnobs.MIN_ZOOM_DURATION_MS}
                        max={() => TreemapKnobs.MAX_ZOOM_DURATION_MS}
                        step={() => TreemapKnobs.ZOOM_DURATION_STEP_MS}
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

import { createMemo, createSignal } from "solid-js";

import { ICICLE_DEFAULTS, MediaQueryMonitorUtils, TreemapUtils } from "@thewaver/ss-components";
import type { IcicleNode } from "@thewaver/ss-components";

import { IcicleKnobs } from "../../Knobs/Icicles.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { LIBRARY } from "../TreemapPage/TreemapPage.const";
import { LibraryExample } from "./Examples/Library";

const EXAMPLES_ROOT = "/src/App/Pages/IciclePage/Examples";

const NO_MOTION_DURATION_MS = 0;
const WIDE_SPAN = 2;

export const IciclePage = () => {
    const [getColumnCount, setColumnCount] = createSignal(ICICLE_DEFAULTS.columnCount);
    const [getZoomDurationMs, setZoomDurationMs] = createSignal(ICICLE_DEFAULTS.zoomDurationMs);

    const focusSignal = createSignal<IcicleNode<string>>(LIBRARY);

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    const getShowing = () =>
        (TreemapUtils.findPath(LIBRARY, focusSignal[0]()) ?? [LIBRARY]).map((node) => node.value).join("/");

    const getExamples = createMemo(() => [
        {
            key: "library",
            name: "This library, by lines of code",
            span: WIDE_SPAN,
            readout: () =>
                `showing ${getShowing()} — press any cell to bring it to the left at full height, the leftmost cell or Escape to go back up; the arrows walk up and down a column and across to a parent or its children`,
            component: () => (
                <LibraryExample
                    columnCount={getColumnCount}
                    zoomDurationMs={() => (getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : getZoomDurationMs())}
                    focusSignal={focusSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/Library.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"columnCount"}
                    label={"Columns"}
                    hint={"How many levels fit across at once, counting the one in view."}
                >
                    <PageNumberField
                        value={getColumnCount}
                        min={() => IcicleKnobs.MIN_COLUMN_COUNT}
                        max={() => IcicleKnobs.MAX_COLUMN_COUNT}
                        step={() => IcicleKnobs.COLUMN_COUNT_STEP}
                        ariaLabel={"Columns"}
                        onInput={setColumnCount}
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
                        min={() => IcicleKnobs.MIN_ZOOM_DURATION_MS}
                        max={() => IcicleKnobs.MAX_ZOOM_DURATION_MS}
                        step={() => IcicleKnobs.ZOOM_DURATION_STEP_MS}
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

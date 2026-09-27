import { useState } from "react";

import { ICICLE_DEFAULTS, MediaQueryMonitorReactUtils, TreemapUtils } from "@thewaver/ss-components-react";
import type { IcicleNode } from "@thewaver/ss-components-react";
import { IcicleKnobs } from "@thewaver/ss-playground-core/App/Knobs/Icicles.const";
import { LIBRARY } from "@thewaver/ss-playground-core/App/Pages/TreemapPage/TreemapPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { LibraryExample } from "./Examples/Library";

const EXAMPLES_ROOT = "/src/App/Pages/IciclePage/Examples";

const NO_MOTION_DURATION_MS = 0;
const WIDE_SPAN = 2;

export const IciclePage = () => {
    const [columnCount, setColumnCount] = useState(ICICLE_DEFAULTS.columnCount);
    const [zoomDurationMs, setZoomDurationMs] = useState(ICICLE_DEFAULTS.zoomDurationMs);

    const focusState = useState<IcicleNode<string>>(LIBRARY);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const showing = (TreemapUtils.findPath(LIBRARY, focusState[0]) ?? [LIBRARY]).map((node) => node.value).join("/");

    const examples = [
        {
            key: "library",
            name: "This library, by lines of code",
            span: WIDE_SPAN,
            readout: () =>
                `showing ${showing} — press any cell to bring it to the left at full height, the leftmost cell or Escape to go back up; the arrows walk up and down a column and across to a parent or its children`,
            component: () => (
                <LibraryExample
                    columnCount={columnCount}
                    zoomDurationMs={prefersReducedMotion ? NO_MOTION_DURATION_MS : zoomDurationMs}
                    focusState={focusState}
                />
            ),
            path: `${EXAMPLES_ROOT}/Library.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"columnCount"}
                    label={"Columns"}
                    hint={"How many levels fit across at once, counting the one in view."}
                >
                    <PageNumberField
                        value={columnCount}
                        min={IcicleKnobs.MIN_COLUMN_COUNT}
                        max={IcicleKnobs.MAX_COLUMN_COUNT}
                        step={IcicleKnobs.COLUMN_COUNT_STEP}
                        ariaLabel={"Columns"}
                        onInput={setColumnCount}
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
                        min={IcicleKnobs.MIN_ZOOM_DURATION_MS}
                        max={IcicleKnobs.MAX_ZOOM_DURATION_MS}
                        step={IcicleKnobs.ZOOM_DURATION_STEP_MS}
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

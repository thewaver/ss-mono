import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

import { ElementObserverReactUtils, TOOLBAR_DEFAULTS } from "@thewaver/ss-components-react";
import { ToolbarKnobs } from "@thewaver/ss-playground/App/Knobs/Toolbars.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    NO_WIDTH,
    WIDE_SPAN,
} from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { useLayerClass } from "../../StyledComponents/Layer/Layer.context";
import { DefaultExample } from "./Examples/Default";
import { PaletteExample } from "./Examples/Palette";
import { PressedExample } from "./Examples/Pressed";
import { RefusingExample } from "./Examples/Refusing";
import { SharedTooltipExample } from "./Examples/SharedTooltip";
import { NOTHING_RUN } from "./ToolbarPageReact.const";
import type { ToolbarExampleProps } from "./ToolbarPageReact.types";

type ResizableBarProps = PropsWithChildren<{
    width: number;
    onResize: (width: number) => void;
}>;

const ResizableBar = (props: ResizableBarProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const layerClass = useLayerClass();

    const size = ElementObserverReactUtils.useBorderBoxSize(ref);

    const width = Math.round(size.width);

    useEffect(() => {
        if (width > NO_WIDTH) props.onResize(width);
    }, [width]);

    return (
        <div ref={ref} className={styles.resizer} style={{ width: `${props.width}px` }}>
            <div className={[styles.bar, layerClass].join(" ")}>{props.children}</div>
        </div>
    );
};

export const ToolbarPage = () => {
    const [barWidth, setBarWidth] = useState(ToolbarKnobs.STARTING_BAR_WIDTH);
    const [gap, setGap] = useState(TOOLBAR_DEFAULTS.gap);
    const [lastRun, setLastRun] = useState(NOTHING_RUN);
    const pressedValues = useState<string[]>([]);

    const commonProps: ToolbarExampleProps = {
        gap,
        onActivate: (value) => setLastRun(value),
    };

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            span: WIDE_SPAN,
            readout: () => `last run: ${lastRun} — drag the right edge and the row's tail moves into the menu`,
            component: () => (
                <ResizableBar width={barWidth} onResize={setBarWidth}>
                    <DefaultExample {...commonProps} />
                </ResizableBar>
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "refusing",
            name: EXAMPLE_NAMES.refusing,
            span: WIDE_SPAN,
            readout: () =>
                "Share never collapses, so it is the last one standing; Print is never in the row; Rename is disabled, so the arrows step past it",
            component: () => (
                <ResizableBar width={barWidth} onResize={setBarWidth}>
                    <RefusingExample {...commonProps} />
                </ResizableBar>
            ),
            path: `${EXAMPLES_ROOT}/Refusing.tsx`,
        },
        {
            key: "pressed",
            name: EXAMPLE_NAMES.pressed,
            span: WIDE_SPAN,
            readout: () =>
                `pressed: ${pressedValues[0].join(", ") || "nothing"} — each action stays down until pressed again, and one that collapses is a checkbox in the menu, checked from the same list`,
            component: () => (
                <ResizableBar width={barWidth} onResize={setBarWidth}>
                    <PressedExample {...commonProps} pressedValues={pressedValues} />
                </ResizableBar>
            ),
            path: `${EXAMPLES_ROOT}/Pressed.tsx`,
        },
        {
            key: "sharedTooltip",
            name: EXAMPLE_NAMES.sharedTooltip,
            span: WIDE_SPAN,
            readout: () =>
                "a single tooltip whose anchor is whichever action is under the pointer or holds focus; moving along the row carries the tooltip with it instead of hiding one and showing the next, and its description moves with it; Clear is disabled and has no hint, so it gets no tooltip",
            component: () => (
                <ResizableBar width={barWidth} onResize={setBarWidth}>
                    <SharedTooltipExample {...commonProps} />
                </ResizableBar>
            ),
            path: `${EXAMPLES_ROOT}/SharedTooltip.tsx`,
        },
        {
            key: "palette",
            name: EXAMPLE_NAMES.palette,
            readout: () =>
                `last run: ${lastRun} — a layout sizes the bar itself, so nothing runs out of room and the overflow menu has nothing to hold`,
            component: () => <PaletteExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Palette.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"barWidth"}
                    label={"Bar width (px)"}
                    hint={"How wide the bar is. Narrow it far enough and items start moving into the overflow menu."}
                    controls={EXAMPLES_ONLY_PROP}
                >
                    <PageNumberField
                        value={barWidth}
                        min={ToolbarKnobs.MIN_BAR_WIDTH}
                        max={ToolbarKnobs.MAX_BAR_WIDTH}
                        step={ToolbarKnobs.BAR_WIDTH_STEP}
                        ariaLabel={"Bar width in pixels"}
                        onInput={setBarWidth}
                    />
                </PageProp>

                <PageProp
                    itemKey={"gap"}
                    label={"Gap (px)"}
                    hint={"The space left between items on the bar."}
                    controls={"Sets ToolbarProps.gap"}
                >
                    <PageNumberField
                        value={gap}
                        min={ToolbarKnobs.MIN_GAP}
                        max={ToolbarKnobs.MAX_GAP}
                        step={ToolbarKnobs.GAP_STEP}
                        ariaLabel={"Gap in pixels"}
                        onInput={setGap}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};

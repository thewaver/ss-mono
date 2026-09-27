import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

import { ElementObserverReactUtils, TOOLBAR_DEFAULTS } from "@thewaver/ss-components-react";
import { ToolbarKnobs } from "@thewaver/ss-playground-core/App/Knobs/Toolbars.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/ToolbarPage/ToolbarPage.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { useLayerClass } from "../../StyledComponents/Layer/Layer.context";
import { DefaultExample } from "./Examples/Default";
import { PaletteExample } from "./Examples/Palette";
import { PressedExample } from "./Examples/Pressed";
import { RefusingExample } from "./Examples/Refusing";
import { NOTHING_RUN } from "./ToolbarPage.const";
import type { ToolbarExampleProps } from "./ToolbarPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/ToolbarPage/Examples";

const NO_WIDTH = 0;
const WIDE_SPAN = 2;

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
            name: "Default",
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
            name: "Refusing",
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
            name: "Pressed",
            span: WIDE_SPAN,
            readout: () =>
                `pressed: ${pressedValues[0].join(", ") || "nothing"} — each action stays down until pressed again, and one that collapses is a checkbox in the menu, checked from the same list`,
            component: () => (
                <ResizableBar width={barWidth} onResize={setBarWidth}>
                    <PressedExample {...commonProps} pressedValuesState={pressedValues} />
                </ResizableBar>
            ),
            path: `${EXAMPLES_ROOT}/Pressed.tsx`,
        },
        {
            key: "palette",
            name: "A ring of tools",
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

                <PageProp itemKey={"gap"} label={"Gap (px)"} hint={"The space left between items on the bar."}>
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

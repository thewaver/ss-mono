import { createEffect, createMemo, createSignal } from "solid-js";
import type { ParentProps } from "solid-js";

import { ElementObserverSolidUtils, TOOLBAR_DEFAULTS } from "@thewaver/ss-components-solid";
import { ToolbarKnobs } from "@thewaver/ss-playground/App/Knobs/Toolbars.const";
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
import { NOTHING_RUN } from "./ToolbarPage.const";
import type { ToolbarExampleProps } from "./ToolbarPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/ToolbarPage/Examples";

const NO_WIDTH = 0;
const WIDE_SPAN = 2;

type ResizableBarProps = ParentProps<{
    width: () => number;
    onResize: (width: number) => void;
}>;

const ResizableBar = (props: ResizableBarProps) => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const getLayerClass = useLayerClass();

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRef);

    createEffect(() => {
        const width = Math.round(getSize().width);

        if (width > NO_WIDTH) props.onResize(width);
    });

    return (
        <div ref={setRef} class={styles.resizer} style={{ width: `${props.width()}px` }}>
            <div class={[styles.bar, getLayerClass()].join(" ")}>{props.children}</div>
        </div>
    );
};

export const ToolbarPage = () => {
    const [getBarWidth, setBarWidth] = createSignal(ToolbarKnobs.STARTING_BAR_WIDTH);
    const [getGap, setGap] = createSignal(TOOLBAR_DEFAULTS.gap);
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);
    const pressedValues = createSignal<string[]>([]);

    const getExamples = createMemo(() => {
        const commonProps: ToolbarExampleProps = {
            gap: getGap,
            onActivate: (value) => setLastRun(value),
        };

        return [
            {
                key: "default",
                name: "Default",
                span: WIDE_SPAN,
                readout: () => `last run: ${getLastRun()} — drag the right edge and the row's tail moves into the menu`,
                component: () => (
                    <ResizableBar width={getBarWidth} onResize={setBarWidth}>
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
                    <ResizableBar width={getBarWidth} onResize={setBarWidth}>
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
                    `pressed: ${pressedValues[0]().join(", ") || "nothing"} — each action stays down until pressed again, and one that collapses is a checkbox in the menu, checked from the same list`,
                component: () => (
                    <ResizableBar width={getBarWidth} onResize={setBarWidth}>
                        <PressedExample {...commonProps} pressedValues={pressedValues} />
                    </ResizableBar>
                ),
                path: `${EXAMPLES_ROOT}/Pressed.tsx`,
            },
            {
                key: "palette",
                name: "A ring of tools",
                readout: () =>
                    `last run: ${getLastRun()} — a layout sizes the bar itself, so nothing runs out of room and the overflow menu has nothing to hold`,
                component: () => <PaletteExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Palette.tsx`,
            },
            {
                key: "sharedTooltip",
                name: "One tooltip for the row",
                span: WIDE_SPAN,
                readout: () =>
                    "a single tooltip whose anchor is whichever action is under the pointer or holds focus; moving along the row carries the tooltip with it instead of hiding one and showing the next, and its description moves with it",
                component: () => (
                    <ResizableBar width={getBarWidth} onResize={setBarWidth}>
                        <SharedTooltipExample {...commonProps} />
                    </ResizableBar>
                ),
                path: `${EXAMPLES_ROOT}/SharedTooltip.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"barWidth"}
                    label={"Bar width (px)"}
                    hint={"How wide the bar is. Narrow it far enough and items start moving into the overflow menu."}
                >
                    <PageNumberField
                        value={getBarWidth}
                        min={() => ToolbarKnobs.MIN_BAR_WIDTH}
                        max={() => ToolbarKnobs.MAX_BAR_WIDTH}
                        step={() => ToolbarKnobs.BAR_WIDTH_STEP}
                        ariaLabel={"Bar width in pixels"}
                        onInput={setBarWidth}
                    />
                </PageProp>

                <PageProp key={"gap"} label={"Gap (px)"} hint={"The space left between items on the bar."}>
                    <PageNumberField
                        value={getGap}
                        min={() => ToolbarKnobs.MIN_GAP}
                        max={() => ToolbarKnobs.MAX_GAP}
                        step={() => ToolbarKnobs.GAP_STEP}
                        ariaLabel={"Gap in pixels"}
                        onInput={setGap}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

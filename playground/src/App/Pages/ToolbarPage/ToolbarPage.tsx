import { createEffect, createMemo, createSignal } from "solid-js";
import type { ParentProps } from "solid-js";

import { ElementObserver } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField } from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import { RefusingExample } from "./Examples/Refusing";
import { NOTHING_RUN } from "./ToolbarPage.const";
import type { ToolbarExampleProps } from "./ToolbarPage.types";

import * as styles from "./ToolbarPage.css";

const EXAMPLES_ROOT = "/src/App/Pages/ToolbarPage/Examples";

const STARTING_BAR_WIDTH = 520;
const MIN_BAR_WIDTH = 80;
const MAX_BAR_WIDTH = 760;
const BAR_WIDTH_STEP = 10;
const STARTING_GAP = 5;
const MIN_GAP = 0;
const MAX_GAP = 30;
const GAP_STEP = 1;
const NO_WIDTH = 0;
const WIDE_SPAN = 2;

type ResizableBarProps = ParentProps<{
    width: () => number;
    onResize: (width: number) => void;
}>;

const ResizableBar = (props: ResizableBarProps) => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const getSize = ElementObserver.createBorderBoxSizeObserver(getRef);

    createEffect(() => {
        const width = Math.round(getSize().width);

        if (width > NO_WIDTH) props.onResize(width);
    });

    return (
        <div ref={setRef} class={styles.resizer} style={{ width: `${props.width()}px` }}>
            <div class={styles.bar}>{props.children}</div>
        </div>
    );
};

export const ToolbarPage = () => {
    const [getBarWidth, setBarWidth] = createSignal(STARTING_BAR_WIDTH);
    const [getGap, setGap] = createSignal(STARTING_GAP);
    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);

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
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"barWidth"} label={"Bar width (px)"}>
                    <PageNumberField
                        value={getBarWidth}
                        min={() => MIN_BAR_WIDTH}
                        max={() => MAX_BAR_WIDTH}
                        step={() => BAR_WIDTH_STEP}
                        ariaLabel={"Bar width in pixels"}
                        onInput={setBarWidth}
                    />
                </PageProp>

                <PageProp key={"gap"} label={"Gap (px)"}>
                    <PageNumberField
                        value={getGap}
                        min={() => MIN_GAP}
                        max={() => MAX_GAP}
                        step={() => GAP_STEP}
                        ariaLabel={"Gap in pixels"}
                        onInput={setGap}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

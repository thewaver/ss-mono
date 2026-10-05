import { For, createSignal } from "solid-js";

import { LightCatcher, Range } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.css";
import type { LightCatcherExampleProps } from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.types";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageRangeContent } from "../../../../StyledComponents/RangeContent/RangeContent";

const LAMPS = [1, 2, 3, 4, 5];
const PERCENT = 100;
const SLIDER_STEP = 1;
const SLIDER_LENGTH = 360;
const STARTING_PERCENT = 20;
const MIDDLE = 0.5;

type Props = LightCatcherExampleProps;

export const PlacedLightExample = (props: Props) => {
    const [getRowRef, setRowRef] = createSignal<HTMLElement>();
    const [getPercent, setPercent] = createSignal(STARTING_PERCENT);

    const getPointSource = () => ({ ratio: { x: getPercent() / PERCENT, y: MIDDLE }, element: getRowRef() });

    return (
        <div class={styles.placedStage}>
            <PageMeasureBox isFilling>
                <div ref={setRowRef} class={styles.placedRow}>
                    <For each={LAMPS}>
                        {(lamp) => (
                            <div class={styles.lampSlot}>
                                <LightCatcher
                                    isDisabled={props.isDisabled}
                                    activeRangePx={props.activeRangePx}
                                    smoothingMs={props.smoothingMs}
                                    lightRangePx={props.lightRangePx}
                                    maxBrightness={props.maxBrightness}
                                    restingBrightness={props.restingBrightness}
                                    maxLightness={props.maxLightness}
                                    restingLightness={props.restingLightness}
                                    pointSource={getPointSource}
                                >
                                    <div class={styles.lamp}>{lamp}</div>
                                </LightCatcher>
                            </div>
                        )}
                    </For>
                </div>
            </PageMeasureBox>

            <div class={styles.slider}>
                <Range
                    id={"placedLightSlider"}
                    sizing={"fill"}
                    ariaLabel={"Where the light is across the row"}
                    min={() => 0}
                    max={() => PERCENT}
                    step={() => SLIDER_STEP}
                    value={[getPercent, setPercent]}
                    renderContent={(getRenderProps) => (
                        <PageRangeContent renderProps={getRenderProps} length={() => SLIDER_LENGTH} />
                    )}
                />
            </div>
        </div>
    );
};

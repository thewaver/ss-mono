import { useState } from "react";

import { LightCatcher, Range } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.css";

import { PageRangeContent } from "../../../../StyledComponents/RangeContent/RangeContent";
import type { LightCatcherExampleProps } from "../LightCatcherPageReact.types";

const LAMPS = [1, 2, 3, 4, 5];
const PERCENT = 100;
const SLIDER_STEP = 1;
const SLIDER_LENGTH = 360;
const STARTING_PERCENT = 20;
const MIDDLE = 0.5;

type Props = LightCatcherExampleProps;

export const PlacedLightExample = (props: Props) => {
    const [rowRef, setRowRef] = useState<HTMLElement | null>(null);
    const [percent, setPercent] = useState(STARTING_PERCENT);

    const pointSource = { ratio: { x: percent / PERCENT, y: MIDDLE }, element: rowRef ?? undefined };

    return (
        <div className={styles.placedStage}>
            <div ref={setRowRef} className={styles.placedRow}>
                {LAMPS.map((lamp) => (
                    <div key={lamp} className={styles.lampSlot}>
                        <LightCatcher
                            isDisabled={props.isDisabled}
                            activeRangePx={props.activeRangePx}
                            smoothingMs={props.smoothingMs}
                            lightRangePx={props.lightRangePx}
                            maxBrightness={props.maxBrightness}
                            restingBrightness={props.restingBrightness}
                            maxLightness={props.maxLightness}
                            restingLightness={props.restingLightness}
                            pointSource={pointSource}
                        >
                            <div className={styles.lamp}>{lamp}</div>
                        </LightCatcher>
                    </div>
                ))}
            </div>

            <div className={styles.slider}>
                <Range
                    id={"placedLightSlider"}
                    sizing={"fill"}
                    ariaLabel={"Where the light is across the row"}
                    min={0}
                    max={PERCENT}
                    step={SLIDER_STEP}
                    value={[percent, setPercent]}
                    renderContent={(renderProps) => (
                        <PageRangeContent renderProps={renderProps} length={SLIDER_LENGTH} />
                    )}
                />
            </div>
        </div>
    );
};

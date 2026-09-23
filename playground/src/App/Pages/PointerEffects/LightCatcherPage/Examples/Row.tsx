import { For } from "solid-js";

import { LightCatcher } from "@thewaver/ss-components";

import type { LightCatcherExampleProps } from "../LightCatcherPage.types";

import * as styles from "../LightCatcherPage.css";

const LAMPS = [1, 2, 3, 4, 5];

type Props = LightCatcherExampleProps;

export const RowExample = (props: Props) => {
    return (
        <div class={styles.row}>
            <For each={LAMPS}>
                {(lamp) => (
                    <div class={styles.lampSlot}>
                        <LightCatcher
                            isDisabled={props.isDisabled}
                            activeRangePx={props.activeRangePx}
                            lightRangePx={props.lightRangePx}
                            maxBrightness={props.maxBrightness}
                            restingBrightness={props.restingBrightness}
                            maxLightness={props.maxLightness}
                            restingLightness={props.restingLightness}
                        >
                            <div class={styles.lamp}>{lamp}</div>
                        </LightCatcher>
                    </div>
                )}
            </For>
        </div>
    );
};

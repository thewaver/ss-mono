import type { Accessor, ParentProps } from "solid-js";

import { Odometer, access } from "@thewaver/ss-components";
import type { OdometerSlotFlags } from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { OdometerExampleProps } from "../OdometerPage.types";

import * as styles from "../OdometerPage.css";

const DIGIT_SIZE = { width: 34, height: 52 };

type Props = OdometerExampleProps;

type FadeProps = {
    class: string;
    flags: Accessor<OdometerSlotFlags>;
    durationMs: number;
};

const Fade = (props: ParentProps<FadeProps>) => (
    <div
        class={props.class}
        classList={{ [styles.isEntering]: props.flags().isEntering, [styles.isLeaving]: props.flags().isLeaving }}
        style={assignInlineVars({ [styles.fadeDurationVar]: `${props.durationMs}ms` })}
    >
        {props.children}
    </div>
);

export const CounterExample = (props: Props) => {
    return (
        <Odometer
            text={props.text}
            digitSize={() => DIGIT_SIZE}
            turnDurationMs={props.turnDurationMs}
            cascadeDelayMs={props.cascadeDelayMs}
            ariaLabel={"Score"}
            renderDigit={(getDigit, getFlags) => (
                <Fade class={styles.digit} flags={getFlags} durationMs={access(props.turnDurationMs)}>
                    {getDigit()}
                </Fade>
            )}
            renderFixed={(getCharacter, getFlags) => (
                <Fade class={styles.fixed} flags={getFlags} durationMs={access(props.turnDurationMs)}>
                    {getCharacter()}
                </Fade>
            )}
        />
    );
};

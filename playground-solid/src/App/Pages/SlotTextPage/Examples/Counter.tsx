import type { Accessor, ParentProps } from "solid-js";

import { SlotText, access } from "@thewaver/ss-components-solid";
import type { SlotTextSlotFlags } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { SlotTextExampleProps } from "../SlotTextPage.types";

const DIGIT_SIZE = { width: 34, height: 52 };

type Props = SlotTextExampleProps;

type FadeProps = {
    class: string;
    flags: Accessor<SlotTextSlotFlags>;
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
        <SlotText
            text={props.text}
            characterSize={() => DIGIT_SIZE}
            turnDurationMs={props.turnDurationMs}
            turnDelayMs={props.turnDelayMs}
            ariaLabel={"Score"}
            renderTurning={(getDigit, getFlags) => (
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

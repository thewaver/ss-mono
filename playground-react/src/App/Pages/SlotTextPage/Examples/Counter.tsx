import type { PropsWithChildren } from "react";

import { SlotText } from "@thewaver/ss-components-react";
import type { SlotTextSlotFlags } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { SlotTextExampleProps } from "../SlotTextPage.types";

const DIGIT_SIZE = { width: 34, height: 52 };

type Props = SlotTextExampleProps;

type FadeProps = {
    className: string;
    flags: SlotTextSlotFlags;
    durationMs: number;
};

const Fade = (props: PropsWithChildren<FadeProps>) => (
    <div
        className={[
            props.className,
            props.flags.isEntering && styles.isEntering,
            props.flags.isLeaving && styles.isLeaving,
        ]
            .filter(Boolean)
            .join(" ")}
        style={assignInlineVars({ [styles.fadeDurationVar]: `${props.durationMs}ms` })}
    >
        {props.children}
    </div>
);

export const CounterExample = (props: Props) => {
    return (
        <SlotText
            text={props.text}
            characterSize={DIGIT_SIZE}
            turnDurationMs={props.turnDurationMs}
            turnDelayMs={props.turnDelayMs}
            ariaLabel={"Score"}
            renderTurning={(digit, flags) => (
                <Fade className={styles.digit} flags={flags} durationMs={props.turnDurationMs}>
                    {digit}
                </Fade>
            )}
            renderFixed={(character, flags) => (
                <Fade className={styles.fixed} flags={flags} durationMs={props.turnDurationMs}>
                    {character}
                </Fade>
            )}
        />
    );
};

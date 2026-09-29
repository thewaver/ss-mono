import type { PropsWithChildren } from "react";

import { Odometer } from "@thewaver/ss-components-react";
import type { OdometerSlotFlags } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { OdometerExampleProps } from "../OdometerPage.types";

const DIGIT_SIZE = { width: 34, height: 52 };

type Props = OdometerExampleProps;

type FadeProps = {
    className: string;
    flags: OdometerSlotFlags;
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
        <Odometer
            text={props.text}
            digitSize={DIGIT_SIZE}
            turnDurationMs={props.turnDurationMs}
            cascadeDelayMs={props.cascadeDelayMs}
            ariaLabel={"Score"}
            renderDigit={(digit, flags) => (
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

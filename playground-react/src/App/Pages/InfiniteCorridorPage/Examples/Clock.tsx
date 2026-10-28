import { useEffect, useMemo, useState } from "react";

import { Button, InfiniteCorridor, MediaQueryMonitorReactUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { useSpinDegrees } from "../InfiniteCorridorPage.utils";
import type { InfiniteCorridorClockExampleProps } from "../InfiniteCorridorPageReact.types";
import { Room } from "./Room";

type Props = InfiniteCorridorClockExampleProps;

export const ClockExample = (props: Props) => {
    const [progress, setProgress] = useState(0);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const [isWalking, setIsWalking] = useState(!prefersReducedMotion);

    useEffect(() => {
        if (!isWalking) return;

        let frameId: number;
        let lastMs = performance.now();

        const walk = () => {
            const nowMs = performance.now();

            setProgress((previous) => (previous + (nowMs - lastMs) / props.lapMs) % 1);
            lastMs = nowMs;
            frameId = requestAnimationFrame(walk);
        };

        frameId = requestAnimationFrame(walk);

        return () => cancelAnimationFrame(frameId);
    }, [isWalking, props.lapMs]);

    const spinDegrees = useSpinDegrees(props.spinDegreesPerSecond, isWalking);

    const layout = useMemo(() => props.toLayout(spinDegrees), [props.toLayout, spinDegrees]);

    return (
        <div className={styles.stage}>
            <div className={styles.frame}>
                <InfiniteCorridor
                    items={props.items}
                    layout={layout}
                    progress={[progress, setProgress]}
                    glideDurationMs={props.glideDurationMs}
                    ariaLabel={"Walking corridor"}
                    renderItem={(name, state) => <Room name={name} state={state} />}
                />
            </div>

            <Button
                id={"corridorWalk"}
                ariaLabel={isWalking ? "Pause" : "Walk"}
                renderContent={(flags) => (
                    <PageControlButtonContent
                        flags={flags}
                        glyph={isWalking ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play}
                    />
                )}
                onClick={() => {
                    setIsWalking(!isWalking);
                }}
            />
        </div>
    );
};

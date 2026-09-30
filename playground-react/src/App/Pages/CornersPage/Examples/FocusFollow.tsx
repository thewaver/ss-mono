import { useRef, useState } from "react";

import { Button, Corners, ElementObserverReactUtils, MediaQueryMonitorReactUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/CornersPage/CornersPage.css";
import type { Rect } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CornersExampleProps } from "../CornersPage.types";

type Props = CornersExampleProps;

const TRANSPARENT = "transparent";
const BOX_PADDING_PX = 10;
const CONTROLS = ["Open", "Save", "Share", "Delete"];

export const FocusFollowExample = (props: Props) => {
    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const stageRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLElement>(null);
    const boxRectRef = useRef<Rect>(undefined);

    const [hovered, setHovered] = useState<HTMLElement>();
    const [focused, setFocused] = useState<HTMLElement>();

    const target = hovered ?? focused;

    targetRef.current = target ?? null;

    const stageRect = ElementObserverReactUtils.useViewportRect(stageRef, true);
    const targetRect = ElementObserverReactUtils.useViewportRect(targetRef, target !== undefined, {
        padding: BOX_PADDING_PX,
    });

    if (stageRect && targetRect && target) {
        boxRectRef.current = {
            x: targetRect.x - stageRect.x,
            y: targetRect.y - stageRect.y,
            width: targetRect.width,
            height: targetRect.height,
        };
    }

    const boxRect = boxRectRef.current;

    const glideMs = prefersReducedMotion ? 0 : props.transitionDurationMs;

    return (
        <div ref={stageRef} className={styles.followStage}>
            {CONTROLS.map((label) => (
                <div
                    key={label}
                    className={styles.followSlot}
                    onPointerEnter={(e) => setHovered(e.currentTarget)}
                    onPointerLeave={() => setHovered(undefined)}
                    onFocus={(e) => {
                        if ((e.target as HTMLElement).matches(":focus-visible")) setFocused(e.currentTarget);
                    }}
                    onBlur={() => setFocused(undefined)}
                >
                    <Button renderContent={(flags) => <PageButtonContent flags={flags}>{label}</PageButtonContent>} />
                </div>
            ))}

            {boxRect && (
                <div
                    className={styles.followBox}
                    style={{
                        left: `${boxRect.x}px`,
                        top: `${boxRect.y}px`,
                        width: `${boxRect.width}px`,
                        height: `${boxRect.height}px`,
                        transitionDuration: `${glideMs}ms`,
                    }}
                >
                    <Corners
                        color={target ? props.color : TRANSPARENT}
                        cornerLength={props.cornerLength}
                        strokeThickness={props.strokeThickness}
                        transitionDurationMs={props.transitionDurationMs}
                        visibleCorners={props.visibleCorners}
                    />
                </div>
            )}
        </div>
    );
};

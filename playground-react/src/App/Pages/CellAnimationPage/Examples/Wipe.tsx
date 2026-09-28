import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
    Button,
    CellAnimation,
    CellAnimationBreakpointUtils,
    CellAnimationKeyframeUtils,
    CellAnimationOrigins,
    CellAnimationPlaybackUtils,
    CellAnimationWeights,
    MediaQueryMonitorReactUtils,
    useViewportContext,
} from "@thewaver/ss-components-react";
import type { CellAnimationPlaybackOpts } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CellAnimationExampleProps } from "../CellAnimationPage.types";

const WIPE_CELL_SIZE = 120;
const WIPE_LEG_MS = 600;
const WIPE_COLOR = "black";
const LOZENGE_COVER_PERCENT = 150;
const WIPE_PLAYBACK: CellAnimationPlaybackOpts = { dir: "alternate", holdMs: 400 };
const LOZENGE_GROW = CellAnimationKeyframeUtils.fromStops([
    { at: 0, rotate: 45, scaleX: 0, scaleY: 0 },
    { at: 1, rotate: 45, scaleX: LOZENGE_COVER_PERCENT, scaleY: LOZENGE_COVER_PERCENT },
]);

const computeSolidSource = (size: Size2d) =>
    `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"><rect width="100%" height="100%" fill="${WIPE_COLOR}"/></svg>`,
    )}`;

type Props = Pick<CellAnimationExampleProps, "originType" | "weightType" | "weightOpts" | "breakpointOpts">;

export const WipeExample = (props: Props) => {
    const viewportContext = useViewportContext();

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const [wipeSize, setWipeSize] = useState<Size2d>();

    const cellCount = useMemo<Index2d>(
        () => ({
            col: Math.ceil((wipeSize?.width ?? 0) / WIPE_CELL_SIZE),
            row: Math.ceil((wipeSize?.height ?? 0) / WIPE_CELL_SIZE),
        }),
        [wipeSize],
    );

    const origin = useMemo(
        () => CellAnimationOrigins.computeOrigin(props.originType, cellCount),
        [props.originType, cellCount],
    );

    const legMs = prefersReducedMotion ? 0 : WIPE_LEG_MS;

    return (
        <>
            <Button
                id={"cellAnimationWipe"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Wipe the screen</PageButtonContent>}
                onClick={() => {
                    if (wipeSize) return;

                    setWipeSize({ ...viewportContext.getSize() });
                }}
            />

            {wipeSize &&
                createPortal(
                    <div className={styles.wipeOverlay}>
                        <CellAnimation
                            src={computeSolidSource(wipeSize)}
                            cellCount={cellCount}
                            animationDurationMs={CellAnimationPlaybackUtils.computeCycleDurationMs(
                                legMs,
                                WIPE_PLAYBACK,
                            )}
                            animationIterationCount={1}
                            finalFrame={"nothing"}
                            computeCellWeights={(count) =>
                                CellAnimationWeights.computeCellWeights(
                                    props.weightType,
                                    count,
                                    origin,
                                    props.weightOpts,
                                )
                            }
                            computeCellAnimation={(defs, timeline) =>
                                CellAnimationKeyframeUtils.computeAnimation(
                                    LOZENGE_GROW,
                                    CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, props.breakpointOpts),
                                    { ...defs, origin },
                                    CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, legMs, WIPE_PLAYBACK),
                                    props.breakpointOpts.easing,
                                )
                            }
                            onAnimationEnd={() => setWipeSize(undefined)}
                        />
                    </div>,
                    viewportContext.getPortalRef() ?? document.body,
                )}
        </>
    );
};

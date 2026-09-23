import { Show, createMemo, createSignal } from "solid-js";
import { Portal } from "solid-js/web";

import {
    Button,
    CellAnimation,
    CellAnimationBreakpoints,
    CellAnimationKeyframeUtils,
    CellAnimationOrigins,
    CellAnimationPlayback,
    CellAnimationWeights,
    MediaQueryMonitorUtils,
    access,
    useViewportContext,
} from "@thewaver/ss-components";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CellAnimationExampleProps } from "../CellAnimationPage.types";

import * as styles from "../CellAnimationPage.css";

const WIPE_CELL_SIZE = 120;
const WIPE_LEG_MS = 600;
const WIPE_COLOR = "black";
const LOZENGE_COVER_PERCENT = 150;
const WIPE_PLAYBACK: CellAnimationPlayback.PlaybackOpts = { dir: "alternate", holdMs: 400 };
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

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    const [getWipeSize, setWipeSize] = createSignal<Size2d>();

    const getCellCount = createMemo<Index2d>(() => ({
        col: Math.ceil((getWipeSize()?.width ?? 0) / WIPE_CELL_SIZE),
        row: Math.ceil((getWipeSize()?.height ?? 0) / WIPE_CELL_SIZE),
    }));

    const getOrigin = createMemo(() => CellAnimationOrigins.computeOrigin(access(props.originType), getCellCount()));

    const getLegMs = createMemo(() => (getPrefersReducedMotion() ? 0 : WIPE_LEG_MS));

    return (
        <>
            <Button
                id={"cellAnimationWipe"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Wipe the screen</PageButtonContent>}
                onClick={() => {
                    if (getWipeSize()) return;

                    setWipeSize({ ...viewportContext.getSize() });
                }}
            />

            <Show when={getWipeSize()}>
                {(getSize) => (
                    <Portal mount={viewportContext.getPortalRef()}>
                        <div class={styles.wipeOverlay}>
                            <CellAnimation
                                src={() => computeSolidSource(getSize())}
                                cellCount={getCellCount}
                                animationDurationMs={() =>
                                    CellAnimationPlayback.computeCycleDurationMs(getLegMs(), WIPE_PLAYBACK)
                                }
                                animationIterationCount={1}
                                finalFrame={"nothing"}
                                computeCellWeights={(count) =>
                                    CellAnimationWeights.computeCellWeights(
                                        access(props.weightType),
                                        count,
                                        getOrigin(),
                                        access(props.weightOpts),
                                    )
                                }
                                computeCellAnimation={(defs, timeline) =>
                                    CellAnimationKeyframeUtils.computeAnimation(
                                        LOZENGE_GROW,
                                        CellAnimationBreakpoints.computeBreakpoints(
                                            defs.weight,
                                            access(props.breakpointOpts),
                                        ),
                                        { ...defs, origin: getOrigin() },
                                        CellAnimationPlayback.computeGlobalTimeline(
                                            timeline,
                                            getLegMs(),
                                            WIPE_PLAYBACK,
                                        ),
                                        access(props.breakpointOpts).easing,
                                    )
                                }
                                onAnimationEnd={() => setWipeSize(undefined)}
                            />
                        </div>
                    </Portal>
                )}
            </Show>
        </>
    );
};

import { Show, createMemo, createSignal } from "solid-js";
import { Portal } from "solid-js/web";

import {
    Button,
    CellAnimation,
    CellAnimationOrigins,
    MediaQueryMonitorSolidUtils,
    SliceAnimationKeyframeUtils,
    SliceAnimationWeights,
    access,
    useViewportContext,
} from "@thewaver/ss-components-solid";
import type { SliceAnimationPlaybackOpts } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { CellAnimationExampleProps } from "../CellAnimationPage.types";

const WIPE_CELL_SIZE = 120;
const WIPE_LEG_MS = 600;
const WIPE_COLOR = "black";
const LOZENGE_COVER_PERCENT = 150;
const WIPE_PLAYBACK: SliceAnimationPlaybackOpts = { dir: "pipe", holdMs: 400 };
const LOZENGE_GROW = SliceAnimationKeyframeUtils.fromStops([
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

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

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
                renderContent={(getFlags) => (
                    <PageControlButtonContent flags={getFlags}>Wipe the screen</PageControlButtonContent>
                )}
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
                                origin={getOrigin}
                                breakpointOpts={props.breakpointOpts}
                                playbackOpts={WIPE_PLAYBACK}
                                animationDurationMs={getLegMs}
                                animationIterationCount={1}
                                finalFrame={"nothing"}
                                computeSliceWeights={(count) =>
                                    SliceAnimationWeights.computeSliceWeights(
                                        access(props.weightType),
                                        count,
                                        getOrigin(),
                                        access(props.weightOpts),
                                    )
                                }
                                computeSliceAnimation={LOZENGE_GROW}
                                onAnimationEnd={() => setWipeSize(undefined)}
                            />
                        </div>
                    </Portal>
                )}
            </Show>
        </>
    );
};

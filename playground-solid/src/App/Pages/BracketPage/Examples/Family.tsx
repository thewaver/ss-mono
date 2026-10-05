import { For, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import { BRACKET_DEFAULTS, Bracket, BracketUtils, Button, access } from "@thewaver/ss-components-solid";
import type { BracketNode, BracketStep } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";
import { EasingUtils, MathUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    branch,
    computeBracketPinnedLayerHeader,
    computeFamilySteps,
    describeFamily,
    renderBracketNode,
    seed,
} from "../BracketPage.const";
import type { BracketFamilyExampleProps } from "../BracketPage.types";

const NODE_SIZE = { width: 96, height: 34 };
const ROUND_NAMES = ["Final", "Semifinals", "Quarterfinals", "Entrants"];
const ACROSS_HEADER_SIZE = 24;
const DOWN_HEADER_SIZE = 96;
const SECTION_MARGIN_PX = 12;
const WHOLE = 1;
const HALF = 0.5;
const NO_DURATION = 0;

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
);

const LAYOUT = BracketUtils.computeLayout(DRAW);

type Props = BracketFamilyExampleProps;

export const FamilyExample = (props: Props) => {
    const [getFamily, setFamily] = createSignal<BracketNode<string>>();
    const [getIsZoomedIn, setIsZoomedIn] = createSignal(true);

    const getHeaderSize = () => (access(props.orientation) === "horizontal" ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE);

    const getGeometryOpts = () => ({
        nodeSize: NODE_SIZE,
        layerGap: access(props.layerGap) ?? BRACKET_DEFAULTS.layerGap,
        crossGap: access(props.crossGap) ?? BRACKET_DEFAULTS.crossGap,
        orientation: access(props.orientation) ?? BRACKET_DEFAULTS.orientation,
        rootSide: access(props.rootSide) ?? BRACKET_DEFAULTS.rootSide,
        headerExtent: getHeaderSize(),
    });

    const getFrameSize = createMemo(
        () => BracketUtils.computeGeometry(BracketUtils.computeFamilyExtent(LAYOUT), getGeometryOpts()).boardSize,
    );

    const getTreeGeometry = createMemo(() => BracketUtils.computeGeometry(LAYOUT, getGeometryOpts()));

    const getIsHorizontal = () => getTreeGeometry().isHorizontal;

    const getSectionBox = () => {
        const anchorId = BracketUtils.findNodeId(DRAW, LAYOUT, getFamily());
        const insets = LAYOUT.placements
            .filter((placement) => BracketUtils.getIsInFamily(placement.id, anchorId))
            .map((placement) => BracketUtils.computeInset(getTreeGeometry(), placement));
        const headerRoom = getHeaderSize();
        const left =
            Math.min(...insets.map((inset) => inset.left)) - SECTION_MARGIN_PX - (getIsHorizontal() ? 0 : headerRoom);
        const top =
            Math.min(...insets.map((inset) => inset.top)) - SECTION_MARGIN_PX - (getIsHorizontal() ? headerRoom : 0);
        const right = Math.max(...insets.map((inset) => inset.left)) + NODE_SIZE.width + SECTION_MARGIN_PX;
        const bottom = Math.max(...insets.map((inset) => inset.top)) + NODE_SIZE.height + SECTION_MARGIN_PX;

        return { left, top, width: right - left, height: bottom - top };
    };

    const getWholeBox = () => ({ left: 0, top: 0, ...getTreeGeometry().boardSize });

    const getTargetCamera = createMemo(() => {
        const frame = getFrameSize();
        const box = getIsZoomedIn() ? getSectionBox() : getWholeBox();
        const scale = Math.min(frame.width / box.width, frame.height / box.height, WHOLE);

        return {
            x: frame.width * HALF - (box.left + box.width * HALF) * scale,
            y: frame.height * HALF - (box.top + box.height * HALF) * scale,
            scale,
        };
    });

    const [getCamera, setCamera] = createSignal(untrack(getTargetCamera));

    createEffect(
        on(
            getTargetCamera,
            (target) => {
                const from = untrack(getCamera);
                const durationMs = untrack(() => access(props.transitionDurationMs)) ?? NO_DURATION;
                const startMs = performance.now();

                if (durationMs <= NO_DURATION) {
                    setCamera(target);

                    return;
                }

                let frameId = requestAnimationFrame(function glide(nowMs) {
                    const ratio = EasingUtils.easeInOutCubic(MathUtils.clamp01((nowMs - startMs) / durationMs));

                    setCamera({
                        x: MathUtils.lerp(from.x, target.x, ratio),
                        y: MathUtils.lerp(from.y, target.y, ratio),
                        scale: MathUtils.lerp(from.scale, target.scale, ratio),
                    });

                    if (ratio < WHOLE) frameId = requestAnimationFrame(glide);
                });

                onCleanup(() => cancelAnimationFrame(frameId));
            },
            { defer: true },
        ),
    );

    const getCameraStyle = () => {
        const camera = getCamera();
        const pin = (offset: number) => `${-offset / camera.scale}px`;

        return {
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
            ...assignInlineVars({
                [styles.headerPinXVar]: getIsHorizontal() ? "0px" : pin(camera.x),
                [styles.headerPinYVar]: getIsHorizontal() ? pin(camera.y) : "0px",
            }),
        };
    };

    const computeStep = (step: BracketStep) => BracketUtils.computeFamilyStep(DRAW, getFamily(), step);

    createEffect(() => props.onFamilyChange(describeFamily(DRAW.value, getFamily()?.value)));

    return (
        <div class={styles.familyStage}>
            <PageMeasureBox>
                <div
                    class={styles.familyFrame}
                    style={{ width: `${getFrameSize().width}px`, height: `${getFrameSize().height}px` }}
                >
                    <div class={styles.familyCamera} style={getCameraStyle()}>
                        <div class={styles.board}>
                            <Bracket
                                root={() => DRAW}
                                nodeSize={() => NODE_SIZE}
                                family={[getFamily, setFamily]}
                                layerGap={props.layerGap}
                                crossGap={props.crossGap}
                                orientation={props.orientation}
                                rootSide={props.rootSide}
                                layerHeaderSize={getHeaderSize}
                                ariaLabel={"Knockout draw, one family at a time"}
                                onActivate={props.onActivate}
                                renderConnector={props.renderConnector}
                                renderNode={renderBracketNode}
                                renderLayerHeader={computeBracketPinnedLayerHeader(ROUND_NAMES)}
                            />
                        </div>
                    </div>
                </div>
            </PageMeasureBox>

            <div class={styles.familyControls}>
                <Button
                    id={"familyZoom"}
                    renderContent={(getFlags) => (
                        <PageButtonContent flags={getFlags}>
                            {getIsZoomedIn() ? "Zoom out" : "Zoom in"}
                        </PageButtonContent>
                    )}
                    onClick={() => {
                        setIsZoomedIn((isZoomedIn) => !isZoomedIn);
                    }}
                />

                <For each={computeFamilySteps(access(props.orientation))}>
                    {(entry) => (
                        <Button
                            id={`familyStep-${entry.step}`}
                            isDisabled={() => !getIsZoomedIn() || computeStep(entry.step) === getFamily()}
                            renderContent={(getFlags) => (
                                <PageButtonContent flags={getFlags}>{entry.label}</PageButtonContent>
                            )}
                            onClick={() => {
                                setFamily(() => computeStep(entry.step));
                            }}
                        />
                    )}
                </For>
            </div>
        </div>
    );
};

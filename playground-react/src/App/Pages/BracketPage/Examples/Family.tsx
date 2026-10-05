import { useEffect, useRef, useState } from "react";

import { Bracket, BracketUtils, Button } from "@thewaver/ss-components-react";
import type { BracketNode, BracketStep } from "@thewaver/ss-components-react";
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
const LAYER_HEADER = computeBracketPinnedLayerHeader(ROUND_NAMES);

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
);

const LAYOUT = BracketUtils.computeLayout(DRAW);

type Props = BracketFamilyExampleProps;

export const FamilyExample = (props: Props) => {
    const [family, setFamily] = useState<BracketNode<string>>();
    const [isZoomedIn, setIsZoomedIn] = useState(true);

    const headerSize = props.orientation === "horizontal" ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE;

    const geometryOpts = {
        nodeSize: NODE_SIZE,
        layerGap: props.layerGap,
        crossGap: props.crossGap,
        orientation: props.orientation,
        rootSide: props.rootSide,
        headerExtent: headerSize,
    };

    const frameSize = BracketUtils.computeGeometry(BracketUtils.computeFamilyExtent(LAYOUT), geometryOpts).boardSize;

    const treeGeometry = BracketUtils.computeGeometry(LAYOUT, geometryOpts);

    const isHorizontal = treeGeometry.isHorizontal;

    const computeSectionBox = () => {
        const anchorId = BracketUtils.findNodeId(DRAW, LAYOUT, family);
        const insets = LAYOUT.placements
            .filter((placement) => BracketUtils.getIsInFamily(placement.id, anchorId))
            .map((placement) => BracketUtils.computeInset(treeGeometry, placement));
        const left =
            Math.min(...insets.map((inset) => inset.left)) - SECTION_MARGIN_PX - (isHorizontal ? 0 : headerSize);
        const top = Math.min(...insets.map((inset) => inset.top)) - SECTION_MARGIN_PX - (isHorizontal ? headerSize : 0);
        const right = Math.max(...insets.map((inset) => inset.left)) + NODE_SIZE.width + SECTION_MARGIN_PX;
        const bottom = Math.max(...insets.map((inset) => inset.top)) + NODE_SIZE.height + SECTION_MARGIN_PX;

        return { left, top, width: right - left, height: bottom - top };
    };

    const box = isZoomedIn ? computeSectionBox() : { left: 0, top: 0, ...treeGeometry.boardSize };
    const scale = Math.min(frameSize.width / box.width, frameSize.height / box.height, WHOLE);
    const target = {
        x: frameSize.width * HALF - (box.left + box.width * HALF) * scale,
        y: frameSize.height * HALF - (box.top + box.height * HALF) * scale,
        scale,
    };

    const [camera, setCamera] = useState(target);
    const cameraRef = useRef(camera);
    const isFirstTarget = useRef(true);

    cameraRef.current = camera;

    useEffect(() => {
        if (isFirstTarget.current) {
            isFirstTarget.current = false;

            return;
        }

        const from = cameraRef.current;
        const durationMs = props.transitionDurationMs ?? NO_DURATION;
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

        return () => cancelAnimationFrame(frameId);
    }, [target.x, target.y, target.scale]);

    const pin = (offset: number) => `${-offset / camera.scale}px`;

    const cameraStyle = {
        transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
        ...assignInlineVars({
            [styles.headerPinXVar]: isHorizontal ? "0px" : pin(camera.x),
            [styles.headerPinYVar]: isHorizontal ? pin(camera.y) : "0px",
        }),
    };

    const computeStep = (step: BracketStep) => BracketUtils.computeFamilyStep(DRAW, family, step);

    useEffect(() => props.onFamilyChange(describeFamily(DRAW.value, family?.value)), [family]);

    return (
        <div className={styles.familyStage}>
            <PageMeasureBox>
                <div
                    className={styles.familyFrame}
                    style={{ width: `${frameSize.width}px`, height: `${frameSize.height}px` }}
                >
                    <div className={styles.familyCamera} style={cameraStyle}>
                        <div className={styles.board}>
                            <Bracket
                                root={DRAW}
                                nodeSize={NODE_SIZE}
                                family={[family, setFamily]}
                                layerGap={props.layerGap}
                                crossGap={props.crossGap}
                                orientation={props.orientation}
                                rootSide={props.rootSide}
                                layerHeaderSize={headerSize}
                                ariaLabel={"Knockout draw, one family at a time"}
                                onActivate={props.onActivate}
                                renderConnector={props.renderConnector}
                                renderNode={renderBracketNode}
                                renderLayerHeader={LAYER_HEADER}
                            />
                        </div>
                    </div>
                </div>
            </PageMeasureBox>

            <div className={styles.familyControls}>
                <Button
                    id={"familyZoom"}
                    renderContent={(flags) => (
                        <PageButtonContent flags={flags}>{isZoomedIn ? "Zoom out" : "Zoom in"}</PageButtonContent>
                    )}
                    onClick={() => {
                        setIsZoomedIn((zoomedIn) => !zoomedIn);
                    }}
                />

                {computeFamilySteps(props.orientation).map((entry) => (
                    <Button
                        key={entry.step}
                        id={`familyStep-${entry.step}`}
                        isDisabled={!isZoomedIn || computeStep(entry.step) === family}
                        renderContent={(flags) => <PageButtonContent flags={flags}>{entry.label}</PageButtonContent>}
                        onClick={() => {
                            setFamily(computeStep(entry.step));
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

import { createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import { Button, MediaQueryMonitorUtils, Shape, access } from "@thewaver/ss-components";
import type { AccessorProps } from "@thewaver/ss-components";
import { EasingUtils, MathUtils, Point2dUtils } from "@thewaver/ss-utils";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
import type { ShapeExampleProps } from "../ShapePage.types";

import * as styles from "../ShapePage.css";

const MORPH_SIZE = 240;
const MORPH_DURATION_MS = 900;
const MORPH_STEPS = 64;
const STAR_INNER_RATIO = 0.38;
const START_ANGLE = -Math.PI * 0.5;

const computeList = (pointCount: number, computeValue: (index: number) => number) =>
    Array.from({ length: pointCount }, (_, index) => computeValue(index));

const computeRing = (size: Size2d, pointCount: number, computeRadiusRatio: (index: number) => number): Point2d[] => {
    const center = { x: size.width * 0.5, y: size.height * 0.5 };
    const radius = Math.min(size.width, size.height) * 0.5;

    return Array.from({ length: pointCount }, (_, index) => {
        const angle = START_ANGLE + (index * Math.PI * 2) / pointCount;
        const distance = radius * computeRadiusRatio(index);

        return { x: center.x + Math.cos(angle) * distance, y: center.y + Math.sin(angle) * distance };
    });
};

const computeCirclePoints = (size: Size2d, pointCount: number) => computeRing(size, pointCount, () => 1);

const computeStarPoints = (size: Size2d, pointCount: number) =>
    computeRing(size, pointCount, (index) => (index % 2 ? STAR_INNER_RATIO : 1));

const blendList = (from: number[], to: number[], ratio: number) =>
    from.map((value, index) => MathUtils.lerp(value, to[index], ratio));

type Props = ShapeExampleProps &
    AccessorProps<{
        starPoints: number;
    }>;

export const MorphExample = (props: Props) => {
    const id = createUniqueId();

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    const [getMorph, setMorph] = createSignal(0);
    const [getTarget, setTarget] = createSignal(0);

    let frame: number | undefined;

    const stopTween = () => {
        if (frame !== undefined) cancelAnimationFrame(frame);

        frame = undefined;
    };

    onCleanup(stopTween);

    const morphTo = (target: number) => {
        stopTween();
        setTarget(target);

        if (getPrefersReducedMotion()) {
            setMorph(target);

            return;
        }

        const from = getMorph();
        const startedAt = performance.now();
        const durationMs = MORPH_DURATION_MS * Math.abs(target - from);

        const step = (now: number) => {
            const ratio = durationMs === 0 ? 1 : MathUtils.clamp01((now - startedAt) / durationMs);

            const morph = MathUtils.lerp(from, target, EasingUtils.easeInOutCubic(ratio));

            setMorph(Math.round(morph * MORPH_STEPS) / MORPH_STEPS);

            frame = ratio < 1 ? requestAnimationFrame(step) : undefined;
        };

        frame = requestAnimationFrame(step);
    };

    const getPointCount = createMemo(() => access(props.starPoints) * 2);

    const getJoinRadii = createMemo(() =>
        blendList(
            computeList(getPointCount(), () => 60),
            computeList(getPointCount(), (index) => (index % 2 ? 16 : 6)),
            getMorph(),
        ),
    );
    const getLameExponents = createMemo(() =>
        blendList(
            computeList(getPointCount(), () => 2),
            computeList(getPointCount(), (index) => (index % 2 ? 2 : 1)),
            getMorph(),
        ),
    );

    return (
        <div class={styles.morphHost}>
            <Shape
                joinRadii={getJoinRadii}
                lameExponents={getLameExponents}
                strokeGeom={() => [{ thicknesses: access(props.edgeThicknesses) }]}
                computePoints={(size) => {
                    const circle = computeCirclePoints(size, getPointCount());
                    const star = computeStarPoints(size, getPointCount());
                    const morph = getMorph();

                    return circle.map((point, index) => Point2dUtils.lerp(point, star[index], morph));
                }}
                computeFillDefs={(getSize, getRef) => computeShapeFillDefs(id, props, getSize, getRef)}
                computeStrokeDefs={(getSize, getRef) => computeShapeStrokeDefs(id, props, getSize, getRef)}
                renderChildren={() => <div style={{ width: `${MORPH_SIZE}px`, height: `${MORPH_SIZE}px` }} />}
            />

            <Button
                id={"morphToggle"}
                ariaLabel={getTarget() === 0 ? "Turn into a star" : "Turn into a circle"}
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>
                        {getTarget() === 0 ? "Turn into a star" : "Turn into a circle"}
                    </PageButtonContent>
                )}
                onClick={() => morphTo(getTarget() === 0 ? 1 : 0)}
            />
        </div>
    );
};

import { useEffect, useId, useMemo, useRef, useState } from "react";

import { Button, MediaQueryMonitorReactUtils, Shape } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { EasingUtils, MathUtils, Point2dUtils } from "@thewaver/ss-utils";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
import type { ShapeExampleProps } from "../ShapePage.types";

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

type Props = ShapeExampleProps & {
    starPoints: number;
};

export const MorphExample = (props: Props) => {
    const id = useId();

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const [morph, setMorph] = useState(0);
    const [target, setTarget] = useState(0);

    const frameRef = useRef<number | undefined>(undefined);

    const stopTween = () => {
        if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);

        frameRef.current = undefined;
    };

    useEffect(() => stopTween, []);

    const morphTo = (nextTarget: number) => {
        stopTween();
        setTarget(nextTarget);

        if (prefersReducedMotion) {
            setMorph(nextTarget);

            return;
        }

        const from = morph;
        const startedAt = performance.now();
        const durationMs = MORPH_DURATION_MS * Math.abs(nextTarget - from);

        const step = (now: number) => {
            const ratio = durationMs === 0 ? 1 : MathUtils.clamp01((now - startedAt) / durationMs);

            const nextMorph = MathUtils.lerp(from, nextTarget, EasingUtils.easeInOutCubic(ratio));

            setMorph(Math.round(nextMorph * MORPH_STEPS) / MORPH_STEPS);

            frameRef.current = ratio < 1 ? requestAnimationFrame(step) : undefined;
        };

        frameRef.current = requestAnimationFrame(step);
    };

    const pointCount = props.starPoints * 2;

    const joinRadii = useMemo(
        () =>
            blendList(
                computeList(pointCount, () => 60),
                computeList(pointCount, (index) => (index % 2 ? 16 : 6)),
                morph,
            ),
        [pointCount, morph],
    );
    const lameExponents = useMemo(
        () =>
            blendList(
                computeList(pointCount, () => 2),
                computeList(pointCount, (index) => (index % 2 ? 2 : 1)),
                morph,
            ),
        [pointCount, morph],
    );

    return (
        <div className={styles.morphHost}>
            <Shape
                joinRadii={joinRadii}
                lameExponents={lameExponents}
                strokeGeom={[{ thicknesses: props.edgeThicknesses }]}
                computePoints={(size) => {
                    const circle = computeCirclePoints(size, pointCount);
                    const star = computeStarPoints(size, pointCount);

                    return circle.map((point, index) => Point2dUtils.lerp(point, star[index], morph));
                }}
                computeFillDefs={(size, element) => computeShapeFillDefs(id, props, size, element)}
                computeStrokeDefs={(size, element) => computeShapeStrokeDefs(id, props, size, element)}
                renderChildren={() => <div style={{ width: `${MORPH_SIZE}px`, height: `${MORPH_SIZE}px` }} />}
            />

            <Button
                id={"morphToggle"}
                ariaLabel={target === 0 ? "Turn into a star" : "Turn into a circle"}
                renderContent={(flags) => (
                    <PageControlButtonContent flags={flags}>
                        {target === 0 ? "Turn into a star" : "Turn into a circle"}
                    </PageControlButtonContent>
                )}
                onClick={() => morphTo(target === 0 ? 1 : 0)}
            />
        </div>
    );
};

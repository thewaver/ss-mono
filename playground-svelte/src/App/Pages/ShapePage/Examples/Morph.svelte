<script lang="ts">
    import { Button, MediaQueryMonitorSvelteUtils, Shape } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
    import { EasingUtils, MathUtils, Point2dUtils } from "@thewaver/ss-utils";
    import type { Point2d, Size2d } from "@thewaver/ss-utils";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
    import type { ShapeExampleProps } from "../ShapePage.types";

    const MORPH_SIZE = 240;
    const MORPH_DURATION_MS = 900;
    const MORPH_STEPS = 64;
    const STAR_INNER_RATIO = 0.38;
    const START_ANGLE = -Math.PI * 0.5;

    const computeList = (pointCount: number, computeValue: (index: number) => number) =>
        Array.from({ length: pointCount }, (_, index) => computeValue(index));

    const computeRing = (
        size: Size2d,
        pointCount: number,
        computeRadiusRatio: (index: number) => number,
    ): Point2d[] => {
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

    let props: Props = $props();

    const id = $props.id();

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let morph = $state(0);
    let target = $state(0);

    let frame: number | undefined;

    const stopTween = () => {
        if (frame !== undefined) cancelAnimationFrame(frame);

        frame = undefined;
    };

    $effect(() => stopTween);

    const morphTo = (nextTarget: number) => {
        stopTween();
        target = nextTarget;

        if (getPrefersReducedMotion()) {
            morph = nextTarget;

            return;
        }

        const from = morph;
        const startedAt = performance.now();
        const durationMs = MORPH_DURATION_MS * Math.abs(nextTarget - from);

        const step = (now: number) => {
            const ratio = durationMs === 0 ? 1 : MathUtils.clamp01((now - startedAt) / durationMs);

            const nextMorph = MathUtils.lerp(from, nextTarget, EasingUtils.easeInOutCubic(ratio));

            morph = Math.round(nextMorph * MORPH_STEPS) / MORPH_STEPS;

            frame = ratio < 1 ? requestAnimationFrame(step) : undefined;
        };

        frame = requestAnimationFrame(step);
    };

    const pointCount = $derived(props.starPoints * 2);

    const joinRadii = $derived(
        blendList(
            computeList(pointCount, () => 60),
            computeList(pointCount, (index) => (index % 2 ? 16 : 6)),
            morph,
        ),
    );
    const lameExponents = $derived(
        blendList(
            computeList(pointCount, () => 2),
            computeList(pointCount, (index) => (index % 2 ? 2 : 1)),
            morph,
        ),
    );
</script>

<div class={styles.morphHost}>
    <Shape
        {joinRadii}
        {lameExponents}
        strokeGeom={[{ thicknesses: props.edgeThicknesses }]}
        computePoints={(size) => {
            const circle = computeCirclePoints(size, pointCount);
            const star = computeStarPoints(size, pointCount);

            return circle.map((point, index) => Point2dUtils.lerp(point, star[index], morph));
        }}
        computeFillDefs={(size, element) => computeShapeFillDefs(id, props, size, element)}
        computeStrokeDefs={(size, element) => computeShapeStrokeDefs(id, props, size, element)}
    >
        {#snippet renderChildren()}
            <div style:width={`${MORPH_SIZE}px`} style:height={`${MORPH_SIZE}px`}></div>
        {/snippet}
    </Shape>

    <Button
        id={"morphToggle"}
        ariaLabel={target === 0 ? "Turn into a star" : "Turn into a circle"}
        onClick={() => morphTo(target === 0 ? 1 : 0)}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>{target === 0 ? "Turn into a star" : "Turn into a circle"}</PageButtonContent>
        {/snippet}
    </Button>
</div>

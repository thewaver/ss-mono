<script lang="ts">
    import { untrack } from "svelte";

    import { Bracket, BracketUtils, Button, toStyle } from "@thewaver/ss-components-svelte";
    import type { BracketNode, BracketStep } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";
    import { EasingUtils, MathUtils } from "@thewaver/ss-utils";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import { branch, computeFamilySteps, describeFamily, seed } from "../BracketPage.const";
    import type { BracketFamilyExampleProps } from "../BracketPage.types";
    import PageBracketLayerHeader from "../PageBracketLayerHeader.svelte";
    import PageBracketNode from "../PageBracketNode.svelte";

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

    let props: Props = $props();

    let family = $state.raw<BracketNode<string>>();
    let isZoomedIn = $state(true);

    const headerSize = $derived(props.orientation === "horizontal" ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE);

    const geometryOpts = $derived({
        nodeSize: NODE_SIZE,
        layerGap: props.layerGap,
        crossGap: props.crossGap,
        orientation: props.orientation,
        rootSide: props.rootSide,
        headerExtent: headerSize,
    });

    const frameSize = $derived(
        BracketUtils.computeGeometry(BracketUtils.computeFamilyExtent(LAYOUT), geometryOpts).boardSize,
    );

    const treeGeometry = $derived(BracketUtils.computeGeometry(LAYOUT, geometryOpts));

    const isHorizontal = $derived(treeGeometry.isHorizontal);

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

    const targetCamera = $derived.by(() => {
        const box = isZoomedIn ? computeSectionBox() : { left: 0, top: 0, ...treeGeometry.boardSize };
        const scale = Math.min(frameSize.width / box.width, frameSize.height / box.height, WHOLE);

        return {
            x: frameSize.width * HALF - (box.left + box.width * HALF) * scale,
            y: frameSize.height * HALF - (box.top + box.height * HALF) * scale,
            scale,
        };
    });

    let camera = $state.raw(untrack(() => targetCamera));
    let isFirstTarget = true;

    $effect(() => {
        const target = targetCamera;

        if (isFirstTarget) {
            isFirstTarget = false;

            return;
        }

        const from = untrack(() => camera);
        const durationMs = untrack(() => props.transitionDurationMs) ?? NO_DURATION;
        const startMs = performance.now();

        if (durationMs <= NO_DURATION) {
            camera = target;

            return;
        }

        let frameId = requestAnimationFrame(function glide(nowMs) {
            const ratio = EasingUtils.easeInOutCubic(MathUtils.clamp01((nowMs - startMs) / durationMs));

            camera = {
                x: MathUtils.lerp(from.x, target.x, ratio),
                y: MathUtils.lerp(from.y, target.y, ratio),
                scale: MathUtils.lerp(from.scale, target.scale, ratio),
            };

            if (ratio < WHOLE) frameId = requestAnimationFrame(glide);
        });

        return () => cancelAnimationFrame(frameId);
    });

    const pin = (offset: number) => `${-offset / camera.scale}px`;

    const cameraStyle = $derived(
        toStyle({
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
            ...assignInlineVars({
                [styles.headerPinXVar]: isHorizontal ? "0px" : pin(camera.x),
                [styles.headerPinYVar]: isHorizontal ? pin(camera.y) : "0px",
            }),
        }),
    );

    const computeStep = (step: BracketStep) => BracketUtils.computeFamilyStep(DRAW, family, step);

    $effect(() => {
        props.onFamilyChange(describeFamily(DRAW.value, family?.value));
    });
</script>

<div class={styles.familyStage}>
    <PageMeasureBox>
        <div class={styles.familyFrame} style:width={`${frameSize.width}px`} style:height={`${frameSize.height}px`}>
            <div class={styles.familyCamera} style={cameraStyle}>
                <div class={styles.board}>
                    <Bracket
                        root={DRAW}
                        nodeSize={NODE_SIZE}
                        bind:family
                        layerGap={props.layerGap}
                        crossGap={props.crossGap}
                        orientation={props.orientation}
                        rootSide={props.rootSide}
                        layerHeaderSize={headerSize}
                        ariaLabel={"Knockout draw, one family at a time"}
                        onActivate={props.onActivate}
                        renderConnector={props.renderConnector}
                    >
                        {#snippet renderNode(node, state)}
                            <PageBracketNode {node} {state} />
                        {/snippet}

                        {#snippet renderLayerHeader(layer, state)}
                            <PageBracketLayerHeader names={ROUND_NAMES} {layer} isPinned isCurrent={state.isCurrent} />
                        {/snippet}
                    </Bracket>
                </div>
            </div>
        </div>
    </PageMeasureBox>

    <div class={styles.familyControls}>
        <Button
            id={"familyZoom"}
            ariaLabel={isZoomedIn ? "Zoom out" : "Zoom in"}
            onClick={() => {
                isZoomedIn = !isZoomedIn;
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={isZoomedIn ? CONTROL_GLYPHS.zoomOut : CONTROL_GLYPHS.zoomIn} />
            {/snippet}
        </Button>

        {#each computeFamilySteps(props.orientation) as entry (entry.step)}
            <Button
                id={`familyStep-${entry.step}`}
                isDisabled={!isZoomedIn || computeStep(entry.step) === family}
                ariaLabel={entry.label}
                onClick={() => {
                    family = computeStep(entry.step);
                }}
            >
                {#snippet renderContent(flags)}
                    <PageControlButtonContent {flags} glyph={entry.glyph} />
                {/snippet}
            </Button>
        {/each}
    </div>
</div>

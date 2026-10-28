<script lang="ts">
    import { untrack } from "svelte";

    import { Bracket, BracketUtils, Button } from "@thewaver/ss-components-svelte";
    import type { BracketNode, BracketStep, PanZoomView } from "@thewaver/ss-components-svelte";
    import { BracketKnobs } from "@thewaver/ss-playground/App/Knobs/Brackets.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import { branch, computeFamilySteps, describeFamily, seed } from "../BracketPageSvelte.const";
    import type { BracketFamilyExampleProps } from "../BracketPage.types";
    import PageBracketLayerHeader from "../PageBracketLayerHeader.svelte";
    import PageBracketNode from "../PageBracketNode.svelte";

    const NODE_SIZE = { width: 96, height: 34 };
    const ROUND_NAMES = ["Final", "Semifinals", "Quarterfinals", "Entrants"];
    const ACROSS_HEADER_SIZE = 24;
    const DOWN_HEADER_SIZE = 96;

    const DRAW: BracketNode<string> = branch(
        "Final",
        branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
        branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
    );

    const LAYOUT = BracketUtils.computeLayout(DRAW);

    type Props = BracketFamilyExampleProps;

    let props: Props = $props();

    let family = $state.raw<BracketNode<string>>();

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

    const anchorId = $derived(BracketUtils.findNodeId(DRAW, LAYOUT, family));

    const computeFamilyView = () =>
        BracketUtils.computeFamilyView(LAYOUT, treeGeometry, anchorId, BracketKnobs.FAMILY_MARGIN);

    let view = $state.raw<PanZoomView>(untrack(computeFamilyView));

    const isZoomedIn = $derived(
        BracketUtils.computeFamilyInView(
            LAYOUT,
            treeGeometry,
            view,
            frameSize.height / frameSize.width,
            BracketKnobs.FAMILY_MARGIN,
        ) !== undefined,
    );

    const computeStep = (step: BracketStep) => BracketUtils.computeFamilyStep(DRAW, family, step);

    $effect(() => {
        props.onFamilyChange(describeFamily(DRAW.value, family?.value));
    });
</script>

<div class={styles.familyStage}>
    <PageMeasureBox>
        <div class={styles.familyFrame} style:width={`${frameSize.width}px`} style:height={`${frameSize.height}px`}>
            <Bracket
                root={DRAW}
                nodeSize={NODE_SIZE}
                bind:family
                bind:view
                isFollowingFamily={true}
                isSnappingToFamily={props.isSnappingToFamily}
                familyMargin={BracketKnobs.FAMILY_MARGIN}
                transitionDurationMs={props.transitionDurationMs}
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
                    <PageBracketLayerHeader names={ROUND_NAMES} {layer} isCurrent={state.isCurrent} />
                {/snippet}
            </Bracket>
        </div>
    </PageMeasureBox>

    <div class={styles.familyControls}>
        <Button
            id={"familyZoom"}
            ariaLabel={isZoomedIn ? "Zoom out" : "Zoom in"}
            onClick={() => {
                view = isZoomedIn ? BracketUtils.computeWholeView(treeGeometry) : computeFamilyView();
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

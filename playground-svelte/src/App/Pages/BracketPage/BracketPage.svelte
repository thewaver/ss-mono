<script lang="ts">
    import {
        BRACKET_DEFAULTS,
        BRACKET_ORIENTATIONS,
        BRACKET_ROOT_SIDES,
        BracketConnectors,
        Markup,
        MediaQueryMonitorSvelteUtils,
    } from "@thewaver/ss-components-svelte";
    import type { BracketConnectorDefs, BracketOrientation, BracketRootSide } from "@thewaver/ss-components-svelte";
    import { BracketKnobs } from "@thewaver/ss-playground/App/Knobs/Brackets.const";
    import {
        CONNECTOR_FROM_COLOR,
        CONNECTOR_TO_COLOR,
        ROUTE_FROM_COLOR,
        ROUTE_TO_COLOR,
    } from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import { NOTHING_PICKED } from "./BracketPage.const";
    import type { BracketExampleProps } from "./BracketPage.types";
    import BeamsExample from "./Examples/Beams.svelte";
    import FamilyExample from "./Examples/Family.svelte";
    import KnockoutExample from "./Examples/Knockout.svelte";
    import OrgChartExample from "./Examples/OrgChart.svelte";
    import SkillTreeExample from "./Examples/SkillTree.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/BracketPage/Examples";

    const CONNECTOR_RADIUS = 14;
    const CONNECTOR_WIDTH = 2;
    const ROUTE_CONNECTOR_WIDTH = 3;
    const WIDE_SPAN = 2;
    const NO_MOTION_DURATION_MS = 0;

    let layerGap = $state(BRACKET_DEFAULTS.layerGap);
    let crossGap = $state(BRACKET_DEFAULTS.crossGap);
    let orientation = $state<BracketOrientation>(BRACKET_DEFAULTS.orientation);
    let rootSide = $state<BracketRootSide>(BRACKET_DEFAULTS.rootSide);
    let connector = $state<BracketConnectors.SampleKey>(BracketConnectors.SAMPLE_KEYS[0]);
    let picked = $state(NOTHING_PICKED);
    let transitionDurationMs = $state(BRACKET_DEFAULTS.transitionDurationMs);
    let family = $state("");

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const commonProps: BracketExampleProps = $derived({
        layerGap,
        crossGap,
        orientation,
        rootSide,
        onActivate: (value, placement) => {
            picked = `${value}, node ${placement.id} in layer ${placement.layer}`;
        },
        renderConnector,
    });

    const examples: ExampleDefs[] = [
        {
            key: "knockout",
            name: "Knockout",
            span: WIDE_SPAN,
            readout: () =>
                `picked: ${picked} — a full draw with its rounds named, every node feeding exactly two, and one seed withdrawn so the walk steps past it; focus a seed and its road to the final lights up`,
            component: knockoutExample,
            path: `${EXAMPLES_ROOT}/Knockout.svelte`,
        },
        {
            key: "orgChart",
            name: "Org chart",
            span: WIDE_SPAN,
            readout: () =>
                "an uneven tree: three under one node, two under another, one that goes no further — a parent still lands between the outermost of the nodes it holds, whichever way round the board is turned",
            component: orgChartExample,
            path: `${EXAMPLES_ROOT}/OrgChart.svelte`,
        },
        {
            key: "skillTree",
            name: "Skill tree",
            readout: () =>
                "a chain of single children, which is what a bye looks like — each one level with the last, under headers that turn with the board",
            component: skillTreeExample,
            path: `${EXAMPLES_ROOT}/SkillTree.svelte`,
        },
        {
            key: "beams",
            name: "A beam along the road to the final",
            span: WIDE_SPAN,
            readout: () =>
                `picked: ${picked} — focus a seed or a match and a pulse runs along every line between it and the final, toward the final; it keeps running while the focus stays, so Pause is there to stop it`,
            component: beamsExample,
            path: `${EXAMPLES_ROOT}/Beams.svelte`,
        },
        {
            key: "family",
            name: "One family at a time",
            span: WIDE_SPAN,
            readout: () =>
                `showing: ${family} — focus a node and the board shows what it feeds, it with all its siblings, and what feeds them; walk on with the arrows and the rest folds away`,
            component: familyExample,
            path: `${EXAMPLES_ROOT}/Family.svelte`,
        },
    ];
</script>

{#snippet renderConnector(defs: BracketConnectorDefs)}
    <Markup
        markup={BracketConnectors.SAMPLE_CONNECTORS[connector]({
            defs,
            radius: CONNECTOR_RADIUS,
            width: defs.isOnFocusedRoute ? ROUTE_CONNECTOR_WIDTH : CONNECTOR_WIDTH,
            fromColor: defs.isOnFocusedRoute ? ROUTE_FROM_COLOR : CONNECTOR_FROM_COLOR,
            toColor: defs.isOnFocusedRoute ? ROUTE_TO_COLOR : CONNECTOR_TO_COLOR,
        })}
    />
{/snippet}

{#snippet knockoutExample()}
    <PageMeasureBox>
        <KnockoutExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

{#snippet orgChartExample()}
    <PageMeasureBox>
        <OrgChartExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

{#snippet skillTreeExample()}
    <PageMeasureBox>
        <SkillTreeExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

{#snippet beamsExample()}
    <PageMeasureBox>
        <BeamsExample {...commonProps} {connector} connectorRadius={CONNECTOR_RADIUS} />
    </PageMeasureBox>
{/snippet}

{#snippet familyExample()}
    <PageMeasureBox>
        <FamilyExample
            {...commonProps}
            transitionDurationMs={getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : transitionDurationMs}
            onFamilyChange={(next) => {
                family = next;
            }}
        />
    </PageMeasureBox>
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"connector"}
        label={"Connectors"}
        hint={"The line drawn between a match and the one it feeds: straight, elbowed, or curved."}
    >
        <PageSelectField
            value={connector}
            values={BracketConnectors.SAMPLE_KEYS}
            ariaLabel={"Connectors"}
            onChange={(next) => {
                connector = next;
            }}
        />
    </PageProp>

    <PageProp itemKey={"orientation"} label={"Orientation"} hint={"Whether the rounds run across the page or down it."}>
        <PageSelectField
            value={orientation}
            values={BRACKET_ORIENTATIONS}
            ariaLabel={"Orientation"}
            onChange={(next) => {
                orientation = next;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"rootSide"}
        label={"Root side"}
        hint={"Which end the final holds, and so which way the rounds read."}
    >
        <PageSelectField
            value={rootSide}
            values={BRACKET_ROOT_SIDES}
            ariaLabel={"Root side"}
            onChange={(side) => {
                rootSide = side;
            }}
        />
    </PageProp>

    <PageProp itemKey={"layerGap"} label={"Layer gap (px)"} hint={"The space between one round and the next."}>
        <PageNumberField
            value={layerGap}
            min={BracketKnobs.MIN_LAYER_GAP}
            max={BracketKnobs.MAX_LAYER_GAP}
            step={BracketKnobs.LAYER_GAP_STEP}
            ariaLabel={"Layer gap in pixels"}
            onInput={(value) => {
                layerGap = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"crossGap"} label={"Row gap (px)"} hint={"The space between two matches in the same round."}>
        <PageNumberField
            value={crossGap}
            min={BracketKnobs.MIN_CROSS_GAP}
            max={BracketKnobs.MAX_CROSS_GAP}
            step={BracketKnobs.CROSS_GAP_STEP}
            ariaLabel={"Row gap in pixels"}
            onInput={(value) => {
                crossGap = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"transitionDurationMs"}
        label={"Glide (ms)"}
        hint={
            "How long the family example takes to glide from one family to the next. It is off while the visitor has asked for reduced motion."
        }
    >
        <PageNumberField
            value={transitionDurationMs}
            min={BracketKnobs.MIN_TRANSITION_DURATION_MS}
            max={BracketKnobs.MAX_TRANSITION_DURATION_MS}
            step={BracketKnobs.TRANSITION_DURATION_STEP_MS}
            isDisabled={getPrefersReducedMotion()}
            ariaLabel={"Glide in milliseconds"}
            onInput={(value) => {
                transitionDurationMs = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />

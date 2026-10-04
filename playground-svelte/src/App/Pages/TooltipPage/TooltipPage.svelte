<script lang="ts">
    import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-svelte";
    import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
    import {
        TOOLTIP_REVEALS,
        TOOLTIP_REVEAL_LABELS,
        type TooltipReveal,
    } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import RichExample from "./Examples/Rich.svelte";
    import WordExample from "./Examples/Word.svelte";
    import type { TooltipExampleProps } from "./TooltipPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/TooltipPage/Examples";

    const FIELD_WIDTH = 110;

    let hPlacement = $state<AnchorHPlacement>(TooltipKnobs.STARTING_H_PLACEMENT);
    let vPlacement = $state<AnchorVPlacement>(TooltipKnobs.STARTING_V_PLACEMENT);
    let offsetX = $state(TooltipKnobs.STARTING_OFFSET_X);
    let offsetY = $state(TooltipKnobs.STARTING_OFFSET_Y);
    let transitionDurationMs = $state(TOOLTIP_DEFAULTS.transitionDurationMs);
    let focusShowDelayMs = $state(TOOLTIP_DEFAULTS.focusShowDelayMs);
    let hoverShowDelayMs = $state(TOOLTIP_DEFAULTS.hoverShowDelayMs);
    let skipDelayWindowMs = $state(TOOLTIP_DEFAULTS.skipDelayWindowMs);
    let reveal = $state<TooltipReveal>(TooltipKnobs.STARTING_REVEAL);

    const placement = $derived({ x: hPlacement, y: vPlacement });

    const offset = $derived({ x: offsetX, y: offsetY });

    const commonProps: TooltipExampleProps = $derived({
        placement,
        offset,
        transitionDurationMs,
        focusShowDelayMs,
        hoverShowDelayMs,
        skipDelayWindowMs,
        reveal,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "On a control of your own",
            readout: () =>
                "the button is a plain one, not the library's — the tooltip is handed its element and wires the hover, the focus and the Escape itself",
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "word",
            name: "On something that is not a control",
            readout: () =>
                "any element with a ref can carry one; this word was given a tab stop of its own, without which the tooltip would be reachable by pointer alone",
            component: wordExample,
            path: `${EXAMPLES_ROOT}/Word.svelte`,
        },
        {
            key: "rich",
            name: "More than a line",
            readout: () => "the content is whatever you render, and the anchoring is unchanged by how tall it is",
            component: richExample,
            path: `${EXAMPLES_ROOT}/Rich.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample {...commonProps} />
{/snippet}

{#snippet wordExample()}
    <WordExample {...commonProps} />
{/snippet}

{#snippet richExample()}
    <RichExample {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"reveal"}
        label={"Reveal"}
        hint={"How the tooltip appears and goes, which is the drawing's own: the tooltip only says whether it is showing and for how long the change takes."}
    >
        <PageSelectField
            value={reveal}
            values={TOOLTIP_REVEALS}
            computeLabel={(next) => TOOLTIP_REVEAL_LABELS[next]}
            width={FIELD_WIDTH}
            ariaLabel={"Reveal"}
            onChange={(next) => {
                reveal = next;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"hPlacement"}
        label={"Placement across"}
        hint={"Where the tooltip sits across its anchor: inside an edge, centered, or outside it altogether."}
    >
        <PageSelectField
            value={hPlacement}
            values={ANCHOR_H_PLACEMENTS}
            width={FIELD_WIDTH}
            ariaLabel={"Placement across"}
            onChange={(placement) => {
                hPlacement = placement;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"vPlacement"}
        label={"Placement down"}
        hint={"Where the tooltip sits above or below its anchor: inside an edge, centered, or outside it altogether."}
    >
        <PageSelectField
            value={vPlacement}
            values={ANCHOR_V_PLACEMENTS}
            width={FIELD_WIDTH}
            ariaLabel={"Placement down"}
            onChange={(placement) => {
                vPlacement = placement;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"offsetX"}
        label={"Offset across (px)"}
        hint={"How far the tooltip is nudged sideways from where the placement put it."}
    >
        <PageNumberField
            value={offsetX}
            min={TooltipKnobs.MIN_OFFSET}
            max={TooltipKnobs.MAX_OFFSET}
            step={TooltipKnobs.OFFSET_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Offset across"}
            onInput={(value) => {
                offsetX = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"offsetY"}
        label={"Offset down (px)"}
        hint={"How far the tooltip is nudged up or down from where the placement put it."}
    >
        <PageNumberField
            value={offsetY}
            min={TooltipKnobs.MIN_OFFSET}
            max={TooltipKnobs.MAX_OFFSET}
            step={TooltipKnobs.OFFSET_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Offset down"}
            onInput={(value) => {
                offsetY = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"transitionDurationMs"}
        label={"Reveal (ms)"}
        hint={"How long the tooltip takes to appear and to go."}
    >
        <PageNumberField
            value={transitionDurationMs}
            min={TooltipKnobs.MIN_DURATION}
            max={TooltipKnobs.MAX_DURATION}
            step={TooltipKnobs.DURATION_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Reveal in milliseconds"}
            onInput={(value) => {
                transitionDurationMs = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"focusShowDelayMs"}
        label={"Focus delay (ms)"}
        hint={"How long a keyboard focus has to rest on the anchor before the tooltip appears."}
    >
        <PageNumberField
            value={focusShowDelayMs}
            min={TooltipKnobs.MIN_DURATION}
            max={TooltipKnobs.MAX_DURATION}
            step={TooltipKnobs.DURATION_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Focus delay in milliseconds"}
            onInput={(value) => {
                focusShowDelayMs = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"hoverShowDelayMs"}
        label={"Hover delay (ms)"}
        hint={
            "How long the pointer has to rest on the anchor before the tooltip appears. Leave before then and nothing shows."
        }
    >
        <PageNumberField
            value={hoverShowDelayMs}
            min={TooltipKnobs.MIN_DURATION}
            max={TooltipKnobs.MAX_DURATION}
            step={TooltipKnobs.DURATION_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Hover delay in milliseconds"}
            onInput={(value) => {
                hoverShowDelayMs = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"skipDelayWindowMs"}
        label={"Skip window (ms)"}
        hint={
            "How soon after any tooltip closes a hover opens the next one at once. Wait for one tooltip here, then move to its neighbor."
        }
    >
        <PageNumberField
            value={skipDelayWindowMs}
            min={TooltipKnobs.MIN_DURATION}
            max={TooltipKnobs.MAX_DURATION}
            step={TooltipKnobs.DURATION_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Skip window in milliseconds"}
            onInput={(value) => {
                skipDelayWindowMs = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />

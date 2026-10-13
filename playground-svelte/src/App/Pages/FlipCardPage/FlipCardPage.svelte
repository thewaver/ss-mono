<script lang="ts">
    import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components-svelte";
    import { FLIP_CARD_AXES, FLIP_CARD_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { FlipCardKnobs } from "@thewaver/ss-playground/App/Knobs/FlipCards.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PressedExample from "./Examples/Pressed.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    FIELD_WIDTH,
    SELECT_WIDTH,
} from "@thewaver/ss-playground/App/Pages/FlipCardPage/FlipCardPage.const";

    const AXIS_LABELS: Record<FlipCardAxis, string> = {
        row: "About the upright axis",
        column: "About the horizontal axis",
    };

    let axis = $state<FlipCardAxis>(FLIP_CARD_DEFAULTS.axis);
    let transitionDurationMs = $state(FLIP_CARD_DEFAULTS.transitionDurationMs);

    let pressedFlipped = $state(false);

    let lastTurn = $state<FlipCardTurnDirection>();

    const examples: ExampleDefs[] = [
        {
            key: "pressed",
            name: EXAMPLE_NAMES.pressed,
            readout: () => {
                const side = pressedFlipped ? "back" : "front";

                if (!lastTurn)
                    return `${side} — press an edge to turn the card that way, or slide to lean it without turning`;

                return `${side} — the last turn went ${lastTurn}, and the next lean follows it`;
            },
            component: pressedExample,
            path: `${EXAMPLES_ROOT}/Pressed.svelte`,
        },
    ];
</script>

{#snippet pressedExample()}
    <PressedExample
        bind:flipped={pressedFlipped}
        {axis}
        {transitionDurationMs}
        onTurn={(direction) => {
            lastTurn = direction;
        }}
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"axis"} label={"Axis"} hint={"Which way the card turns over to show its other side."}>
        <PageSelectField
            value={axis}
            values={FLIP_CARD_AXES}
            computeLabel={(axis) => AXIS_LABELS[axis]}
            width={SELECT_WIDTH}
            ariaLabel={"Axis"}
            onChange={(value) => {
                axis = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"transitionDurationMs"}
        label={"Turn duration (ms)"}
        hint={"How long one turn from face to face takes."}
    >
        <PageNumberField
            value={transitionDurationMs}
            min={FlipCardKnobs.MIN_DURATION_MS}
            max={FlipCardKnobs.MAX_DURATION_MS}
            step={FlipCardKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Turn duration in milliseconds"}
            onInput={(value) => {
                transitionDurationMs = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />

<script lang="ts">
    import { CuboidKnobs } from "@thewaver/ss-playground/App/Knobs/Cuboids.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import type { CuboidExampleProps } from "./CuboidPage.types";
    import WanderingExample from "./Examples/Wandering.svelte";

    const FIELD_WIDTH = 110;

    type Props = CuboidExampleProps;

    let { yaw = $bindable(), pitch = $bindable(), ...props }: Props = $props();

    let turnIntervalMs = $state(CuboidKnobs.STARTING_TURN_INTERVAL_MS);
    let isTurning = $state(CuboidKnobs.STARTING_IS_TURNING);
</script>

<WanderingExample {...props} bind:yaw bind:pitch turnIntervalMs={isTurning ? turnIntervalMs : undefined} />

<PageExampleKnobs>
    <PageProp
        itemKey={"isTurning"}
        label={"Turns by itself"}
        hint={"Lets the box turn to a new face on its own, without anybody clicking it."}
    >
        <PageCheckField
            value={isTurning}
            ariaLabel={"Turns by itself"}
            onChange={(value) => {
                isTurning = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"turnIntervalMs"}
        label={"Turn every (ms)"}
        hint={
            "How long the box rests on a face before turning to the next one. It only applies while the box turns by itself."
        }
    >
        <PageNumberField
            value={turnIntervalMs}
            min={CuboidKnobs.MIN_TURN_INTERVAL_MS}
            max={CuboidKnobs.MAX_TURN_INTERVAL_MS}
            step={CuboidKnobs.TURN_INTERVAL_STEP_MS}
            width={FIELD_WIDTH}
            isDisabled={!isTurning}
            ariaLabel={"Turn interval in milliseconds"}
            onInput={(value) => {
                turnIntervalMs = value;
            }}
        />
    </PageProp>
</PageExampleKnobs>

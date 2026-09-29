<script lang="ts">
    import { FIELD_WIDTH, SPIN_STYLE_KEYS } from "@thewaver/ss-playground/App/Pages/Wheels/Wheels.const";

    import { WheelKnobs } from "../../Knobs/Wheels.const";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import type { WheelsControls } from "./Wheels.types";

    type Props = {
        controls: WheelsControls;
    };

    let props: Props = $props();

    const controls = $derived(props.controls);
</script>

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"wedgeCount"} label={"Wedges"} hint={"How many wedges the wheel is divided into."}>
        <PageNumberField
            value={controls.wedgeCount}
            min={WheelKnobs.MIN_WEDGE_COUNT}
            max={WheelKnobs.MAX_WEDGE_COUNT}
            step={WheelKnobs.WEDGE_COUNT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Wedges"}
            onInput={(value) => {
                controls.wedgeCount = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"spinDurationMs"}
        label={"Spin duration (ms)"}
        hint={"How long a spin takes from the moment it is started to the moment it stops."}
    >
        <PageNumberField
            value={controls.spinDuration}
            min={WheelKnobs.MIN_DURATION_MS}
            max={WheelKnobs.MAX_DURATION_MS}
            step={WheelKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Spin duration"}
            onInput={(value) => {
                controls.spinDuration = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"turns"}
        label={"Turns per spin"}
        hint={"How many full turns a spin makes before it comes to rest on its wedge."}
    >
        <PageNumberField
            value={controls.turns}
            min={WheelKnobs.MIN_TURNS}
            max={WheelKnobs.MAX_TURNS}
            step={WheelKnobs.TURNS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Turns per spin"}
            onInput={(value) => {
                controls.turns = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"settleDurationMs"}
        label={"Settle duration (ms)"}
        hint={"How long the wheel takes to ease into its final position once the spin is over."}
    >
        <PageNumberField
            value={controls.settleDuration}
            min={WheelKnobs.MIN_DURATION_MS}
            max={WheelKnobs.MAX_DURATION_MS}
            step={WheelKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Settle duration"}
            onInput={(value) => {
                controls.settleDuration = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"doesResume"}
        label={"Turns again after a spin"}
        hint={"Lets the wheel start turning by itself again after a spin, instead of standing still."}
    >
        <PageCheckField
            value={controls.doesResume}
            ariaLabel={"Turns again after a spin"}
            onChange={(value) => {
                controls.doesResume = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"restDurationMs"}
        label={"Rest after a spin (ms)"}
        hint={"How long the wheel stands still after a spin before it resumes. It only applies when it turns again."}
    >
        <PageNumberField
            value={controls.restDuration}
            min={WheelKnobs.MIN_DURATION_MS}
            max={WheelKnobs.MAX_DURATION_MS}
            step={WheelKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            isDisabled={!controls.doesResume}
            ariaLabel={"Rest after a spin"}
            onInput={(value) => {
                controls.restDuration = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isIdlingAllowed"}
        label={"Turns by itself"}
        hint={"Lets the wheel turn slowly on its own while nobody is spinning it."}
    >
        <PageCheckField
            value={controls.isIdlingAllowed}
            ariaLabel={"Turns by itself"}
            onChange={(value) => {
                controls.isIdlingAllowed = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"idleDelayMs"}
        label={"Idle step delay (ms)"}
        hint={"How long the wheel waits between steps of its idle turn. It only applies while idling is on."}
    >
        <PageNumberField
            value={controls.idleDelay}
            min={WheelKnobs.MIN_IDLE_DELAY_MS}
            max={WheelKnobs.MAX_IDLE_DELAY_MS}
            step={WheelKnobs.IDLE_DELAY_STEP_MS}
            width={FIELD_WIDTH}
            isDisabled={!controls.isIdlingAllowed}
            ariaLabel={"Idle step delay"}
            onInput={(value) => {
                controls.idleDelay = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"spinStyleKey"}
        label={"Spin style"}
        hint={"The speed curve a spin follows, which is what makes it feel heavy or snappy."}
    >
        <PageSelectField
            value={controls.spinStyle}
            values={SPIN_STYLE_KEYS}
            width={FIELD_WIDTH}
            ariaLabel={"Spin style"}
            onChange={(value) => {
                controls.spinStyle = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isDisabled"}
        label={"Disabled"}
        hint={"Turns the wheel off, so it can neither be spun nor turn by itself."}
    >
        <PageCheckField
            value={controls.isDisabled}
            ariaLabel={"Disabled"}
            onChange={(value) => {
                controls.isDisabled = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

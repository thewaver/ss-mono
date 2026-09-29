<script lang="ts">
    import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";

    let props: { value: number; setter: (value: number) => void } = $props();
</script>

<PageProp
    itemKey={"smoothness01"}
    label={"Smoothness (0-1)"}
    hint={"How much one line's movement overlaps its neighbors'. 0 makes each line wait its turn; 1 blurs them into one sweep."}
>
    <PageNumberField
        value={props.value}
        min={ScanlineAnimationKnobs.MIN_SMOOTHNESS}
        max={ScanlineAnimationKnobs.MAX_SMOOTHNESS}
        step={ScanlineAnimationKnobs.SMOOTHNESS_STEP}
        ariaLabel={"Smoothness"}
        onInput={props.setter}
    />
</PageProp>

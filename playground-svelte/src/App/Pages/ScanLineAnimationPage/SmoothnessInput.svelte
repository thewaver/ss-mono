<script lang="ts">
    import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";

    let props: { value: number; setter: (value: number) => void } = $props();
</script>

<PageProp
    itemKey={"smoothness01"}
    {...ScanlineAnimationKnobs.SMOOTHNESS01_TEXT}
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

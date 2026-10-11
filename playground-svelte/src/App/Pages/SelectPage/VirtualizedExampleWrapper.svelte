<script lang="ts">
    import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import VirtualizedExample from "./Examples/Virtualized.svelte";
    import type { SelectVirtualizedExampleProps } from "./SelectPage.types";

    const STRESS_COUNT_FIELD_WIDTH = 120;

    type Props = SelectVirtualizedExampleProps & {
        count: number;
        onCountChange: (count: number) => void;
    };

    let { value = $bindable(), visibility = $bindable(), ...props }: Props = $props();
</script>

<VirtualizedExample bind:value bind:visibility options={props.options} />

<PageExampleKnobs>
    <PageProp
        itemKey={"stressCount"}
        label={"Option count"}
        hint={"How many options the list holds. Only the ones on screen are rendered, so a very large number should still open instantly."}
    >
        <PageNumberField
            value={props.count}
            min={SelectKnobs.MIN_STRESS_COUNT}
            max={SelectKnobs.MAX_STRESS_COUNT}
            step={SelectKnobs.STRESS_COUNT_STEP}
            width={STRESS_COUNT_FIELD_WIDTH}
            ariaLabel={"Option count"}
            onInput={props.onCountChange}
        />
    </PageProp>
</PageExampleKnobs>

<script lang="ts">
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import ComplexExample from "./Examples/Complex.svelte";
    import type { TypewriterExampleWrapperProps } from "./TypewriterPage.types";

    let { width, ...props }: TypewriterExampleWrapperProps = $props();
</script>

<PageMeasureBox {width} padding={MEASURE_BOX_PADDING}>
    <ComplexExample {...props} />
</PageMeasureBox>

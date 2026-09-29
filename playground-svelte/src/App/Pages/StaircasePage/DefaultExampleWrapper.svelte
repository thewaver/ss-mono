<script lang="ts">
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import type { StaircaseExampleProps } from "./StaircasePage.types";

    const STAIRCASE_WIDTH = 340;

    let props: StaircaseExampleProps = $props();
</script>

<PageMeasureBox width={STAIRCASE_WIDTH}>
    <DefaultExample {...props} />
</PageMeasureBox>

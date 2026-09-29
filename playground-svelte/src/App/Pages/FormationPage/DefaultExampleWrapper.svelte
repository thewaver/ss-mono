<script lang="ts">
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import type { FormationExampleProps } from "./FormationPage.types";

    const FORMATION_WIDTH = 380;

    let props: FormationExampleProps = $props();
</script>

<PageMeasureBox width={FORMATION_WIDTH}>
    <DefaultExample {...props} />
</PageMeasureBox>

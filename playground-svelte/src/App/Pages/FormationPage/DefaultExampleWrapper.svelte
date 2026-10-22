<script lang="ts">
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import type { FormationExampleProps } from "./FormationPageSvelte.types";

    let props: FormationExampleProps = $props();
</script>

<PageMeasureBox width={props.width}>
    <DefaultExample {...props} />
</PageMeasureBox>

<script lang="ts">
    import type { ImageSwitcherProps } from "@thewaver/ss-components-svelte";

    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import DefaultExample from "./Examples/Default.svelte";

    const IMAGE_CONTAINER_SIZE = 480;

    let props: ImageSwitcherProps = $props();
</script>

<PageMeasureBox width={IMAGE_CONTAINER_SIZE} height={IMAGE_CONTAINER_SIZE}>
    <DefaultExample {...props} />
</PageMeasureBox>

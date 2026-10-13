<script lang="ts">
    import type { ImageSwitcherProps } from "@thewaver/ss-components-svelte";

    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import { IMAGE_CONTAINER_SIZE } from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.const";

    let props: ImageSwitcherProps = $props();
</script>

<PageMeasureBox width={IMAGE_CONTAINER_SIZE} height={IMAGE_CONTAINER_SIZE}>
    <DefaultExample {...props} />
</PageMeasureBox>

<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";

    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import type { CellAnimationSourcedExampleProps } from "./CellAnimationPage.types";
    import DefaultExample from "./Examples/Default.svelte";
    import { IMAGE_CONTAINER_SIZE } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.const";

    type Props = CellAnimationSourcedExampleProps & {
        progress: number;
        isPagePlaying: boolean;
        computeWidth: (longestSide: number) => number;
    };

    let {
        playback = $bindable(),
        progress = $bindable(),
        isPagePlaying,
        computeWidth,
        ...props
    }: Props = $props();
</script>

<div class={styles.stack}>
    <PageMeasureBox width={computeWidth(IMAGE_CONTAINER_SIZE)}>
        <DefaultExample
            {...props}
            bind:playback={
                () => isPagePlaying && playback,
                (next) => {
                    playback = next;
                }
            }
            bind:progress
        />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"cellAnimation"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

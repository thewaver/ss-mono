<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";

    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";

    const BOX_WIDTH = 320;
    const BOX_HEIGHT = 320;

    type Props = Omit<ParticleFieldExampleProps, "playback"> & {
        progress: number;
        ownPlayback: boolean;
    };

    let { progress = $bindable(), ownPlayback = $bindable(), ...props }: Props = $props();
</script>

<div class={styles.stack}>
    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
        <DefaultExample {...props} bind:playback={ownPlayback} bind:progress />
    </PageMeasureBox>

    <PagePlaybackScrubber
        id={"particleField"}
        ariaLabel={"Position in the pass"}
        bind:playback={ownPlayback}
        bind:progress
    />
</div>

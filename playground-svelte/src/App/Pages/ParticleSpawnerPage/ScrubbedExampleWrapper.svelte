<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";
    import {
        BOX_HEIGHT,
        BOX_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import type { PlaybackSlot } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.types";
    import type { ProgressSlot } from "./ParticleSpawnerPage.types";

    let {
        id,
        isPagePlaying,
        playback = $bindable(),
        renderExample,
    }: {
        id: string;
        isPagePlaying: boolean;
        playback: boolean;
        renderExample: Snippet<[PlaybackSlot, ProgressSlot, () => ProgressSlot]>;
    } = $props();

    let progress = $state(0);

    const followers: ProgressSlot[] = [];

    const examplePlayback: PlaybackSlot = {
        get value() {
            return isPagePlaying && playback;
        },
        set value(next: boolean) {
            playback = next;
        },
    };

    const exampleProgress: ProgressSlot = {
        get value() {
            return progress;
        },
        set value(next: number) {
            progress = next;
        },
    };

    const takeProgress = () => {
        let followerProgress = $state(progress);

        const follower: ProgressSlot = {
            get value() {
                return followerProgress;
            },
            set value(next: number) {
                followerProgress = next;
            },
        };

        followers.push(follower);

        return follower;
    };

    const scrub = (value: number) => {
        progress = value;

        for (const follower of followers) follower.value = value;
    };
</script>

<div class={styles.stack}>
    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
        {@render renderExample(examplePlayback, exampleProgress, takeProgress)}
    </PageMeasureBox>

    <PagePlaybackScrubber {id} ariaLabel={"Position in the round"} bind:playback bind:progress={() => progress, scrub} />
</div>

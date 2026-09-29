<script lang="ts">
    import { Button, Trail } from "@thewaver/ss-components-svelte";
    import type { TrailController } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageTrailTrack from "../../../StyledComponents/TrailContent/PageTrailTrack.svelte";
    import PageTrailVehicle from "../../../StyledComponents/TrailContent/PageTrailVehicle.svelte";
    import type { TrailExampleProps } from "../TrailPage.types";

    const CONVOY_SIZE = { width: 320, height: 150 };
    const CONVOY_PATH = "M 30 120 C 80 120, 90 30, 160 30 S 240 120, 290 120";
    const CONVOY_OFFSETS = [0, 0.12, 0.24, 0.36];
    const LEAD_LABEL = "▶";

    type Props = TrailExampleProps;

    let { progress = $bindable(), playback = $bindable(), ...props }: Props = $props();

    let controller = $state.raw<TrailController>();
</script>

<div class={styles.stack}>
    <PageMeasureBox>
        <Trail
            path={CONVOY_PATH}
            size={CONVOY_SIZE}
            durationMs={props.durationMs}
            isLooping={props.isLooping}
            isTurning={props.isTurning}
            followerOffsets={CONVOY_OFFSETS}
            bind:progress
            bind:playback
            onMount={(next) => {
                controller = next;
            }}
        >
            {#snippet renderTrack(path)}
                <PageTrailTrack {path} />
            {/snippet}

            {#snippet renderTraveler(place, index)}
                <PageTrailVehicle id={`convoyVehicle${index}`} {place} label={index === 0 ? LEAD_LABEL : `${index}`} />
            {/snippet}
        </Trail>
    </PageMeasureBox>

    <div class={styles.controls}>
        <Button
            id={"convoyPlay"}
            onClick={() => {
                playback = true;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Play</PageButtonContent>
            {/snippet}
        </Button>

        <Button
            id={"convoyPause"}
            onClick={() => {
                playback = false;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Pause</PageButtonContent>
            {/snippet}
        </Button>

        <Button
            id={"convoyRewind"}
            onClick={() => {
                controller?.seek(0);
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Back to start</PageButtonContent>
            {/snippet}
        </Button>
    </div>
</div>

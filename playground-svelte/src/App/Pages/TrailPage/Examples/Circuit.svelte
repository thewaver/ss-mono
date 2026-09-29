<script lang="ts">
    import { Button, Trail } from "@thewaver/ss-components-svelte";
    import type { TrailController } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageTrailTrack from "../../../StyledComponents/TrailContent/PageTrailTrack.svelte";
    import PageTrailVehicle from "../../../StyledComponents/TrailContent/PageTrailVehicle.svelte";
    import type { TrailExampleProps } from "../TrailPage.types";

    const CIRCUIT_SIZE = { width: 320, height: 130 };
    const CIRCUIT_PATH = "M 60 35 H 260 A 30 30 0 0 1 260 95 H 60 A 30 30 0 0 1 60 35 Z";
    const VEHICLE_LABEL = "▶";
    const VEHICLE_ID = "circuitVehicle";

    type Props = TrailExampleProps;

    let { progress = $bindable(), playback = $bindable(), ...props }: Props = $props();

    let controller = $state.raw<TrailController>();
</script>

<div class={styles.stack}>
    <PageMeasureBox>
        <Trail
            path={CIRCUIT_PATH}
            size={CIRCUIT_SIZE}
            durationMs={props.durationMs}
            isLooping={props.isLooping}
            isTurning={props.isTurning}
            bind:progress
            bind:playback
            onMount={(next) => {
                controller = next;
            }}
        >
            {#snippet renderTrack(path)}
                <PageTrailTrack {path} />
            {/snippet}

            {#snippet renderTraveler(place)}
                <PageTrailVehicle id={VEHICLE_ID} {place} label={VEHICLE_LABEL} />
            {/snippet}
        </Trail>
    </PageMeasureBox>

    <div class={styles.controls}>
        <Button
            id={"circuitPlay"}
            onClick={() => {
                playback = true;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Play</PageButtonContent>
            {/snippet}
        </Button>

        <Button
            id={"circuitPause"}
            onClick={() => {
                playback = false;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Pause</PageButtonContent>
            {/snippet}
        </Button>

        <Button
            id={"circuitRewind"}
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

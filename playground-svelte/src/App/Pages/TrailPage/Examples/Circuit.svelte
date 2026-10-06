<script lang="ts">
    import { Button, Trail } from "@thewaver/ss-components-svelte";
    import type { TrailController } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
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
            id={"circuitPlayback"}
            ariaLabel={playback ? "Pause" : "Play"}
            onClick={() => {
                playback = !playback;
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={playback ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play} />
            {/snippet}
        </Button>

        <Button
            id={"circuitRewind"}
            ariaLabel={"Back to start"}
            onClick={() => {
                controller?.seek(0);
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.toStart} />
            {/snippet}
        </Button>
    </div>
</div>

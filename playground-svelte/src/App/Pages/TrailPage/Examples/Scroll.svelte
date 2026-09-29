<script lang="ts">
    import { ElementObserverSvelteUtils, Trail } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageTrailMarker from "../../../StyledComponents/TrailContent/PageTrailMarker.svelte";
    import PageTrailTrack from "../../../StyledComponents/TrailContent/PageTrailTrack.svelte";
    import type { TrailScrollExampleProps } from "../TrailPage.types";

    const SCROLL_SIZE = { width: 320, height: styles.SCROLL_BOX_HEIGHT };
    const SCROLL_PATH = "M 24 70 C 70 10, 110 10, 160 70 S 250 130, 296 70";
    const MARKER_ID = "scrollMarker";

    type Props = TrailScrollExampleProps;

    let props: Props = $props();

    let boxRef = $state<HTMLDivElement>();
    let runwayRef = $state<HTMLDivElement>();

    const getProgress = ElementObserverSvelteUtils.createScrollContainerProgressObserver(
        () => runwayRef,
        () => boxRef,
        () => !props.isFollowing,
    );

    $effect(() => {
        props.onProgressChange(getProgress());
    });
</script>

<div bind:this={boxRef} id={"trailScrollBox"} class={styles.scrollBox}>
    <div class={styles.scrollPinned}>
        <PageMeasureBox>
            <Trail
                path={SCROLL_PATH}
                size={SCROLL_SIZE}
                durationMs={props.durationMs}
                isLooping={props.isLooping}
                isTurning={props.isTurning}
                progress={getProgress()}
                playback={false}
            >
                {#snippet renderTrack(path)}
                    <PageTrailTrack {path} />
                {/snippet}

                {#snippet renderTraveler()}
                    <PageTrailMarker id={MARKER_ID} />
                {/snippet}
            </Trail>
        </PageMeasureBox>
    </div>

    <div bind:this={runwayRef} class={styles.scrollRunway}></div>
</div>

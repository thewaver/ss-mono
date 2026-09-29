<script lang="ts">
    import { onMount } from "svelte";

    import { Button, Progress, Sidebar } from "@thewaver/ss-components-svelte";
    import {
        BUILD_PROGRESS_DISMISS_LABEL,
        BUILD_PROGRESS_HEIGHT,
        BUILD_PROGRESS_LABEL,
    } from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.const";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.css";
    import type { BuildProgress } from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.types";
    import {
        computeBuildProgressCount,
        computeBuildProgressText,
        getIsBuilding,
        observeBuildProgress,
    } from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.utils";

    import PageSelectClear from "../../StyledComponents/SelectClear/SelectClear.svelte";
    import PageLayer from "../Layer/Layer.svelte";

    const PERCENT = 100;

    let progress = $state<BuildProgress>();
    let dismissedGeneration = $state<number>();

    const isShown = $derived(getIsBuilding(progress) && progress?.generation !== dismissedGeneration);

    onMount(() => observeBuildProgress((next) => (progress = next)));
</script>

<Sidebar edge={"top"} collapsedSize={0} expandedSize={BUILD_PROGRESS_HEIGHT} expanded={isShown}>
    {#snippet renderContent(phase)}
        <PageLayer level={1}>
            <div class={styles.buildProgressClip}>
                <div class={[styles.buildProgressStrip, phase === "collapsed" && styles.isHidden]}>
                    <Progress
                        ariaLabel={BUILD_PROGRESS_LABEL}
                        ariaValueText={computeBuildProgressCount(progress)}
                        value={progress?.total === undefined ? undefined : progress.built}
                        max={progress?.total}
                        sizing={"fill"}
                    >
                        {#snippet renderContent(state)}
                            <div class={styles.buildProgressBar}>
                                <div
                                    class={styles.buildProgressFill}
                                    style:width={`${(state.ratio ?? 0) * PERCENT}%`}
                                ></div>

                                <span class={styles.buildProgressText} aria-hidden="true">
                                    {computeBuildProgressText(progress)}
                                </span>
                            </div>
                        {/snippet}
                    </Progress>

                    <div class={styles.buildProgressDismiss}>
                        <Button
                            ariaLabel={BUILD_PROGRESS_DISMISS_LABEL}
                            onClick={() => {
                                dismissedGeneration = progress?.generation;
                            }}
                        >
                            {#snippet renderContent(flags)}
                                <PageSelectClear {flags} />
                            {/snippet}
                        </Button>
                    </div>
                </div>
            </div>
        </PageLayer>
    {/snippet}
</Sidebar>

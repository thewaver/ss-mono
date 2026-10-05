<script lang="ts">
    import { Button, Die } from "@thewaver/ss-components-svelte";
    import type { DieController } from "@thewaver/ss-components-svelte";
    import {
        ICON_CLOUD_EMPTY_LABEL,
        ICON_CLOUD_ICONS,
        ICON_CLOUD_STEPS,
    } from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageDieIcon from "../../../StyledComponents/DieContent/PageDieIcon.svelte";
    import type { IconCloudExampleProps } from "../DiePage.types";

    type Props = IconCloudExampleProps;

    let { face = $bindable(), autoSpin = $bindable(), ...props }: Props = $props();

    let controller = $state.raw<DieController>();
</script>

<div class={styles.stage}>
    <Die
        shape={props.shape}
        size={props.size}
        idleDelayMs={props.idleDelayMs}
        settleDurationMs={props.settleDurationMs}
        momentumMs={props.momentumMs}
        bind:face
        bind:autoSpin
        isMovable={true}
        isSeeThrough={true}
        ariaLabel={"A cloud of icons"}
        computeFaceLabel={(index) => ICON_CLOUD_ICONS[index]?.label ?? ICON_CLOUD_EMPTY_LABEL}
        onMount={(next) => {
            controller = next;
        }}
    >
        {#snippet renderFace(index, state)}
            <PageDieIcon {state} icon={ICON_CLOUD_ICONS[index]?.icon ?? ""} />
        {/snippet}
    </Die>

    <div class={styles.controls}>
        <Button
            id={"dieCloudPlayback"}
            onClick={() => {
                autoSpin = !autoSpin;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>{autoSpin ? "Pause" : "Play"}</PageButtonContent>
            {/snippet}
        </Button>

        {#each ICON_CLOUD_STEPS as step (step.direction)}
            <Button
                id={step.id}
                onClick={() => {
                    controller?.step(step.direction);
                }}
            >
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>{step.label}</PageButtonContent>
                {/snippet}
            </Button>
        {/each}
    </div>
</div>

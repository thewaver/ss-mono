<script lang="ts">
    import { Button, FrameRateMonitorSvelteUtils, Modal } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/StressTest/StressTest.css";
    import { CSSUtils } from "@thewaver/ss-utils";

    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageModalOverlay from "../../StyledComponents/ModalOverlay/ModalOverlay.svelte";
    import PageModalPanel from "../../StyledComponents/ModalPanel/PageModalPanel.svelte";
    import PagePropsPanel from "../PropsPanel/PagePropsPanel.svelte";
    import type { StressTestProps } from "./StressText.types";

    let props: StressTestProps = $props();

    let isModalOpen = $state(false);
    let isModalTransitionFinished = $state(false);
    let configIndex = $state(0);

    const arr = $derived(Array.from({ length: props.configs[configIndex].count }, (_, idx) => idx));

    const isMonitoringDisabled = $derived(!(isModalOpen && isModalTransitionFinished));

    const { getFrameRate } = FrameRateMonitorSvelteUtils.create(() => isMonitoringDisabled);

    const frameRate = $derived(getFrameRate());
</script>

<PagePropsPanel scope={"local"}>
    {#each props.configs as _, index (index)}
        <Button
            sizing={"fill"}
            onClick={async () => {
                configIndex = index;
                isModalOpen = true;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>{@render props.renderLabel(index)}</PageButtonContent>
            {/snippet}
        </Button>
    {/each}
</PagePropsPanel>

<Modal
    margins={CSSUtils.spreadMargin(40)}
    bind:visibility={isModalOpen}
    ariaLabel={"Stress test"}
    onShow={props.onShowModal}
    onHide={props.onHideModal}
    onTransitionStatusChange={(isFinished) => (isModalTransitionFinished = isFinished)}
>
    {#snippet renderOverlay(visibilityTarget, transitionDurationMs)}
        <PageModalOverlay {visibilityTarget} {transitionDurationMs} />
    {/snippet}

    {#snippet renderContent(visibilityTarget, transitionDurationMs)}
        <PageModalPanel {visibilityTarget} {transitionDurationMs}>
            <div
                class={[
                    styles.fpsCounter,
                    styles.fpsCounterVariants[
                        frameRate.average >= 59.5 ? "good" : frameRate.average >= 29.5 ? "mid" : "bad"
                    ],
                ]}
            >
                {`FPS: ${frameRate.current.toFixed(1)}\nAVG: ${frameRate.average.toFixed(1)}`}
            </div>
            <div
                class={styles.itemGrid}
                style:grid-template-columns={`repeat(${props.configs[configIndex].cols}, auto)`}
                style:gap={`${props.configs[configIndex].gap}px`}
            >
                {#each arr as index (index)}
                    {@render props.renderItem(configIndex, index)}
                {/each}
            </div>
        </PageModalPanel>
    {/snippet}
</Modal>

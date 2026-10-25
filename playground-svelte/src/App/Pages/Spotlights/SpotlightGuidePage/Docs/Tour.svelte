<script lang="ts">
    import { Button, SpotlightGuide, SpotlightPrompt } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import {
        RICH_TOUR_STEPS,
        TOUR_STORAGE_KEY,
    } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
    import { PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { getLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
    import PageSpotlightPopup from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopup.svelte";
    import PageSpotlightPopupActions from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupActions.svelte";
    import PageSpotlightPopupText from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupText.svelte";
    import { renderHighlight, renderOverlay } from "../../Spotlights.const.svelte";

    const readStoredStep = () => {
        try {
            const stored = sessionStorage.getItem(TOUR_STORAGE_KEY);
            const step = stored === null ? Number.NaN : Number(stored);

            return Number.isInteger(step) && step >= 0 && step < RICH_TOUR_STEPS.length ? step : undefined;
        } catch {
            return undefined;
        }
    };

    const writeStoredStep = (step: number | undefined) => {
        try {
            if (step === undefined) sessionStorage.removeItem(TOUR_STORAGE_KEY);
            else sessionStorage.setItem(TOUR_STORAGE_KEY, `${step}`);
        } catch {
            return;
        }
    };

    const layerClass = $derived.by(getLayerClass());

    let guide = $state(false);
    let prompt = $state(false);

    let step = $state(0);
    const storedStep = readStoredStep();

    let resumeStep = $state(storedStep);
    let status = $state(storedStep === undefined ? "not started" : "paused");
    let basketCount = $state(0);

    let shelfRef = $state<HTMLElement>();
    let addRef = $state<HTMLElement>();
    let basketRef = $state<HTMLElement>();
    let checkoutRef = $state<HTMLElement>();

    const targets = $derived([shelfRef, addRef, basketRef, checkoutRef]);

    const current = $derived(RICH_TOUR_STEPS[step]);

    const isFirstStep = $derived(step === 0);

    const isLastStep = $derived(step >= RICH_TOUR_STEPS.length - 1);

    const changeStep = (next: number) => {
        step = next;
        resumeStep = next;
        writeStoredStep(next);
    };

    const start = () => {
        changeStep(resumeStep ?? 0);
        status = "running";
        guide = true;
    };

    const end = (next: string) => {
        status = next;
        guide = false;
        prompt = false;
        resumeStep = undefined;
        writeStoredStep(undefined);
    };

    const pause = () => {
        if (status === "running") status = "paused";
    };

    const handOverToReader = () => {
        prompt = true;
    };

    const next = () => {
        if (isLastStep) {
            end("finished");

            return;
        }

        changeStep(step + 1);
    };
</script>

<div class={[styles.root, layerClass]}>
    <div class={styles.tourRow}>
        <div bind:this={shelfRef} class={styles.tourTarget}>Potatoes</div>

        <Button
            id={"tourAdd"}
            bind:ref={addRef}
            onClick={() => {
                basketCount += 1;

                if (!prompt) return;

                prompt = false;
                changeStep(step + 1);
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Add to basket</PageButtonContent>
            {/snippet}
        </Button>

        <div bind:this={basketRef} class={styles.tourTarget}>
            {`Basket: ${basketCount}`}
        </div>

        <Button id={"tourCheckout"} bind:ref={checkoutRef}>
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Checkout</PageButtonContent>
            {/snippet}
        </Button>
    </div>

    <Button id={"tourStart"} onClick={start}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>
                {resumeStep === undefined ? "Start the shop tour" : `Resume the shop tour at step ${resumeStep + 1}`}
            </PageButtonContent>
        {/snippet}
    </Button>

    <SpotlightGuide
        elementRef={targets[step] ?? undefined}
        padding={PADDING}
        ariaLabel={"Shop tour"}
        announcement={`Step ${step + 1} of ${RICH_TOUR_STEPS.length}. ${current.title}.`}
        bind:visibility={guide}
        {renderHighlight}
        {renderOverlay}
        onHide={pause}
    >
        {#snippet renderPopup(visibilityTarget, transitionDurationMs)}
            <PageSpotlightPopup {visibilityTarget} {transitionDurationMs} title={current.title}>
                <PageSpotlightPopupText>{current.text}</PageSpotlightPopupText>

                <PageSpotlightPopupText>{`Step ${step + 1} of ${RICH_TOUR_STEPS.length}`}</PageSpotlightPopupText>

                <PageSpotlightPopupActions>
                    <Button id={"tourSkip"} onClick={() => end("skipped")}>
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>Skip</PageButtonContent>
                        {/snippet}
                    </Button>

                    <Button id={"tourBack"} isDisabled={isFirstStep} onClick={() => changeStep(step - 1)}>
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>Back</PageButtonContent>
                        {/snippet}
                    </Button>

                    <Button
                        id={"tourForward"}
                        onClick={() => (current.isWaitingForUser ? handOverToReader() : next())}
                    >
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>
                                {current.isWaitingForUser ? "Try" : isLastStep ? "Done" : "Next"}
                            </PageButtonContent>
                        {/snippet}
                    </Button>
                </PageSpotlightPopupActions>
            </PageSpotlightPopup>
        {/snippet}
    </SpotlightGuide>

    <SpotlightPrompt
        elementRef={addRef}
        padding={PADDING}
        bind:visibility={prompt}
        {renderHighlight}
        {renderOverlay}
    />

    <div class={exampleStyles.exampleReadout} data-readout>
        {`Step: ${step + 1} of ${RICH_TOUR_STEPS.length}, ${status}`}
    </div>
</div>

<script lang="ts">
    import { Button, SpotlightGuide, SpotlightPrompt } from "@thewaver/ss-components-svelte";
    import { RICH_TOUR_STEPS } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
    import { PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

    import PageControlRow from "../../../../PageComponents/ControlRow/PageControlRow.svelte";
    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { getLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
    import PageSpotlightPopup from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopup.svelte";
    import PageSpotlightPopupActions from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupActions.svelte";
    import PageSpotlightPopupText from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupText.svelte";
    import { renderHighlight, renderOverlay } from "../../Spotlights.const.svelte";
    import type { SpotlightTourExampleProps } from "../SpotlightGuidePage.types";

    type Props = SpotlightTourExampleProps;

    let { guide = $bindable(), prompt = $bindable(), ...props }: Props = $props();

    const layerClass = $derived.by(getLayerClass());

    let shelfRef = $state<HTMLElement>();
    let addRef = $state<HTMLElement>();
    let basketRef = $state<HTMLElement>();
    let checkoutRef = $state<HTMLElement>();

    const targets = $derived([shelfRef, addRef, basketRef, checkoutRef]);

    const step = $derived(props.step);

    const current = $derived(RICH_TOUR_STEPS[step]);

    const isFirstStep = $derived(step === 0);

    const isLastStep = $derived(step >= RICH_TOUR_STEPS.length - 1);

    const handOverToUser = () => {
        guide = false;
        prompt = true;
    };

    const next = () => {
        if (isLastStep) {
            props.onEnd("finished");

            return;
        }

        props.onStepChange(step + 1);
    };
</script>

<div class={[styles.root, layerClass]}>
    <PageControlRow>
        <div bind:this={shelfRef} class={styles.tourTarget}>Potatoes</div>

        <Button
            id={"tourAdd"}
            bind:ref={addRef}
            onClick={() => {
                props.onAdd();

                if (!prompt) return;

                prompt = false;
                props.onStepChange(step + 1);
                guide = true;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Add to basket</PageButtonContent>
            {/snippet}
        </Button>

        <div bind:this={basketRef} class={styles.tourTarget}>
            {`Basket: ${props.basketCount}`}
        </div>

        <Button id={"tourCheckout"} bind:ref={checkoutRef}>
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Checkout</PageButtonContent>
            {/snippet}
        </Button>
    </PageControlRow>

    <Button
        id={"tourStart"}
        onClick={() => {
            props.onStart();
            guide = true;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>
                {props.resumeStep === undefined
                    ? "Start the shop tour"
                    : `Resume the shop tour at step ${props.resumeStep + 1}`}
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
    >
        {#snippet renderPopup(visibilityTarget, transitionDurationMs)}
            <PageSpotlightPopup {visibilityTarget} {transitionDurationMs} title={current.title}>
                <PageSpotlightPopupText>{current.text}</PageSpotlightPopupText>

                <PageSpotlightPopupText>{`Step ${step + 1} of ${RICH_TOUR_STEPS.length}`}</PageSpotlightPopupText>

                <PageSpotlightPopupActions>
                    <Button onClick={() => props.onEnd("skipped")}>
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>Skip</PageButtonContent>
                        {/snippet}
                    </Button>

                    <Button isDisabled={isFirstStep} onClick={() => props.onStepChange(step - 1)}>
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>Back</PageButtonContent>
                        {/snippet}
                    </Button>

                    <Button onClick={() => (current.isWaitingForUser ? handOverToUser() : next())}>
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

    <SpotlightPrompt elementRef={addRef} padding={PADDING} bind:visibility={prompt} {renderHighlight} {renderOverlay} />
</div>

<script lang="ts">
    import { Button, DrumWheel } from "@thewaver/ss-components-svelte";
    import type { WheelController } from "@thewaver/ss-components-svelte";
    import { pickPrizeIndex } from "@thewaver/ss-playground/App/Pages/Wheels/Wheels.const";
    import type { Size2d } from "@thewaver/ss-utils";

    import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageWheelBar from "../../../../StyledComponents/WheelContent/PageWheelBar.svelte";
    import PageWheelCard from "../../../../StyledComponents/WheelContent/PageWheelCard.svelte";
    import PageWheelMount from "../../../../StyledComponents/WheelContent/PageWheelMount.svelte";
    import PageWheelPip from "../../../../StyledComponents/WheelContent/PageWheelPip.svelte";
    import type { WheelExampleProps } from "../../Wheels.types";

    const WEDGE_SIZE: Size2d = { width: 160, height: 64 };

    type Props = WheelExampleProps;

    let { wedges, targetIndex = $bindable(), ...otherProps }: Props = $props();

    let controller = $state.raw<WheelController>();

    const isSpinnable = $derived(controller?.getIsSpinnable() ?? false);
</script>

<PageMeasureBox>
    <PageWheelMount>
        <DrumWheel
            {...otherProps}
            bind:targetIndex
            {wedges}
            axis={"column"}
            wedgeSize={WEDGE_SIZE}
            ariaLabel={"Prize drum, turning over"}
            computeSpinTarget={() => pickPrizeIndex(wedges.length)}
            computeWedgeLabel={(index) => `${wedges[index]}, ${index + 1} of ${wedges.length}`}
            onMount={(next) => {
                controller = next;
            }}
        >
            {#snippet renderWedge(wedge, state)}
                <PageWheelCard {state}>{wedge}</PageWheelCard>
            {/snippet}

            {#snippet renderWedgeBack(_wedge, state)}
                <PageWheelCard {state} />
            {/snippet}
        </DrumWheel>

        <PageWheelPip side={"left"} />
    </PageWheelMount>
</PageMeasureBox>

<PageWheelBar>
    <Button
        id={"reelSpin"}
        ariaLabel={"Spin the wheel"}
        isDisabled={!isSpinnable}
        onClick={() => {
            controller?.spin();
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags}>Spin</PageControlButtonContent>
        {/snippet}
    </Button>
</PageWheelBar>

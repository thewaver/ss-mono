<script lang="ts">
    import { Button, OverheadWheel, ProximityEffectUtils } from "@thewaver/ss-components-svelte";
    import type { WheelController } from "@thewaver/ss-components-svelte";
    import { PRIZE_WHEEL_RING, pickPrizeIndex } from "@thewaver/ss-playground/App/Pages/Wheels/Wheels.const";

    import PageWheelCenter from "../../../../StyledComponents/WheelContent/PageWheelCenter.svelte";
    import PageWheelPip from "../../../../StyledComponents/WheelContent/PageWheelPip.svelte";
    import PageWheelSpin from "../../../../StyledComponents/WheelContent/PageWheelSpin.svelte";
    import PageWheelStack from "../../../../StyledComponents/WheelContent/PageWheelStack.svelte";
    import PageWheelWedge from "../../../../StyledComponents/WheelContent/PageWheelWedge.svelte";
    import type { WheelExampleProps } from "../../Wheels.types";

    type Props = WheelExampleProps;

    let { wedges, targetIndex = $bindable(), ...otherProps }: Props = $props();

    let controller = $state.raw<WheelController>();

    const isSpinnable = $derived(controller?.getIsSpinnable() ?? false);

    const phase = $derived(controller?.getPhase());
</script>

<PageWheelStack>
    <OverheadWheel
        {...otherProps}
        bind:targetIndex
        {wedges}
        ariaLabel={"Prize wheel"}
        computeLayout={PRIZE_WHEEL_RING}
        computeEffect={ProximityEffectUtils.glow}
        computeSpinTarget={() => pickPrizeIndex(wedges.length)}
        computeWedgeLabel={(index) => `${wedges[index]}, ${index + 1} of ${wedges.length}`}
        onMount={(next) => {
            controller = next;
        }}
    >
        {#snippet renderWedge(wedge, state)}
            <PageWheelWedge {state}>{wedge}</PageWheelWedge>
        {/snippet}
    </OverheadWheel>

    <PageWheelPip side={"top"} />

    <PageWheelCenter>
        <Button
            id={"overheadSpin"}
            ariaLabel={"Spin the wheel"}
            isDisabled={!isSpinnable}
            onClick={() => {
                controller?.spin();
            }}
        >
            {#snippet renderContent(flags)}
                <PageWheelSpin {flags} {phase} />
            {/snippet}
        </Button>
    </PageWheelCenter>
</PageWheelStack>

<script lang="ts">
    import { ElementObserverSvelteUtils, ProximityText } from "@thewaver/ss-components-svelte";
    import type { PointSource } from "@thewaver/ss-components-svelte";
    import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

    import type { ProximityTextExampleProps } from "../ProximityTextPageSvelte.types";
    import { TEXT } from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.const";

    const MIDDLE = 0.5;
    const NO_HEIGHT = 0;

    type Props = Pick<ProximityTextExampleProps, "isDisabled">;

    let props: Props = $props();

    let boxRef = $state<HTMLElement>();
    let textRef = $state<HTMLElement>();

    const getTravel = ElementObserverSvelteUtils.createScrollContainerProgressObserver(
        () => textRef,
        () => boxRef,
    );

    const pointSource: PointSource = $derived.by(() => {
        void getTravel();

        if (!boxRef || !textRef || textRef.offsetHeight <= NO_HEIGHT) return { ratio: undefined };

        const middle = boxRef.scrollTop + boxRef.clientHeight * MIDDLE - textRef.offsetTop;

        return { ratio: { x: MIDDLE, y: middle / textRef.offsetHeight } };
    });
</script>

<div bind:this={boxRef} id={"barrelScrollBox"} class={styles.barrelBox}>
    <div bind:this={textRef} class={styles.barrelText}>
        <ProximityText
            computeAnimationName={() => styles.barrelSpacing}
            reachPx={ProximityTextKnobs.BARREL_REACH_PX}
            distanceAxis={"vertical"}
            isDisabled={props.isDisabled}
            {pointSource}
        >
            {TEXT}
        </ProximityText>
    </div>
</div>

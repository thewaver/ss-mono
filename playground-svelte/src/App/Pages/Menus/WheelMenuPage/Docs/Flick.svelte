<script lang="ts">
    import { WheelMenu } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import {
        BAND_WIDTH,
        HOLE_RADIUS,
        LAYOUT_SIZE,
        LEVEL_GAP,
        NOTHING_RUN,
    } from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import {
        ACTIONS,
        CLOSER_DEFS,
        renderWheelGradientDefs,
        renderWheelItem,
        renderWheelPopup,
    } from "../WheelMenuPage.const.svelte";
    import type { WheelMenuFlickDocsExampleProps } from "../WheelMenuPageSvelte.types";

    type Props = WheelMenuFlickDocsExampleProps;

    let props: Props = $props();

    const gradientId = $props.id();

    let lastRun = $state(NOTHING_RUN);
</script>

<div class={styles.stage}>
    {@render renderWheelGradientDefs(gradientId)}

    <WheelMenu
        layoutSize={LAYOUT_SIZE}
        items={ACTIONS}
        ariaLabel={"Edit actions"}
        holeRadius={HOLE_RADIUS}
        bandWidth={BAND_WIDTH}
        opensOnHold={props.opensOnHold}
        levelGap={LEVEL_GAP}
        placement={{ x: "center", y: "center" }}
        closerDefs={CLOSER_DEFS}
        renderPopup={renderWheelPopup}
        onActivate={(action) => {
            lastRun = action.name;
        }}
    >
        {#snippet renderContent(flags)}
            <PageMenuTriggerContent {flags}>Hold</PageMenuTriggerContent>
        {/snippet}

        {#snippet renderItem(item, flags, placement)}
            {@render renderWheelItem(gradientId, item, flags, placement)}
        {/snippet}
    </WheelMenu>
</div>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>

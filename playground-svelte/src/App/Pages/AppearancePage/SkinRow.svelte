<script lang="ts">
    import { Radio } from "@thewaver/ss-components-svelte";
    import { PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";
    import { computeSkinRowId } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.css";

    import PageRadioContent from "../../StyledComponents/RadioContent/RadioContent.svelte";
    import SkinSamples from "./SkinSamples.svelte";
    import type { SkinRowProps } from "./AppearancePage.types";

    let props: SkinRowProps = $props();
</script>

<Radio value={props.skin} ariaLabel={props.label} sizing={"fill"}>
    {#snippet renderContent(flags)}
        <div id={computeSkinRowId(props.skin)} class={styles.skinRow}>
            <div class={styles.skinSampleBoundary}>
                <div class={PLAYGROUND_SKINS[props.skin]}>
                    <div class={styles.skinSamples}>
                        <PageRadioContent {flags}>{props.label}</PageRadioContent>

                        <div class={styles.skinColumns} inert aria-hidden="true">
                            <SkinSamples skin={props.skin} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/snippet}
</Radio>

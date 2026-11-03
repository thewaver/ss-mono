<script lang="ts">
    import { Radio } from "@thewaver/ss-components-svelte";
    import { PLAYGROUND_LOOKS } from "@thewaver/ss-playground/App/Looks/Look.const";
    import { computeLookRowId } from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.css";

    import PageRadioContent from "../../StyledComponents/RadioContent/RadioContent.svelte";
    import LookSamples from "./LookSamples.svelte";
    import type { LookRowProps } from "./LooksPage.types";

    let props: LookRowProps = $props();
</script>

<Radio value={props.look} ariaLabel={props.label} sizing={"fill"}>
    {#snippet renderContent(flags)}
        <div id={computeLookRowId(props.look)} class={styles.lookRow}>
            <div class={styles.lookSampleBoundary}>
                <div class={PLAYGROUND_LOOKS[props.look]}>
                    <div class={styles.lookSamples}>
                        <PageRadioContent {flags}>{props.label}</PageRadioContent>

                        <div class={styles.lookColumns} inert aria-hidden="true">
                            <LookSamples look={props.look} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/snippet}
</Radio>

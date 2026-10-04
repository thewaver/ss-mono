<script lang="ts">
    import { PaintedText, ProximityText } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

    import type { ProximityTextExampleProps } from "../ProximityTextPageSvelte.types";

    type Props = ProximityTextExampleProps;

    let props: Props = $props();
</script>

<div class={styles.variableText}>
    <ProximityText reachPx={props.reachPx} isDisabled={props.isDisabled}>
        <PaintedText computeFillDefs={() => [{ color: "currentColor" }]}
            >Painted letters push their neighbors along</PaintedText
        >
    </ProximityText>
</div>

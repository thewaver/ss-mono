<script lang="ts">
    import { ProximityText } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

    import type { ProximityTextExampleProps } from "../ProximityTextPageSvelte.types";

    const TEXT =
        "Move the pointer over these words and watch each letter thicken as it comes near, pushing the rest of its line along without ever moving a line break.";

    type Props = ProximityTextExampleProps;

    let props: Props = $props();
</script>

<div class={styles.variableText}>
    <ProximityText reachPx={props.reachPx} isDisabled={props.isDisabled}>
        {TEXT}
    </ProximityText>
</div>

<script lang="ts">
    import { FittedText } from "@thewaver/ss-components-svelte";
    import { POSTER_LINES } from "@thewaver/ss-playground/App/Pages/FittedTextPage/FittedTextPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/FittedTextPage/FittedTextPage.css";

    import type { FittedTextExampleProps } from "../FittedTextPage.types";

    type Props = FittedTextExampleProps;

    let props: Props = $props();
</script>

<div class={styles.posterBox}>
    <FittedText lines={POSTER_LINES} lineHeightRatio={props.lineHeightRatio} />
</div>

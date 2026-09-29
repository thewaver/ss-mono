<script lang="ts">
    import { getViewportContext } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ViewportWrapperPage/ViewportWrapperPage.css";

    const context = getViewportContext();
</script>

<div class={[styles.readout, styles.cornerReadout]} data-inner-readout="">
    {`${context.getScale().toFixed(2)}× of ${Math.round(context.getSize().width)}×${Math.round(context.getSize().height)}`}
</div>

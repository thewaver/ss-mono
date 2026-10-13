<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

    import type { PageMeasureBoxProps } from "./MeasureBox.types";
    import { FILLING_WIDTH, NO_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.const";

    let props: PageMeasureBoxProps = $props();

    const getWidth = () => {
        if (props.isFilling) return FILLING_WIDTH;

        return props.width === undefined ? undefined : `${props.width}px`;
    };
</script>

<div
    class={styles.measureBoxRoot}
    data-measure-box=""
    style:width={getWidth()}
    style:height={props.height ? `${props.height}px` : undefined}
    style:padding={`${props.padding ?? NO_PADDING}px`}
>
    {@render props.children?.()}
</div>

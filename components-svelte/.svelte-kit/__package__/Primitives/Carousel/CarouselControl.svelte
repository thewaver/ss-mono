<script lang="ts" generics="TExtra extends object = {}">
    import { CarouselStyles as styles } from "@thewaver/ss-components";

    import type { CarouselControlProps } from "./Carousel.types.js";

    let props: CarouselControlProps<TExtra> = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
</script>

<button
    {@attach props.attachElement}
    type="button"
    class={styles.carouselControl}
    aria-label={props.ariaLabel}
    aria-disabled={isDisabled || undefined}
    aria-current={props.isCurrent || undefined}
    onclick={() => {
        if (isDisabled) return;

        props.onActivate();
    }}
>
    {@render props.renderContent(props.flags)}
</button>

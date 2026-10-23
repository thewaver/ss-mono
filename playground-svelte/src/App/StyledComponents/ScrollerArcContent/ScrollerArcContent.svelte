<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.css";
    import { ScrollerArcContentUtils } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.utils";

    import type { ScrollerArcContentProps } from "./ScrollerArcContentSvelte.types";

    let props: ScrollerArcContentProps = $props();

    const thumbCenter = $derived(ScrollerArcContentUtils.computeThumbCenter(props.renderProps.ratio));
</script>

<div class={[styles.scrollerArc, !props.renderProps.isShown && styles.isHidden]}>
    <div
        {@attach (element) => {
            props.refs.setTrackRef(element);

            return () => props.refs.setTrackRef(undefined);
        }}
        class={styles.scrollerArcTrack}
        style:width={`${ScrollerArcContentUtils.WIDTH}px`}
        style:height={`${ScrollerArcContentUtils.HEIGHT}px`}
    >
        <svg class={styles.scrollerArcSvg} aria-hidden="true">
            <path class={styles.scrollerArcPath} d={ScrollerArcContentUtils.PATH} />
        </svg>

        <div
            {@attach (element) => {
                props.refs.setThumbRef(element);

                return () => props.refs.setThumbRef(undefined);
            }}
            class={[styles.scrollerArcThumb, props.renderProps.isDragging && styles.isDragging]}
            style:left={`${thumbCenter.x}px`}
            style:top={`${thumbCenter.y}px`}
        ></div>
    </div>
</div>

<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerBarContent/ScrollerBarContent.css";

    import type { ScrollerBarContentProps } from "./ScrollerBarContentSvelte.types";

    let props: ScrollerBarContentProps = $props();

    const axis = $derived(props.renderProps.axis);
</script>

<div class={[styles.scrollerBar, styles.scrollerBarVariants[axis], !props.renderProps.isShown && styles.isHidden]}>
    <div
        {@attach (element) => {
            props.refs.setTrackRef(element);

            return () => props.refs.setTrackRef(undefined);
        }}
        class={[styles.scrollerBarTrack, styles.scrollerBarTrackVariants[axis]]}
        style:flex={props.trackLength === undefined ? undefined : `0 0 ${props.trackLength}px`}
    >
        <div
            {@attach (element) => {
                props.refs.setThumbRef(element);

                return () => props.refs.setThumbRef(undefined);
            }}
            class={[
                styles.scrollerBarThumb,
                styles.scrollerBarThumbVariants[axis],
                props.renderProps.isDragging && styles.isDragging,
            ]}
            style:inset-inline-start={axis === "x" ? `${props.renderProps.thumbOffset}px` : undefined}
            style:width={axis === "x" ? `${props.renderProps.thumbLength}px` : undefined}
            style:top={axis === "y" ? `${props.renderProps.thumbOffset}px` : undefined}
            style:height={axis === "y" ? `${props.renderProps.thumbLength}px` : undefined}
        ></div>
    </div>
</div>

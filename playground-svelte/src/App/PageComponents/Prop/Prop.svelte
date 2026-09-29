<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.css";

    import PagePropHintBadge from "../../StyledComponents/PropHintBadge/PropHintBadge.svelte";
    import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import { setFieldDefaultContext } from "../Field/Field.context";
    import { getPropsPanelContext } from "../PropsPanel/PropsPanel.context";
    import type { PagePropProps } from "./Prop.types";

    const HINT_PLACEMENT = { x: "center", y: "top-out" } as const;
    const HINT_OFFSET = { x: 0, y: 10 };
    const EMPTY_TEXT = "";
    const SINGLE_FIELD = 1;

    const toDefaultText = (value: unknown) => {
        if (typeof value === "boolean") return value ? "on" : "off";
        if (typeof value === "number") return String(value);
        if (typeof value === "string" && value !== EMPTY_TEXT) return value;

        return undefined;
    };

    let props: PagePropProps = $props();

    const propsPanelScope = getPropsPanelContext();

    let reported = $state.raw<{ value: unknown }[]>([]);

    setFieldDefaultContext({
        report: (value) => {
            const entry = { value };

            reported = [...reported, entry];

            return () => {
                reported = reported.filter((candidate) => candidate !== entry);
            };
        },
    });

    const reportedDefault = $derived(reported.length === SINGLE_FIELD ? reported[0].value : undefined);

    const defaultText = $derived(
        toDefaultText(props.defaultValue === undefined ? reportedDefault : props.defaultValue),
    );
</script>

<div
    class={styles.propScopeVariants[propsPanelScope?.scope ?? "unknown"]}
    data-prop=""
    data-testid={props.itemKey}
>
    <div class={styles.propLabel}>
        {props.label}

        <Button
            ariaLabel={`About ${props.label}`}
            tooltipDefs={{ placement: HINT_PLACEMENT, offset: HINT_OFFSET, renderContent: hintTooltip }}
        >
            {#snippet renderContent(flags)}
                <PagePropHintBadge {flags} />
            {/snippet}
        </Button>
    </div>

    {@render props.children?.()}
</div>

{#snippet hintTooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        {props.hint}

        {#if defaultText}
            <div class={styles.propHintDefault}>{`Default: ${defaultText}`}</div>
        {/if}
    </PageTooltipContent>
{/snippet}

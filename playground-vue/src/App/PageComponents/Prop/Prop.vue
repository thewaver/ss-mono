<script setup lang="ts">
import { computed, h, shallowRef } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.css";

import PagePropHintBadge from "../../StyledComponents/PropHintBadge/PropHintBadge.vue";
import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.vue";
import { provideFieldDefault } from "../Field/Field.context";
import { usePropsPanelContext } from "../PropsPanel/PropsPanel.context";
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

const props = defineProps<PagePropProps>();

const propsPanelScope = usePropsPanelContext();

const reported = shallowRef<{ value: unknown }[]>([]);

provideFieldDefault({
    report: (value) => {
        const entry = { value };

        reported.value = [...reported.value, entry];

        return () => {
            reported.value = reported.value.filter((candidate) => candidate !== entry);
        };
    },
});

const defaultText = computed(() => {
    const reportedDefault = reported.value.length === SINGLE_FIELD ? reported.value[0].value : undefined;

    return toDefaultText(props.defaultValue === undefined ? reportedDefault : props.defaultValue);
});

const tooltipDefs: InteractionTooltipDefs = {
    placement: HINT_PLACEMENT,
    offset: HINT_OFFSET,
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => [
            props.hint,
            defaultText.value && h("div", { class: styles.propHintDefault }, `Default: ${defaultText.value}`),
        ]),
};
</script>

<template>
    <div :class="styles.propScopeVariants[propsPanelScope?.scope ?? 'unknown']" data-prop="" :data-testid="itemKey">
        <div :class="styles.propLabel">
            {{ label
            }}<Button :ariaLabel="`About ${label}`" :tooltip-defs="tooltipDefs">
                <template #renderContent="flags">
                    <PagePropHintBadge :flags="flags" />
                </template>
            </Button>
        </div>

        <slot />
    </div>
</template>

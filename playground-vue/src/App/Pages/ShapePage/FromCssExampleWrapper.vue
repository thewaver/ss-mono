<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { TextArea } from "@thewaver/ss-components-vue";
import { ShapeKnobs } from "@thewaver/ss-playground/App/Knobs/Shapes.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    FROM_CSS_FIELD_WIDTH,
    FROM_CSS_MAX_ROWS,
    FROM_CSS_MIN_ROWS,
} from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.const";
import { ShapePageUtils } from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.utils";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent from "../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import FromCssExample from "./Examples/FromCss.vue";

const cssText = shallowRef(ShapeKnobs.STARTING_FROM_CSS_TEXT);

const invalidDeclarations = computed(() => ShapePageUtils.findInvalidCssDeclarations(cssText.value));
</script>

<template>
    <TextArea
        v-model:value="cssText"
        :has-error="invalidDeclarations.length > 0"
        is-auto-sizing
        :min-rows="FROM_CSS_MIN_ROWS"
        :max-rows="FROM_CSS_MAX_ROWS"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="CSS"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FROM_CSS_FIELD_WIDTH" is-stretched />
        </template>
    </TextArea>

    <div v-if="invalidDeclarations.length > 0" :class="exampleStyles.exampleReadout" data-readout>
        {{ `Not valid CSS: ${invalidDeclarations.join("; ")}` }}
    </div>

    <FromCssExample :css-text="cssText" />
</template>

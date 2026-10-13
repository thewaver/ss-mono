<script setup lang="ts">
import {
    CHECKED_MARK,
    MIXED_MARK,
} from "@thewaver/ss-playground/App/StyledComponents/CheckboxContent/CheckboxContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CheckboxContent/CheckboxContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CheckboxContentProps } from "./CheckboxContentVue.types";

defineProps<CheckboxContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.checkboxContent,
            layerClass,
            flags.checkedState === true && styles.isChecked,
            flags.checkedState === 'mixed' && styles.isMixed,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
            flags.hasError && styles.hasError,
        ]"
    >
        <div :class="styles.checkboxMark" aria-hidden="true">
            {{ flags.checkedState === "mixed" ? MIXED_MARK : CHECKED_MARK }}
        </div>
    </div>
</template>

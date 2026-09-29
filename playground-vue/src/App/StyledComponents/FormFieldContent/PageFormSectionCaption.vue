<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FormFieldContent/FormFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.formSectionCaption, layerClass]"><slot /></div>
</template>

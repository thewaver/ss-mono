import type { ParentProps } from "solid-js";

import * as styles from "@thewaver/ss-playground-core/App/PageComponents/ControlRow/ControlRow.css";

export const PageControlRow = (props: ParentProps) => <div class={styles.controlRow}>{props.children}</div>;

export const PageControlColumn = (props: ParentProps) => <div class={styles.controlColumn}>{props.children}</div>;

export const PageControlRowLabel = (props: ParentProps) => <div class={styles.controlRowLabel}>{props.children}</div>;

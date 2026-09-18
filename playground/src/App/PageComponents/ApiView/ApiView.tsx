import { For, Show, createMemo } from "solid-js";
import COMPONENT_PROPS from "virtual:component-props";

import { access } from "@thewaver/ss-components";

import type { PageApiViewProps } from "./ApiView.types";
import { toHighlightedType } from "./ApiView.utils";

import * as styles from "./ApiView.css";

const NO_DESCRIPTION = "Not written yet.";
const ACCESSOR_FLAG = "value or accessor";
const REQUIRED_FLAG = "required";

export const PageApiView = (props: PageApiViewProps) => {
    const getEntries = createMemo(() => COMPONENT_PROPS[access(props.name)] ?? []);

    return (
        <div class={styles.apiView} data-view={"api"}>
            <Show
                when={getEntries().length}
                fallback={
                    <p class={styles.apiEmpty}>
                        {`${access(props.name)} publishes no props type, so there is no table to draw.`}
                    </p>
                }
            >
                <div class={styles.apiTableScroller}>
                    <table class={styles.apiTable} data-api-table>
                        <thead>
                            <tr>
                                <th class={styles.apiHeadCell}>Prop</th>
                                <th class={styles.apiHeadCell}>Type</th>
                                <th class={styles.apiHeadCell}>Passing</th>
                                <th class={styles.apiHeadCell}>Use</th>
                            </tr>
                        </thead>

                        <tbody>
                            <For each={getEntries()}>
                                {(entry) => (
                                    <tr data-api-row={entry.name}>
                                        <td class={styles.apiNameCell}>
                                            {entry.name}
                                            <Show when={entry.isOptional}>
                                                <span class={styles.apiOptional}>{"?"}</span>
                                            </Show>
                                        </td>

                                        <td class={styles.apiTypeCell} innerHTML={toHighlightedType(entry.type)} />

                                        <td class={styles.apiCell}>
                                            <Show when={entry.isAccessor} fallback={<span>{"value"}</span>}>
                                                <span class={styles.apiFlag}>{ACCESSOR_FLAG}</span>
                                            </Show>
                                            <Show when={!entry.isOptional}>
                                                {" "}
                                                <span class={styles.apiFlag}>{REQUIRED_FLAG}</span>
                                            </Show>
                                        </td>

                                        <td class={styles.apiCell}>
                                            <Show
                                                when={entry.description}
                                                fallback={<span class={styles.apiPending}>{NO_DESCRIPTION}</span>}
                                            >
                                                {entry.description}
                                            </Show>
                                        </td>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                    </table>
                </div>
            </Show>
        </div>
    );
};

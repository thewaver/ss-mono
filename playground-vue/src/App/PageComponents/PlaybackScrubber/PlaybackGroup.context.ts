import { type InjectionKey, type Ref, inject, provide, shallowRef } from "vue";

type TakePlayback = (key: string) => Ref<boolean>;

const PLAYBACK_GROUP_CONTEXT_KEY: InjectionKey<TakePlayback> = Symbol("PlaybackGroupContext");

export const providePlaybackGroupContext = (value: TakePlayback) => provide(PLAYBACK_GROUP_CONTEXT_KEY, value);

export const usePagePlayback = (key: string): Ref<boolean> =>
    inject(PLAYBACK_GROUP_CONTEXT_KEY, undefined)?.(key) ?? shallowRef(true);

import type { Awaitable } from '../../types/typescript';
export type AutocompleteData = Record<string, any>[];
export type AutocompleteFetchSuggestionsCallback = (data: AutocompleteData) => void;
export type AutocompleteFetchFunc = (queryString: string, cb: AutocompleteFetchSuggestionsCallback) => Awaitable<AutocompleteData> | undefined;
export type AutocompleteFetchSuggestions = AutocompleteData | AutocompleteFetchFunc;

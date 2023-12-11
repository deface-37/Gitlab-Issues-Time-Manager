export const REFETCH_ALL = 'refetch-all'
export const URL_UPDATED = 'base-url-updated'

export const ISSUE_HIDDEN = 'issue-hidden';
export const ISSUE_DISPLAY = 'issue-display';

declare global {
    interface HTMLElementEventMap {
        [ISSUE_HIDDEN]: CustomEvent<string>,
        [ISSUE_DISPLAY]: CustomEvent<string>
    }
}


export interface IApproximateTextMatch {
    /** Closest matching item in list of options */
    item: string;
    /** Flag indicating exact match */
    exactMatch: boolean;
    /** Similarity percentage */
    similarity: number;
}
/**
 * utility function to perform approximate string matching.  This is useful in cases like voice integration where the voice recognition may not
 * produce perfect text input, i.e., what the user says may not be perfectly converted into text.  In such case, an approximate matching needs to
 * be performed.
 * @function module:botUtil.approxTextMatch
 * @return {IApproximateTextMatch} The best match if it matches above the similarity threshold provided.
 * @param {string} item - A string to be matched to a list of strings for best approximate matching.
 * @param {string[]} list - An array of strings to be matched with item.
 * @param {boolean} [lowerCase] - if true, the item and list are first converted to lower case before matching.
 * @param {boolean} [removeSpace] - if true, the item and list are first stripped of space before matching.
 * @param {number} threshold - A number between 0 and 1, with higher number meaning higher similarity.
 */
export declare function approxTextMatch(item: string, list: string[], lowerCase: boolean, removeSpace: boolean, threshold: number): IApproximateTextMatch;

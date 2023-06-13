/**
 * Represents pagination information.
 */
export class PaginationInfo {
  private totalCount: number;
  private rangeSize: number;
  private rangeStart: number;
  private status?: string;

  /**
   * Creates an instance of the PaginationInfo class.
   * @param {number} totalCount The total count.
   * @param {number} rangeSize The range size.
   * @param {number} rangeStart The range start.
   * @param {string} status The status.
   */
  constructor(totalCount: number, rangeSize: number, rangeStart: number) {
    this.totalCount = totalCount;
    this.rangeSize = rangeSize;
    this.rangeStart = rangeStart;
  }

  /**
   * Gets the total count.
   * @returns {number} The total count.
   */
  public getTotalCount(): number {
    return this.totalCount;
  }

  /**
   * Sets the total count.
   * @param {number} totalCount The total count to set.
   * @returns The updated instance of the PaginationInfo.
   */
  public setTotalCount(totalCount: number): this {
    this.totalCount = totalCount;
    return this;
  }

  /**
   * Gets the range size.
   * @returns {number} The range size.
   */
  public getRangeSize(): number {
    return this.rangeSize;
  }

  /**
   * Sets the range size.
   * @param {number} rangeSize The range size to set.
   * @returns The updated instance of the PaginationInfo.
   */
  public setRangeSize(rangeSize: number): this {
    this.rangeSize = rangeSize;
    return this;
  }

  /**
   * Gets the range start.
   * @returns {number} The range start.
   */
  public getRangeStart(): number {
    return this.rangeStart;
  }

  /**
   * Sets the range start.
   * @param {number} rangeStart The range start to set.
   * @returns The updated instance of the PaginationInfo.
   */
  public setRangeStart(rangeStart: number): this {
    this.rangeStart = rangeStart;
    return this;
  }

  /**
   * Gets the status.
   * @returns {string} The status.
   */
  public getStatus(): string {
    return this.status;
  }

  /**
   * Sets the status.
   * @param {string} status The status to set.
   * @returns The updated instance of the PaginationInfo.
   */
  public setStatus(status: string): this {
    this.status = status;
    return this;
  }
}

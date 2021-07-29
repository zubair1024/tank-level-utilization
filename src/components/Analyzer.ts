import { TankDataRecord } from '../types';

class Analyzer {
  private checkBufferSizeLimit;
  private fillingThreshold: number;
  private checkBufferIndexMapping: number[] = [];
  private tankData: TankDataRecord[] = [];
  constructor(
    fillingThreshold: number = 50,
    checkBufferSize: number = 5,
    tankData: TankDataRecord[]
  ) {
    this.checkBufferSizeLimit = checkBufferSize;
    this.fillingThreshold = fillingThreshold;
    this.tankData = tankData;
  }

  /**
   * Finds the next index of filling based on the indices in the checkBufferIndexMapping
   *
   * @returns the index on main array where a filling was triggered
   */
  analyzeBufferForFilling(): number | void {
    if (this.checkBufferIndexMapping.length >= 2) {
      for (let i = 0; i < this.checkBufferIndexMapping.length; i++) {
        const firstIndex = this.checkBufferIndexMapping[i];
        for (let j = i + 1; j < this.checkBufferIndexMapping.length; j++) {
          const secondIndex = this.checkBufferIndexMapping[j];
          if (
            this.tankData[secondIndex].tankLevelPercentage -
              this.tankData[firstIndex].tankLevelPercentage >=
            this.fillingThreshold
          ) {
            return secondIndex;
          }
        }
      }
    }
  }

  /**
   * Finds the next filling record
   *
   * @param startingIdx The start index on the tankData array from which to find the next filling
   * @returns the index of the next filling record if present
   */
  findNextFillingIndex(startingIdx: number): number | void {
    //check if there is data to traverse
    if (startingIdx < this.tankData.length - 1) {
      for (let i = startingIdx; i < this.tankData.length; i++) {
        if (this.checkBufferIndexMapping.length >= this.checkBufferSizeLimit) {
          this.checkBufferIndexMapping.shift();
        }
        this.checkBufferIndexMapping.push(i);

        const found = this.analyzeBufferForFilling();
        if (found) return found;
      }
    }
  }

  /**
   * Provided a filling trigger, it finds the next highest tank level percentage value before consumption takes place
   *
   * @param {number} triggeredIndex a filling triggered record index on the tankData array
   * @returns {number} the highest tank level percentage value during
   */
  findNextHighestIndex(triggeredIndex: number): number {
    let highestValue = this.tankData[triggeredIndex].tankLevelPercentage;
    for (let i = triggeredIndex; i < this.tankData.length; i++) {
      const element = this.tankData[i];
      if (element.tankLevelPercentage < highestValue) {
        return i - 1;
      }
      highestValue = element.tankLevelPercentage;
    }

    // if nothing is found send the triggered value
    return this.tankData[triggeredIndex].tankLevelPercentage;
  }

  /**
   * Finds the last lowest value index on the tankData array before the triggeredIndex
   *
   * @param {number} startingIdx the starting index on the main tankData array
   * @param {number} triggeredIndex the filling triggered index on the tankData array
   * @returns
   */
  findLastLowestIndex(startingIdx: number, triggeredIndex: number): number {
    const allValues = this.tankData
      .slice(startingIdx, triggeredIndex)
      .map((i) => i.tankLevelPercentage);
    const minValue = Math.min(...allValues);
    const lastIndexOf = allValues.lastIndexOf(minValue);
    return startingIdx + lastIndexOf;
  }
  /**
   * A recursive function that returns the total filled amount in percentage
   *
   * @param {number} preValue a temporary total value that is maintained between iterations
   * @param {number} startingIdx a temporary delimiting startingIdx between iterations
   * @returns {number}  total filled amount in percentage
   */
  getTotalFilledAmount(preValue: number = 0, startingIdx: number = 0): number {
    const triggeredIndex = this.findNextFillingIndex(startingIdx);
    if (triggeredIndex) {
      this.checkBufferIndexMapping = [];
      const nextHighestIdx = this.findNextHighestIndex(triggeredIndex);
      const lastLowestIdx = this.findLastLowestIndex(
        startingIdx,
        triggeredIndex
      );
      const newValue =
        preValue +
        (this.tankData[nextHighestIdx].tankLevelPercentage -
          this.tankData[lastLowestIdx].tankLevelPercentage);
      return this.getTotalFilledAmount(newValue, nextHighestIdx + 1);
    }
    return Number(preValue.toFixed(2));
  }
  /**
   * Provided the total filled value, we can get the total emptied value
   *
   * @param {number} totalFilledPercentage
   * @returns {number} total emptied amount in percentage
   */
  getTotalEmptiedAmount(totalFilledPercentage: number): number {
    const first = this.tankData[0].tankLevelPercentage;
    const last = this.tankData[this.tankData.length - 1].tankLevelPercentage;
    const value = Number((first - last + totalFilledPercentage).toFixed(2));
    if (value < 0) return 0;
    return value;
  }
  /**
   * for the given tank data get the total filled and emptied value
   *
   * @returns {[number, number]} return [filled value, emptied value]
   */
  getStats(): [number, number] {
    const filled = this.getTotalFilledAmount() ?? 0;
    const emptied = this.getTotalEmptiedAmount(filled) ?? 0;
    return [filled, emptied];
  }
}

export default Analyzer;

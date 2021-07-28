import { FileDataRecord } from '../types';
import { transformData } from '../util';
import Analyzer from './Analyzer';
import jsonArray from './testData.json';

test('it should say hello', () => {
  const fillingThreshold = 50;
  const checkBufferSize = 10;
  const transformedData = transformData(
    (jsonArray as unknown) as FileDataRecord[]
  );
  const analyzer = new Analyzer(
    fillingThreshold,
    checkBufferSize,
    transformedData
  );
  const [filledAmount, emptiedAmount] = analyzer.getStats();
  expect(Math.abs(filledAmount)).toBe(68.07000000000001);
  expect(Math.abs(emptiedAmount)).toBe(8.010000000000012);
});

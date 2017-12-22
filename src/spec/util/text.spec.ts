
import { Util } from '../main';

describe('Text Utilities', () => {
  it('should find nearest match', () => {
    const strInput = 'Hello World!';
    const strOptions = ['Hello Child', 'Hello Bird', 'Hello World'];
    let match = Util.Text.approxTextMatch(strInput, strOptions, true, true, 0.9);
    expect(match).not.toBeNull();
    expect(match.exactMatch).toBe(false);
    expect(match.similarity).toBeGreaterThanOrEqual(0.9);
    expect(match.item).toEqual('Hello World');
  });
});

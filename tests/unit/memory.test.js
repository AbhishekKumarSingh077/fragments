const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
} = require('../../src/model/data/memory/index');

describe('memory', () => {
  test('testing writeFragment()', async () => {
    const result = await writeFragment({ ownerId: '124', id: '1', fragment: 'fragment test1' });
    expect(result).toBe(undefined);
  });

  test('testing readFragment()', async () => {
    const data = { ownerId: '124', id: '1', fragment: 'fragment test2' };
    await writeFragment(data);
    const result = await readFragment('124', '1');
    expect(result).toBe(data);
  });

  test('testing writeFragmentData()', async () => {
    const result = await writeFragmentData('124', '1', 'fragment test3');
    expect(result).toBe(undefined);
  });

  test('testing readFragmentData()', async () => {
    const data = 'fragmentTest4';
    await writeFragmentData('124', '1', data);
    const result = await readFragmentData('124', '1');
    expect(result).toBe(data);
  });
});

import { IntlCurrencyPipe } from './events-filter.pipe';

describe('IntlCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new IntlCurrencyPipe();
    expect(pipe).toBeTruthy();
  });
});

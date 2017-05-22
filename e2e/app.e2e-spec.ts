import { FarklePage } from './app.po';

describe('farkle App', () => {
  let page: FarklePage;

  beforeEach(() => {
    page = new FarklePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

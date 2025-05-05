import { Office_ProjectTemplatePage } from './app.po';

describe('Office_Project App', function() {
  let page: Office_ProjectTemplatePage;

  beforeEach(() => {
    page = new Office_ProjectTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

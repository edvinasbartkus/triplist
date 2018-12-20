describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have new list button', async () => {
    await expect(element(by.id('NewListButton'))).toBeVisible();
  });
})
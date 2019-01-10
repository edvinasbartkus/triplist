describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should be able to create a new list', async () => {
    const newListButton = element(by.id('NewListButton'))
    await expect(newListButton).toBeVisible()
    await newListButton.tap()

    const newListName = element(by.id('NewListName'))
    await expect(newListName).toBeVisible()
    await newListName.typeText('Lisbon')

    const newListSave = element(by.id('NewListSave'))
    await expect(newListSave).toBeVisible()
    await newListSave.tap()
    await expect(element(by.text('Lisbon'))).toBeVisible()
  })
})

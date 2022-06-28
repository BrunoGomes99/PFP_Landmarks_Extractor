const { Application } = require('spectron')
const assert = require('assert')
const electronPath = require('electron')
const path = require('path')

const app = new Application({
    path: electronPath,
    args: [path.join(__dirname, '../')],
  });
  

describe('Landmarks Extractor launch', function () {
    this.timeout(30000);
  
    beforeEach(() => {
      return app.start();
    })
  
    afterEach(() => {
      if (app && app.isRunning()) {
        return app.stop();
      }
    })

    it("Check if the window is visible", async () => {
        await app.client.waitUntilWindowLoaded();
        const isVisible = await app.browserWindow.isVisible();
        assert.equal(isVisible, true);        
      });
    
    it('Shows an initial window', async () => {
      await app.client.waitUntilWindowLoaded();
      const count = await app.client.getWindowCount();
      assert.equal(count, 1);
    });
    
    it('Has the correct title', async () => {
      await app.client.waitUntilWindowLoaded();
      const title = await app.client.getTitle();
      assert.equal(title, 'Landmarks Extractor');
    });        
    
  })
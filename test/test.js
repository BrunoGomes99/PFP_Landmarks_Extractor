/*
Autor: Bruno Gomes
Este script é responsável por realizar os testes da aplicação desktop criada via electron
*/

const { Application } = require('spectron')    // Importa o módulo de Aplicação da biblioteca de testes spectron.
const assert = require('assert')               // Carrega o módulo de Asserções da bibliota de testes Mocha.
const electronPath = require('electron')       // Recupera o caminho binários do Electron em node_modules.
const path = require('path')                   // Importa o sistema de arquivos.

const app = new Application({
    path: electronPath,
    args: [path.join(__dirname, '../')],
  });
  
// O bloco abaixo define os testes a serem realizados no electron, com o timeout de 30 segundos.
describe('Landmarks Extractor launch', function () {
    this.timeout(30000);
  
    // Inicia a aplicação antes de cada teste.
    beforeEach(() => {
      return app.start();
    })
  
    // Encerra a aplicação depois de cada teste.
    afterEach(() => {
      if (app && app.isRunning()) {
        return app.stop();
      }
    })

    // Testa se a janela da aplicação gerada pelo electron é visível.
    it("Check if the window is visible", async () => {
        await app.client.waitUntilWindowLoaded();
        const isVisible = await app.browserWindow.isVisible();
        assert.equal(isVisible, true);        
      });
    
    // Testa se a aplicação mostra uma janela inicial.
    it('Shows an initial window', async () => {
      await app.client.waitUntilWindowLoaded();
      const count = await app.client.getWindowCount();
      assert.equal(count, 1);
    });
    
    // Testa se a aplicação está exibindo o título correto (Landmarks Extractor).
    it('Has the correct title', async () => {
      await app.client.waitUntilWindowLoaded();
      const title = await app.client.getTitle();
      assert.equal(title, 'Landmarks Extractor');
    });        
    
  })
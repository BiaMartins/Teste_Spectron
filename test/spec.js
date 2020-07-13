const assert = require('assert');
const path = require('path');
const Application = require('spectron').Application;
const electronPath = require('electron');
const { doesNotMatch } = require('assert');
const expect = require('chai').expect;
const { clipboard, Tray } = require('electron');
const { BrowserWindow } = require('electron')



const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '..')],
  webdriverOptions: {
    deprecationWarnings: false
  }
});

describe('Clipmaster 9000', function () {
  this.timeout(10000);

  beforeEach(() => {
    return app.start().then( async () => {
      await app.browserWindow.focus();
      await app.browserWindow.setAlwaysOnTop(true);
     }); 
  });

  afterEach(() => {
   if (app && app.isRunning()) {
      return app.stop();
   }
  });

  it('Validar campo obrigatório', async() =>{ //Validar campo obrigatório
    await app.client.waitUntilWindowLoaded(); // Abre a janela
    await app.client.click('#enviar'); // clica no campo
    await app.electron.clipboard.writeText(''); //verifica o conteudo do campo
    await app.electron.clipboard.writeText('@bia123');// digitei um valor
    const clipboardText = await app.electron.clipboard.readText(); // gravei o valor 
    return assert.equal(clipboardText, '@bia123');  // verifiquei se o texto inserido foi o que coloquei aqui no teste
  });

  it('números de janelas abertas', async () => { // quantos janelas são abertas 
    const count = await app.client.getWindowCount();
    return assert.equal(count, 1); // valida que só abre uma janela ao startar a aplicação
  });

  it ('titulo da janela', async() =>{ // nome da janela
    const title = await app.client.waitUntilWindowLoaded().getTitle();
    return assert.equal(title, 'Bia'); //Valida o titulo da janela
  });

  it('não possui ferramenta de desenvolvedor aberto', async()=>{ // teste importante para aplicações Electron
    const janelaDev = await app.client
    .waitUntilWindowLoaded()
    .browserWindow.isDevToolsOpened(); // verifica se as ferramentas do desevolver estão abertas
    return assert.equal(janelaDev, false);
  });

  it('clicar no botão', async () => { // Verifica o click do radio button
    await app.client.waitUntilWindowLoaded();
    await app.client.click('#radio1');
    const clippings = await app.client.$$('.clippings-list-item');
    return assert.equal(clippings.length, 1);
  });

  it('sem click no botão OK', async () => { //Verifica se o botão tem alguma ação assim que entra no campo
    await app.client.waitUntilWindowLoaded();
    const clippings = await app.client.$$('.clippings-list-item');
  return assert.equal(clippings.length, 1);
  });

  it('botão GO', async() =>{ // validar o nome do botão
    const button = await app.client
    .getText('#go'); // acessa o botão 
    return assert.equal(button, 'OK'); // Verifica o nome do botão
  });

  it('verificar texto de mascara do campo', async () => {// validar o texto no campo
    await app.client.waitUntilWindowLoaded();
    await app.electron.clipboard.writeText('texto');
    await app.client.click('#copy-from-clipboard'); // clica no campo
    const clippingText = await app.client.getText('.clipping-text'); // ler o texto
  return assert.equal(clippingText, ''); // verificar  qual texto estar na mascara do campo
  });

  it('verificar texto no campo', async () => { // verifica o valor do campo   ACHO QUE TA ERRADO
    await app.client.waitUntilWindowLoaded();
    await app.electron.clipboard.writeText('texto'); // mascara do campo
    await app.client.click('#copy-from-clipboard'); // clica no campo
    await app.electron.clipboard.writeText('Olá!'); // escreve o novo texto
    await app.client.click('.copy-clipping');
    const clipboardText = await app.electron.clipboard.readText(); // ler o texto inserido
  return assert.equal(clipboardText, 'Olá!'); // verifica se o texto que estar no campo é o que foi inserido por ultimo
  });

  it('retorna uma captura de tela do buffer do retângulo fornecido', function () {
    return app.browserWindow.capturePage({ // CapturePage recebe como parametro o tamanho da captura
      x: 0,
      y: 0,
      width: 10,
      height: 10
    }).then(function (buffer) {
      expect(buffer).to.be.an.instanceof(Buffer); // Usa o buffer para pegar os dados da imagem
      expect(buffer.length).to.be.above(0);
    });
  });

  it('retorna uma captura de tela do buffer de toda a página quando nenhum retângulo é especificado', function () {
    return app.browserWindow.capturePage().then(function (buffer) { // CapturaPage retorna toda a página capturada
      expect(buffer).to.be.an.instanceof(Buffer); // Usa o buffer para pegar os dados da imagem
      expect(buffer.length).to.be.above(0);
    });
  });

  it ('Captura de tela', async()=>{ //A mesma captura da anterior, porém de outra forma
    app.browserWindow.capturePage().then(function (imageBuffer) { // CapturaPage não tem retorno, ele retorda nos dados da imagem caprutada através do imageBuffer
      fs.writeFile('page.png', imageBuffer)
    });
  });
});

//https://github.com/electron-userland/spectron/tree/master/test
//https://developer.aliyun.com/mirror/npm/package/spectron
//https://www.electronjs.org/docs/api/browser-window#evento-session-end-windows
//https://www.electronjs.org/docs/api/native-image - API só referente a imagens e capturas de imagens 
//https://github.com/electron-userland/spectron/blob/master/test/commands-test.js

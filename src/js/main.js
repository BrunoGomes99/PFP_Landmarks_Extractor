/*
Autor: Bruno Gomes
Este script é responsável por configurar e inicializar a aplicação desktop via electron,
além de definir eventos de get e set personalizados
*/

// Carregando módulos do framework Electron
const { app, BrowserWindow, dialog, ipcMain } = require('electron');

// Este método irá instanciar a janela principal da aplicação
function createWindow(){    
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: false,
        webPreferences:{
            nodeIntegration:true, // Permite a integração com o Node.js
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
        
    // Carrega o arquivo index.html
    mainWindow.loadFile('./src/html/index.html');
}

app.whenReady().then(() => {
    // Após o Electron ser devidamente carregado, ele chamará o método abaixo
    createWindow();

    app.on('activate', () => {
        // No macOS, é comum recriar uma janela no aplicativo quando o 
        // ícone do dock é clicado e não há outras janelas abertas.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
});

// Encerra a aplicação se todas as suas janelas forem fechadas, caso o kernel atual não seja "darwin" (MacOs)
// No MacOS, é comum que os aplicativos e sua barra de menus permaneçam ativos até que o usuário saia explicitamente através do comando Cmd + Q.
app.on("window-all-closed", ()=>{
    if(process.platform !== "darwin") app.quit();
})

// Quando o evento 'save-result-text' for chamado, a mensagem de sucesso ou erro retornada pelo script python será salva na variável 'text'.
ipcMain.on("save-result-text", (event, args) => {
    text = args[0]
});

// Quado o evento 'get-result-text' for chamado, a mensagem resultante do script python será retornada.
ipcMain.on("get-result-text", (event, args) => {
    event.returnValue = [text]
});

// Quando o evento 'save-options' for chamado, os options que serão passados para a lib PythonShell serão salvos, tais como caminho do arquivo python e argumentos necessários.
ipcMain.on("save-options", (event, args) => {
    options = args[0]
});

// Quando o evento 'get-options' for chamado, os options da lib PythonShell serão retornados.
ipcMain.on("get-options", (event, args) => {
    event.returnValue = [options]
});

// Quando o evento 'load-videos' for chamado, o caminho do diretório e os arquivos de vídeos são salvos.
ipcMain.on("load-videos", (event, args) => {
    path = args[0]
    file_videos = args[1]
});

// Quando o evento 'get-videos' for chamado, o caminho do diretório e os arquivos de vídeos serão retornados.
ipcMain.on("get-videos", (event, args) => {
    event.returnValue = [path, file_videos]
});

// Quando o evento 'select-directory' for chamado, a janela de diretórios é aberta e, em seguida, retorna o caminho especificado.
ipcMain.on('select-directory', (event, arg) => {
    selected_dir = dialog.showOpenDialogSync({
        properties: ['openDirectory']
    });
    event.returnValue = selected_dir
})
/*
Autor: Bruno Gomes
Este script é responsável por recuperar o texto resultante do script Python
e permitir o redirecionamento para a página principal caso o usuário clicar no
botão de voltar
*/

const { ipcRenderer } = require('electron');  // Importa função de comunicação com o processo principal

// O bloco abaixo é chamado após o html ser totalmente carregado
document.addEventListener('DOMContentLoaded', function(){

    let resultText = document.getElementById("resultText");
    let returnButton = document.getElementById("returnButton");
    returnButton.onclick = () => returnToIndex();

    // Retorna a mensagem resultante do script Python, previamente setada em loadingscreen.js.
    let args = ipcRenderer.sendSync('get-result-text', "");
    text = args[0]
    delete args    
    
    // Seta o valor do input 'resultText' com a mensagem retornada pelo script Python.
    resultText.textContent = text;
})

function returnToIndex (){
    // Redireciona para a página index.html, tela inicial da aplicação.
    window.location.replace("../html/index.html");
}
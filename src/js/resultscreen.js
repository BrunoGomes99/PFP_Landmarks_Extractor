const { ipcRenderer } = require('electron');  // Importa função de comunicação com o processo principal

// O bloco abaixo é chamado após o html ser totalmente carregado
document.addEventListener('DOMContentLoaded', function(){

    let resultText = document.getElementById("resultText");
    let returnButton = document.getElementById("returnButton");
    returnButton.onclick = () => returnToIndex();

    let args = ipcRenderer.sendSync('get-result-text', "");
    text = args[0]
    delete args    
    
    resultText.textContent = text;
})

function returnToIndex (){
    window.location.replace("../html/index.html"); // Redireciona para a tela inicial
}
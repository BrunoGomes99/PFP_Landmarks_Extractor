/*
Autor: Bruno Gomes
Este script é responsável por chamar o script Python passando os argumentos previamente salvos
*/

const { ipcRenderer } = require('electron');    // Importa a função de comunicação com o script main.js que define o electron
const {PythonShell} = require('python-shell');  // Importa a biblioteca para integração entre javascript e Python

// O bloco abaixo é chamado após o html ser totalmente carregado
document.addEventListener('DOMContentLoaded', function(){    

    // Chama o evento 'get-options' para recuperar os argumentos e caminho do script Python, previamente setados no index.js.
    var args = ipcRenderer.sendSync('get-options', "");
    options = args[0]
    delete args    

    // Executa o script Python, passando as options carregadas acima.
    PythonShell.run('extract_landmarks.py', options, function (err, results) {       
                
        if (err){        
            // Se houver erro, salva a mensagem de erro através do evento 'save-result-text'.
            ipcRenderer.send('save-result-text', [err.message]);            
        }else{
            // Senão, salva a mensagem de sucesso resultante do script através do evento 'save-result-text'.
            ipcRenderer.send('save-result-text', [results]);
        }
        
        //Redireciona a pagina para resultscreen.html, a tela contendo a mensagem resultante do script.
        window.location.replace("../html/resultscreen.html");
      });
})
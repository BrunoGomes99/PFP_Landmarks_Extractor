const { ipcRenderer } = require('electron');  // Importa função de comunicação com o processo principal
const {PythonShell} = require('python-shell'); // Importa a biblioteca para vinculação com o Python
const fs = require('fs');                     // Importa sistema de arquivos do javaScript
const glob = require('glob').Glob;                 //Importa sistema de arquivos recursivo para iteração sobre um diretorio
const path = require('path');                  // Importa sistema de arquivos

// O bloco abaixo é chamado após o html ser totalmente carregado
document.addEventListener('DOMContentLoaded', function(){    

    var args = ipcRenderer.sendSync('get-options', "");
    options = args[0]
    delete args    

    PythonShell.run('extract_landmarks.py', options, function (err, results) {       
                
        if (err){        
            ipcRenderer.send('save-result-text', [err.message]);
            //throw err;
        }else{
            ipcRenderer.send('save-result-text', [results]);
        }
        
        window.location.replace("../html/resultscreen.html"); //Redireciona a pagina para resultscreen.html
      });
})
const { ipcRenderer } = require('electron');  // Importa função de comunicação com o processo principal
const {PythonShell} = require('python-shell'); // Importa a biblioteca para vinculação com o Python
const fs = require('fs');                     // Importa sistema de arquivos do javaScript
const glob = require('glob').Glob;                 //Importa sistema de arquivos recursivo para iteração sobre um diretorio
const path = require('path');                  // Importa sistema de arquivos

// O bloco abaixo é chamado após o html ser totalmente carregado
document.addEventListener('DOMContentLoaded', function(){

  let buttonPathSource = document.getElementById("buttonPathSource");  
  buttonPathSource.onclick = () => selectDirSource();
  
  let buttonPathDestiny = document.getElementById("buttonPathDestiny");  
  buttonPathDestiny.onclick = () => selectDirDestiny();

  let confirmButton = document.getElementById("confirmButton");
  confirmButton.onclick = () => validateFields();    
})

function validateFields() {

    let inputPathSource = document.getElementById("inputPathSource");
    let inputPathDestiny = document.getElementById("inputPathDestiny");
    let batchSizeNumber = document.getElementById("batchSizeNumber");

    let requiredSpanCaminhoOrigem = document.getElementById("avisoCaminhoOrigem");    
    let requiredSpanCaminhoDestino = document.getElementById("avisoCaminhoDestino");    
    let requiredSpanBatchSize = document.getElementById("avisoBatchSize");    

    let isValidFields = false;

    // Se o usuário não selecionar um caminho de origem, a mensagem de obrigatoriedade será mostrada
    if (inputPathSource.value == "" || inputPathSource.value == "./"){        
        requiredSpanCaminhoOrigem.hidden = false;
        inputPathSource.required = true;
        isValidFields = false;
    }
     // Se o usuário selecionar um caminho de origem, a mensagem de obrigatoriedade será escondida
    else{        
        requiredSpanCaminhoOrigem.hidden = true;
        inputPathSource.required = false;
        isValidFields = true;
    }

    // Se o usuário não selecionar um caminho de destino, a mensagem de obrigatoriedade será mostrada
    if (inputPathDestiny.value == "" || inputPathDestiny.value == "./"){        
        requiredSpanCaminhoDestino.hidden = false;
        inputPathDestiny.required = true;
        isValidFields = false;
    }
     // Se o usuário selecionar um caminho de destino, a mensagem de obrigatoriedade será escondida
    else{        
        requiredSpanCaminhoDestino.hidden = true;
        inputPathDestiny.required = false;
        isValidFields = true;
    }

    // Se o usuário não selecionar o intervalo de frames, a mensagem de obrigatoriedade será mostrada
    if (batchSizeNumber.value == "" || batchSizeNumber.value == "0"){        
        requiredSpanBatchSize.hidden = false;
        batchSizeNumber.required = true;
        isValidFields = false;
    }
     // Se o usuário selecionar  o intervalo de frames, a mensagem de obrigatoriedade será escondida
    else{        
        requiredSpanBatchSize.hidden = true;
        batchSizeNumber.required = false;
        isValidFields = true;
    }

    if (isValidFields)
        prepareScript()

}

function prepareScript(){
    
    let batch_size = document.getElementById("batchSizeNumber").value;
    let path_destiny = document.getElementById("inputPathDestiny").value;
    path_destiny = path_destiny.replace(/\\/g, "/");

    var args = ipcRenderer.sendSync('get-videos', "");
    selected_path = args[0].replace(/\\/g, "/")
    file_videos = args[1]
    delete args    
    
    // Define os argumentos que serão passados para o script em python
    let options = {     
        scriptPath: path.join(__dirname, '../py/'),
        args: ['--path-dir',selected_path,'--path-destiny',path_destiny,'--batch-size',batch_size]
     };     

     ipcRenderer.send('save-options', [options]);

     window.location.replace("../html/loadingscreen.html"); //Redireciona a pagina para loadingscreen.html
     
     //PythonShell.run('extract_landmarks.py', options, function (err, results) {       
     //           
     //  if (err){        
     //   alert(err.message)
     //   throw err;
     //  }
     //  //alert(results)
     //  ipcRenderer.sendSync('change-page', "");
     //  resultText.value = results;
     //  //window.location.replace("../html/resultscreen.html"); //Redireciona a pagina para loadingscreen.html
     //});
}

// Este método abre uma janela para a seleção do diretório contendo os vídeos para a extração de landmarks
function selectDirSource(){
  let selected_path = ipcRenderer.sendSync('select-directory', ""); // Chama o evento 'select-directory' definido no script main.js

  if (selected_path != undefined) { // Checa se ao menos um diretório foi selecionado
      // Se sim, carrega o input do diretório com o respectivo caminho selecionado
      inputPathSource.value = selected_path;            
  }  

  selected_path = selected_path[0];

  if (fs.lstatSync(selected_path).isDirectory()) { // Checa se o caminho selecionado é um diretório válido
      // Percorre todos os arquivos .mp4 do diretório      
      glob((selected_path + '/**/*.mp4').replace(/\\/g,'/'), {}, (err, files) => {        
          
          if (files.length > 0) {
              // Se encontrar arquivos .mp4 no diretório, chama o evento 'load-videos', passando o caminho do diretório e os arquivos
              ipcRenderer.send('load-videos', [selected_path, files]);
          } else {
              //Abre um modal informando que nao há arquivos .wav no diretorio
              inputPathSource.value = "./"
              alert("Nenhum arquivo .mp4 encontrado")              
          }
      })
  }
}

// Este método abre uma janela para a seleção do diretório de destino para salvar o arquivo json
function selectDirDestiny(){
    let selected_path = ipcRenderer.sendSync('select-directory', ""); // Chama o evento 'select-directory' definido no script main.js
  
    if (selected_path != undefined) { // Checa se ao menos um diretório foi selecionado
        // Se sim, carrega o input do diretório com o respectivo caminho selecionado
        inputPathDestiny.value = selected_path;            
    }       
}
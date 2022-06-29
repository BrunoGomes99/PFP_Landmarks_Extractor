/*
Autor: Bruno Gomes
Este script é responsável por coletar as informações inseridas pelo usuário e 
salvar os argumentos a serem passados para o script Python
*/


const { ipcRenderer } = require('electron');  // Importa a função de comunicação com o script main.js que define o electron
const fs = require('fs');                     // Importa o sistema de arquivos do javaScript
const glob = require('glob').Glob;            // Importa o sistema de arquivos responsável por iterar sobre um diretorio
const path = require('path');                 // Importa o sistema de arquivos

// O bloco abaixo é chamado após o html ser totalmente carregado
document.addEventListener('DOMContentLoaded', function(){

  let buttonPathSource = document.getElementById("buttonPathSource");  
  buttonPathSource.onclick = () => selectDirSource();
  
  let buttonPathDestiny = document.getElementById("buttonPathDestiny");  
  buttonPathDestiny.onclick = () => selectDirDestiny();

  let confirmButton = document.getElementById("confirmButton");
  confirmButton.onclick = () => validateFields();    
})

// Este método valida se todos os campos obrigatórios foram devidamente preenchidos
function validateFields() {

    let inputPathSource = document.getElementById("inputPathSource");
    let inputPathDestiny = document.getElementById("inputPathDestiny");
    let batchSizeNumber = document.getElementById("batchSizeNumber");

    let spanNoVideosFounded = document.getElementById("avisoVideoNaoEncontrado");
    let requiredSpanCaminhoOrigem = document.getElementById("avisoCaminhoOrigem");
    let requiredSpanCaminhoDestino = document.getElementById("avisoCaminhoDestino");    
    let requiredSpanBatchSize = document.getElementById("avisoBatchSizeObrigatorio");    
    let invalidSpanBatchSize = document.getElementById("avisoBatchSizeInvalido");    

    let hasPathSourceValue = false;
    let hasPathDestinyValue = false;
    let hasBatchSizeValue = false;
    let isBatchSizeValid = false;

    // Garante que a mensagem de vídeo não encontrado esteja escondida.
    spanNoVideosFounded.hidden = true;
    inputPathSource.required = false;

    // Se o usuário não selecionar um caminho de origem, a mensagem de obrigatoriedade será mostrada.
    if (inputPathSource.value == "" || inputPathSource.value == "./"){        
        requiredSpanCaminhoOrigem.hidden = false;
        inputPathSource.required = true;
        hasPathSourceValue = false;
    }
     // Se o usuário selecionar um caminho de origem, a mensagem de obrigatoriedade será escondida.
    else{        
        requiredSpanCaminhoOrigem.hidden = true;
        inputPathSource.required = false;
        hasPathSourceValue = true;
    }

    // Se o usuário não selecionar um caminho de destino, a mensagem de obrigatoriedade será mostrada.
    if (inputPathDestiny.value == "" || inputPathDestiny.value == "./"){        
        requiredSpanCaminhoDestino.hidden = false;
        inputPathDestiny.required = true;
        hasPathDestinyValue = false;
    }
     // Se o usuário selecionar um caminho de destino, a mensagem de obrigatoriedade será escondida.
    else{        
        requiredSpanCaminhoDestino.hidden = true;
        inputPathDestiny.required = false;
        hasPathDestinyValue = true;
    }

    // Se o usuário não selecionar o intervalo de frames, a mensagem de obrigatoriedade será mostrada.
    if (batchSizeNumber.value == ""){        
        requiredSpanBatchSize.hidden = false;
        batchSizeNumber.required = true;
        hasBatchSizeValue = false;
    }
     // Se o usuário selecionar  o intervalo de frames, a mensagem de obrigatoriedade será escondida.
    else{        
        requiredSpanBatchSize.hidden = true;
        batchSizeNumber.required = false;
        hasBatchSizeValue = true;
    }
    
    // Se o usuário selecionar um intervalo de frames negativo ou um número decimal, a mensagem de valor inválido será mostrada.
    // A função 'indexOf' checa se existe ponto flutuante no na string retornada. Caso exista, ela retorna algo diferente de -1, ou seja, o index desse ponto na string
    if (batchSizeNumber.value != "" && batchSizeNumber.value <= "0" || batchSizeNumber.value != "" && (batchSizeNumber.value.indexOf(".") != "-1")){        
        invalidSpanBatchSize.hidden = false;        
        isBatchSizeValid = false;
    }
     // Se o usuário selecionar um intervalo de frames válido, a mensagem de valor inválido será escondida.
    else{        
        invalidSpanBatchSize.hidden = true;        
        isBatchSizeValid = true;
    }

    // Uma vez que todos os campos estiverem devidamente preenchidos e válidos, o método de preparo para o script Python será chamado.
    if (hasPathSourceValue && hasPathDestinyValue && hasBatchSizeValue && isBatchSizeValid)
        prepareScript()
}


// Este método abre uma janela para a seleção do diretório contendo os vídeos desejados para a extração de landmarks.
function selectDirSource(){    

  // Carrega o input do caminho de origem, a mensagem de vídeo não encontrado e a mensagem de campo obrigatório
  let requiredSpanCaminhoOrigem = document.getElementById("avisoCaminhoOrigem");
  let spanNoVideosFounded = document.getElementById("avisoVideoNaoEncontrado");
  let inputPathSource = document.getElementById("inputPathSource");

  // Chama o evento 'select-directory', responsável por retornar o caminho do diretório escolhido pelo usuário.
  let selected_path = ipcRenderer.sendSync('select-directory', "");

  // Checa se ao menos um diretório foi selecionado.
  if (selected_path != undefined) {
      // Se sim, carrega o input do diretório com o respectivo caminho selecionado.
      inputPathSource.value = selected_path;            
  }  

  selected_path = selected_path[0];

  // Checa se o caminho selecionado é um diretório válido
  if (fs.lstatSync(selected_path).isDirectory()) {
      // Percorre todos os arquivos .mp4 do diretório      
      glob((selected_path + '/**/*.mp4').replace(/\\/g,'/'), {}, (err, files) => {        
          
          if (files.length > 0) {
              // Se encontrar arquivos .mp4 no diretório, chama o evento 'load-videos', passando o caminho do diretório e os arquivos.
              // Este evento irá setar ambos em variáveis para serem posteriormente recuperados.
              ipcRenderer.send('load-videos', [selected_path, files]);

              // Caso exista vídeos .mp4 no diretório escolhido, esconde a mensagem de vídeo não encontrado
              spanNoVideosFounded.hidden = true;
              requiredSpanCaminhoOrigem.hidden = true;
              inputPathSource.required = false;
          } else {
              // Se não encontrar arquivos .mp4 no diretório, exibe um alerta.
              inputPathSource.value = "./"

              // Caso não exista vídeos .mp4 no diretório escolhido, mostra a mensagem de vídeo não encontrado e esconde a mensagem de campo obrigatório
              spanNoVideosFounded.hidden = false;
              requiredSpanCaminhoOrigem.hidden = true;
              inputPathSource.required = true;              
          }
      })
  }
}


// Este método abre uma janela para a seleção do diretório de destino para salvar o arquivo json
function selectDirDestiny(){
    // Carrega o input do caminho de destino, a mensagem de vídeo não encontrado e a mensagem de campo obrigatório.
    let requiredSpanCaminhoDestino = document.getElementById("avisoCaminhoDestino");
    let inputPathSource = document.getElementById("inputPathSource");

    // Chama o evento 'select-directory', responsável por retornar o caminho do diretório escolhido pelo usuário.
    let selected_path = ipcRenderer.sendSync('select-directory', "");
  
    // Checa se ao menos um diretório foi selecionado.
    if (selected_path != undefined) {
        // Se sim, carrega o input do diretório com o respectivo caminho selecionado.
        inputPathDestiny.value = selected_path;

        // Se selecionar um diretório válido, esconde a mensagem de diretório inválido.
        requiredSpanCaminhoDestino.hidden = true;
        inputPathSource.required = false;
    }
}


// Este método irá carregar os argumentos necessários a serem passados para o script python e, em seguida, chamar a tela de carregamento.
function prepareScript(){
    
    let batch_size = document.getElementById("batchSizeNumber").value;
    let path_destiny = document.getElementById("inputPathDestiny").value;
    path_destiny = path_destiny.replace(/\\/g, "/");

    // Busca o caminho do diretório de origem previamente selecionado pelo usuário.
    var args = ipcRenderer.sendSync('get-videos', "");
    selected_path = args[0].replace(/\\/g, "/")
    file_videos = args[1]
    delete args    
    
    // Define os argumentos que serão passados para o script em python: caminho de origem, caminho de destino e intervalo de frames (batch_size).
    let options = {     
        scriptPath: path.join(__dirname, '../py/'),
        args: ['--path-dir',selected_path,'--path-destiny',path_destiny,'--batch-size',batch_size]
     };     

     ipcRenderer.send('save-options', [options]);

     //Redireciona a pagina para loadingscreen.html, a tela de carregamento.
     window.location.replace("../html/loadingscreen.html");    
}
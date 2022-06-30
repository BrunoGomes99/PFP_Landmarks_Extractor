# Landmarks Extractor

## Descrição
Ferramenta para extração de landmarks faciais contidas em vídeos no formato mp4. A aplicação visa auxiliar o processo de anotação de datasets de vídeos contendo rostos humanos a partir da extração de landmarks através de uma interface gráfica simples que salva os resultados obtidos em um arquivo json.

## Requisitos
Para a correta execução da ferramenta, é pré-requisito que o usuário tenha instalado no seu ambiente as tecnologias <a href="https://www.python.org/downloads/release/python-3810/">Python</a> (recomenda-se a versão 3.8.10, a mesma utilizada na aplicação) e o <a href="https://nodejs.org/pt-br/">NodeJS</a> na sua versão LTS (Long Term Support).

A instalação do Git é opcional, pois o usuário pode fazer o download do arquivo .zip contendo o código-fonte da ferramenta neste repositório. 

## Instalação
Entretanto, caso opte pela instalação, é necessário executar o comando abaixo para obter a aplicação:
```sh
$ git clone https://github.com/BrunoGomes99/PFP_Landmarks_Extractor.git
```
Uma vez feito o download da ferramenta, o usuário deverá abrir o diretório raiz do projeto no terminal utilizado seguindo o comando:
```sh
$ cd PFP_Landmarks_Extractor
```
Caso tenha feito apenas o download do .zip o comando para o diretório raiz será o seguinte:
```sh
$ cd PFP_Landmarks_Extractor-main
```
Após estar devidamente localizado no diretório raiz da ferramenta, o usuário deverá instalar os pacotes do NodeJS contendo as dependências do projeto através do comando abaixo:
```sh
$ npm install
```
Se tudo ocorrer da forma esperada, a pasta `node_modules` será criada no diretório da aplicação. Em seguida, será necessário instalar as dependências do Python a fim de que o script principal do programa execute corretamente. Para isso, bastará o usuário executar o comando:
```sh
$ pip install -qr ./src/py/requirements.txt
```
Uma vez executados todos os comandos acima, a configuração da ferramenta estará completa. Sendo assim, o usuário será capaz de executar a aplicação através do comando:
```sh
$ npm start
```
## Instruções de uso
A ferramenta exige do usuário apenas três parâmetros:
* **Diretório de origem**: caminho de um diretório que contenha pelo menos um vídeo no formato aceito pela ferramenta (mp4);
* **Diretório de destino**: caminho do diretório desejado para salvar o arquivo json com os resultados;
* **Intervalo de frames**: número inteiro positivo que irá determinar de quantos em quantos frames a ferramenta realizará uma extração de landmarks faciais nos vídeos carregados pelo usuário.

## Avisos Importantes
A quantidade de vídeos analisados por vez e o parâmetro de intervalo de frames implicam diretamente no tempo de processamento da ferramenta e na quantidade de landmarks extraídas.

Quanto maior o intervalo de frames, menos landmarks são extraídas e mais rápido será a execução do script, e vice-versa. Por exemplo, se um vídeo de 10 segundos e 30 frames por segundo (fps) tiver o intervalo de frames definido como 30. O mesmo terá no máximo 10 landmarks extraídas (300 frames divido por 30 frames).

Caso em um frame específico do vídeo não apareça rostos, as landmarks naquele frame serão ignoradas. Por fim, vale ressaltar que se o intervalo de frames for maior que a quantidade total de frames do vídeo apenas o primeiro frame será analisado, sendo então recomendado diminuir o intervalo de frames.

### [Documentação Completa](https://github.com/BrunoGomes99/PFP_Landmarks_Extractor/blob/main/PFP_Documentacao_Landmark_Extractor.pdf)
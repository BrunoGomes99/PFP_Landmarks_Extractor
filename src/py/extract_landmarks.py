# -*- coding: utf-8 -*-
"""
Autor: Bruno Gomes
Este script é responsável por gerar as landmarks dos vídeos .mp4
contidos no diretório informado pelo usuário e, em seguida, salvá-los
em um arquivo json.

"""
import sys                           # Importa chamadas de sistema
import os                            # Importa chamadas de sistema
import cv2                           # Importa biblioteca para visão computacional
import json                          # Importa biblioteca para manipulação de arquivos json
import glob                          # Importa sistema de arquivos
import argparse                      # Importa biblioteca para manipulação de argumentos
import numpy as np                   # Importa biblioteca numérica
from PIL import Image                # Importa biblioteca para manipulação de imagens
from facenet_pytorch import MTCNN    # Importa biblioteca para detecção facial

def extract_landmarks(path, batch_size):
    """
    Esta função recebe como entrada o caminho do diretório que contém os vídeos .mp4 selecionado
    pelo usuário e o intervalo de frames (batch_size). Dessa forma, a função irá percorrer 
    todos os vídeos no formato .mp4 que existem no diretório informado, realizando a detecção facial
    e extração de landmarks para cada um deles a cada x frames do vídeo (onde x é o intervalo de
    frames informado pelo usuário). A cada frame processado, as landmarks serão passadas para o
    método responsável por montar o arquivo json. Por fim, uma vez que as landmarks de todos os vídeos
    foram extraídas, o script retorna a variável dictionary contendo todas as informações coletadas.
    
    Quanto maior o batch_size, menos landmarks são extraídas e mais rápido será a execução do script,
    e vice-versa. Por exemplo, se um vídeo de 10 segundos e 30 frames por segundo (fps) tiver o batch_size
    definido como 30. O mesmo terá no máximo 10 landmarks extraídas (300 frames divido por 30 frames).
    Caso em um frame específico do vídeo não apareça rostos, as landmarks naquele frame serão ignoradas.
    Por fim, vale ressaltar que se o batch_size for maior que a quantidade total de frames do vídeo, 
    apenas o primeiro frame será analisado, sendo então recomendado diminuir o intervalo de frames.    
    
    [Argumentos]
        [string] path: caminho do diretório selecionado pelo usuário e que contém os vídeos .mp4 a serem processados.
        [int] batch_size: parâmetro cujo valor irá definir uma extração de landmarks a cada x intervalo de frames.        
      
    [Retorno]        
        [dict] dictionary: variável contendo o todas as landmarks extraídas de cada vídeo .mp4 do diretório informado.
    
    """    
    
    # Instancia o detector facial
    mtcnn = MTCNN(margin=40, keep_all=True, select_largest=False, post_process=False, thresholds=[0.95, 0.95, 0.95])
    
    dictionary = {}
    
    # Itera sobre cada vídeo .mp4 do diretório
    os.chdir(path)
    for video_path in glob.glob("*.mp4"):        
                
        # Recupera a quantidade total de frames no vídeo  
        v_cap = cv2.VideoCapture(video_path)
        v_len = int(v_cap.get(cv2.CAP_PROP_FRAME_COUNT))      
                        
        frames_extraidos = []
        frames = []        
        landmarks = []        
        view_landmarks = []
        
        # Itera sobre cada frame do vídeo
        for i in range(v_len):
            # Checa se o resto da divisão entre o frame atual e o batch_size é igual a zero
            if i % batch_size == 0:
                # Carrega o frame atual
                success, frame = v_cap.read()          
                
                if not success:                    
                    continue
                
                # Captura a imagem do frame atual
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frame = Image.fromarray(frame)
                
                # Detecta os rostos presentes no frame atual
                faces = mtcnn(frame)
                current_face = 1
                                
                # Se existe ao menos uma face no frame atual este será analisado,
                # caso contrário ele será ignorado
                if faces is not None:
                    # Itera sobre os rostos existentes no frame
                    for face in faces:
                        if face is not None:
                            
                            # Extrai as landmarks do rosto atual
                            frames.append(face.permute(1, 2, 0).int().numpy())                            
                            batch_boxes, _, batch_landmarks = mtcnn.detect(frames, landmarks=True)                            
                            landmarks.extend(batch_landmarks)                    
                            
                            # Checa se a landmark é válida
                            index = -1
                            if landmarks[index] is None:
                                continue
                                
                            # Salva o frame atual da extração
                            frames_extraidos.append(i)                           
                            
                            # Salva o id da pessoa e suas respectivas landmarks no frame atual
                            view_landmarks.append([current_face,landmarks[index]])
                                
                            frames = []
                            
                            current_face += 1
                            dictionary = save_landmarks(np.asarray(view_landmarks, dtype=object), np.asarray(frames_extraidos, dtype=object), video_path[:-4], dictionary)
                
    return dictionary
    
def save_landmarks(landmarks, frames_extraidos, nome_video, dictionary):    
    """
    Esta função é responsável por atualizar todas as landmarks extraídas até o momento corrente
    com as novas landmarks passadas como argumento na entrada da função, agrupando-as em uma variável
    dictionary com a formatação adequada para a posterior geração do arquivo json. Dessa forma, as landmarks
    são agrupadas por regiões faciais (olhos esquerdo e direito, nariz, canto esquerdo e canto direito da boca),
    número/id da pessoa, frame atual da extração e nome do vídeo.
    
    [Argumentos]
        [array numpy do tipo object] landmarks: coordenadas x e y dos pontos de referências faciais (landmarks) de cada pessoa detectada.
        [array numpy do tipo object] frames_extraidos: array contendo os frames onde cada extração foi realizada.
        [string] nome_video: nome do vídeo que está sendo processado.
        [dict] dictionary: variável contendo as landmarks extraídas até o momento atual de processamento.                           

    [Retorno]
        [dict] dictionary: variável contendo as landmarks devidamente formatadas e atualizadas com as landmarks correntes passadas na entrada.

    """
        
    value = {
            f"{nome_video}" : 
            [            
                {                                        
                    "person" : f"{landmark[0]}",
                    "frame" : f"{frame}",
                    "landmarks" : {
                        "left_eye": {
                            "x": f"{landmark[1][0][0][0]}",
                            "y": f"{landmark[1][0][0][1]}"
                        },
                        "right_eye": {
                            "x": f"{landmark[1][0][1][0]}",
                            "y": f"{landmark[1][0][1][1]}"
                        },
                        "nose": {
                            "x": f"{landmark[1][0][2][0]}",
                            "y": f"{landmark[1][0][2][1]}"
                        },
                        "mouth_left": {
                            "x": f"{landmark[1][0][3][0]}",
                            "y": f"{landmark[1][0][3][1]}"
                        },
                        "mouth_right": {
                            "x": f"{landmark[1][0][4][0]}",
                            "y": f"{landmark[1][0][4][1]}"
                        }
                    }                                            
                } for frame, landmark in zip(frames_extraidos, landmarks)
            ]
        }
    dictionary.update(value)
    
    return dictionary
        
if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Extrai landmarks das faces presentes nos videos")
    parser.add_argument("--path-dir", type=str, required=True, help="caminho do diretorio contendo os vídeos")
    parser.add_argument("--path-destiny", type=str, required=True, help="caminho do diretorio de destino para salvar arquivo json")
    parser.add_argument("--batch-size", type=int, required=True, help="quantidade de quadros usados na extração de landmarks")
    
    args = parser.parse_args()
        
    # Chama a função principal passando os argumentos informados pelo usuário
    result = extract_landmarks(args.path_dir, args.batch_size)    
    
    # Checa se o dictionary retornou um json vazio
    if result == {}:
        # Se sim, retorna a mensagem abaixo
        sys.stdout.write("Nenhum rosto foi encontrado nos intervalos definidos. Tente intervalos mais curtos!")        
    else:
        # Caso contrário, salva as landmarks obtidas em um arquivo json na pasta de destino informada pelo usuário
        # e retorna mensagem de sucesso
        with open(f"{args.path_destiny}/landmarks.json", "w") as outfile:
            json.dump(result, outfile)        
        sys.stdout.write("Landmarks extraidas com sucesso.")
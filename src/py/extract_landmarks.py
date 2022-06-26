# -*- coding: utf-8 -*-
"""
Created on Thu Jun  2 09:50:28 2022

@author: Bruno
"""
import os
import cv2
import json
import glob
#import mtcnn
import argparse
import numpy as np
from PIL import Image
#from tqdm.notebook import tqdm
from facenet_pytorch import MTCNN
#from matplotlib import pyplot as plt

def extract_landmarks(path, batch_size):
    # Para retornar as bounding boxes e os landmarks, em vez de chamar o método mtcnn() diretamente, chame mtcnn.detect().
    
    # Create face detector
    #mtcnn = MTCNN(keep_all=True) # Nessa abordagem, não passamos o parâmetro margem, pois já é delimitada pelos bounding boxes
    mtcnn = MTCNN(margin=40, select_largest=False, post_process=False, thresholds=[0.95, 0.95, 0.95]) # Parâmetro margin
    
    dictionary = {}
    
    #os.chdir(path)
    #for video_path in glob.glob("*.mp4"):
    #for video_path in os.listdir(path):
    os.chdir(path)
    for video_path in glob.glob("*.mp4"):
        print(video_path)
        # Load a single image and display
        v_cap = cv2.VideoCapture(video_path) # Esse vídeo tem 1586 frames, olha o tqdm
        v_len = int(v_cap.get(cv2.CAP_PROP_FRAME_COUNT)) # Recupera o número de frames no vídeo        
        
        # Loop through video
        #batch_size = 64 # Extrai um frame a cada 64 frames
        batch_atual = 1
        frames_extraidos = []
        frames = []
        #boxes = []
        landmarks = []
        view_frames = []
        view_landmarks = []        
        for i in range(v_len):                         
            if i % batch_size == 0:                
                # Load frame
                success, frame = v_cap.read()          
                
                if not success:                    
                    continue
                
                # Add to batch, resizing for speed
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frame = Image.fromarray(frame)
                #frame = frame.resize([int(f * 0.25) for f in frame.size])
                #frames.append(frame)
                face = mtcnn(frame)        
                if face is not None:               
                    frames.append(face.permute(1, 2, 0).int().numpy())
                    
                # When batch is full, detect faces and reset batch list
                #if len(frames) >= batch_size:
                batch_boxes, _, batch_landmarks = mtcnn.detect(frames, landmarks=True)
                #boxes.extend(batch_boxes)
                landmarks.extend(batch_landmarks)
                    
                index = -1
                while landmarks[index] is None:
                    print(index)
                    index = index + 1
                frames_extraidos.append((batch_atual*batch_size) - (batch_size-index)) # Cálculo para descobrir qual o frame escolhido
                view_frames.append(frames[index]) # Pega o primeiro frame a cada 32 adicionados (que não seja None). Sim, ele usa -1 para o primeiro elemento, deixa assim
                #view_boxes.append(boxes[index])
                view_landmarks.append(landmarks[index])
                    
                frames = []
                batch_atual = batch_atual + 1            
                    
                dictionary = save_landmarks(np.asarray(view_landmarks), np.asarray(frames_extraidos), video_path[:-4], dictionary)
            
    return dictionary
    
def save_landmarks(landmarks, frames_extraidos, nome_video, dictionary):    
    #dictionary = {}
    # Confirmar se as coordenadas das landmarks correspondem a cade região do rosto (olho esq, dir, nariz, boca etc)
        
    value = {
            f"{nome_video}" : 
            [            
                {
                    "frame" : f"{frame}",
                    "landmarks" : {
                        "left_eye": {
                            "x": f"{landmark[0][0][0]}",
                            "y": f"{landmark[0][0][1]}"
                        },
                        "right_eye": {
                            "x": f"{landmark[0][1][0]}",
                            "y": f"{landmark[0][1][1]}"
                        },
                        "nose": {
                            "x": f"{landmark[0][2][0]}",
                            "y": f"{landmark[0][2][1]}"
                        },
                        "mouth_left": {
                            "x": f"{landmark[0][3][0]}",
                            "y": f"{landmark[0][3][1]}"
                        },
                        "mouth_right": {
                            "x": f"{landmark[0][4][0]}",
                            "y": f"{landmark[0][4][1]}"
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
        
    result = extract_landmarks(args.path_dir, args.batch_size)
    
    #result = save_landmarks(landmarks, frames)
    
    with open(f"{args.path_destiny}/landmarks.json", "w") as outfile: 
        json.dump(result, outfile)
"""
Autor: Bruno Gomes
Este script é responsável por realizar o teste na função principal do
script extract_landmarks.py.

"""
import sys                               # Importa chamadas de sistema
import warnings                          # Importa biblioteca de manipulação de warnings
import unittest                          # Importa biblioteca de testes do python
sys.path.append('../src')                # Referencia a pasta src
from py import extract_landmarks as land # Importa script de extração de landmarks


class Test(unittest.TestCase):
    def test_extract_landmarks(self):        
        """
        Teste da geração de landmarks. Checa se o script de extração de landmarks retorna um dictionary json esperado.
        """        
        warnings.filterwarnings("ignore")
        result = type(land.extract_landmarks("D:/Meus Documentos/Mestrado/Projeto Final de Programação/landmarks-extractor/test/videos", 64)).__name__
        self.assertEqual(result, 'dict')
          
if __name__ == '__main__':
    unittest.main()
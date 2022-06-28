import unittest
import extract_landmarks as land

class Test(unittest.TestCase):
    def test_extract_landmarks(self):
        """
        Teste da geração de landmarks
        """
        result = type(land.extract_landmarks("D:/Meus Documentos/Mestrado/Projeto Final de Programação/landmarks-extractor/src/py/teste", 64)).__name__
        self.assertEqual(result, 'dict')
          
if __name__ == '__main__':
    unittest.main()
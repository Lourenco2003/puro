"""Opcional: requer Python 3 e Pillow; não é necessário para executar o site."""
from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parent.parent
files = sorted((root / 'originals').glob('*.jpeg'))
# O índice preserva a ordem dos nomes no arquivo fornecido (ordem lexicográfica).
for index, source in enumerate(files):
    if index < 2:
        continue
    image = Image.open(source)
    image.thumbnail((1600, 1600))
    image.save(root / 'public' / 'images' / f'puro-{index:02}.webp', 'WEBP', quality=85)

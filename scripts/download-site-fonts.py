"""Download self-hosted font faces and preserve their original OFL licenses."""
from pathlib import Path
import re, urllib.request
root=Path(__file__).resolve().parent.parent
assets=root/'src/assets/fonts'; assets.mkdir(exist_ok=True)
def fetch(url):
 return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36'}),timeout=30).read()
faces=[]
families=[('Manrope','wght@400;500;600'),('Fraunces','ital,opsz,wght@0,72,400;1,72,400'),('Outfit','wght@800'),('Noto Sans Kannada','wght@400;700'),('Noto Sans Telugu','wght@700'),('Jost','wght@400'),('Cormorant Garamond','ital,wght@0,400;1,400')]
for family,axes in families:
 slug=family.lower().replace(' ','')
 css=fetch('https://fonts.googleapis.com/css2?family='+family.replace(' ','+')+':'+axes+'&display=swap').decode()
 for n,block in enumerate(re.findall(r'@font-face\s*\{[^}]+\}',css)):
  remote=re.search(r'url\(([^)]+)\)',block).group(1)
  style=re.search(r'font-style: ([^;]+)',block).group(1)
  weight=re.search(r'font-weight: ([^;]+)',block).group(1).replace(' ','-')
  extension='woff2' if 'woff2' in block else 'ttf'
  name=f'{slug}-{style}-{weight}'+('' if slug in ['manrope','fraunces'] else f'-{n}')+f'.{extension}'
  (assets/name).write_bytes(fetch(remote));faces.append(block.replace(remote,'./'+name))
 license_text=fetch(f'https://raw.githubusercontent.com/google/fonts/main/ofl/{slug}/OFL.txt').decode()
 (assets/f'{slug}-OFL.txt').write_text('\n'.join(line.rstrip() for line in license_text.splitlines())+'\n')
 print(f'{family} downloaded',flush=True)
(assets/'fonts.css').write_text('\n'.join(faces))
(assets/'README.md').write_text('Self-hosted fonts from Google Fonts (https://github.com/google/fonts/tree/main/ofl). Manrope and Fraunces are the approved site pairing. Outfit and Noto Sans Kannada/Telugu preserve the liquid identity; Jost and Cormorant Garamond are used only by the comparison preview. Each family includes its original SIL Open Font License. Download with python3 scripts/download-site-fonts.py.\n')

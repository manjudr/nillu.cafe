"""Create WOFF2 copies, with Latin subsets: pip install 'fonttools[woff]' first."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools import subset

assets = Path(__file__).resolve().parent.parent / 'src/assets/fonts'
for source in sorted(assets.glob('*.ttf')):
    font = TTFont(source)
    font.flavor = 'woff2'
    destination = source.with_suffix('.woff2')
    if source.name.startswith('noto'):
        # Preserve the complete Kannada/Telugu shaping tables and glyph coverage.
        font.save(destination)
    else:
        # The Latin faces retain Latin/extended Latin, punctuation, currency,
        # trademark and arrow symbols. Keep the original TTF for other scripts.
        options = subset.Options()
        options.flavor = 'woff2'
        options.recalc_timestamp = False
        latin = subset.load_font(str(source), options)
        selection = subset.Subsetter(options=options)
        selection.populate(unicodes=list(range(0x250)) + list(range(0x2000, 0x2c00)))
        selection.subset(latin)
        subset.save_font(latin, str(destination), options)
    print(f'{source.name}: {source.stat().st_size:,} → {destination.stat().st_size:,} bytes')
css = assets / 'fonts.css'
css.write_text(css.read_text().replace('.ttf)', '.woff2)').replace("format('truetype')", "format('woff2')"))

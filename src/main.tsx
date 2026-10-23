import './assets/fonts/fonts.css'
import './styles.css'
import './responsive.css'

const root = document.getElementById('root')!
if (root.hasChildNodes() && !new URLSearchParams(location.search).has('preview')) {
  // The production page is already readable. Enhance the small header/hero now;
  // load React and WebGL only for the interactive sections as they approach.
  void import('./lib/enhancePage').then(({ enhancePage }) => enhancePage())
} else {
  // Client-only development and the standalone animation studies.
  void import('./react-main')
}

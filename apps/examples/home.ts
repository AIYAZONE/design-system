import './styles/index.less';
import './main';
import pkg from '../../package.json' assert { type: 'json' };

const el = document.getElementById('versionNumber');
if (el && typeof pkg?.version === 'string') {
  el.textContent = `v${pkg.version}`;
}

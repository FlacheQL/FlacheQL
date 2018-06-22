import * as ReactDOM from 'react-dom/server';
import { default as getDataFromTree } from './getDataFromTree';
export function renderToStringWithData(component) {
    return getDataFromTree(component).then(function () { return ReactDOM.renderToString(component); });
}
//# sourceMappingURL=renderToStringWithData.js.map
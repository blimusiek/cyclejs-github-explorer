/** @jsx hJSX */
/*eslint-disable no-unused-vars*/
import {hJSX} from '@cycle/dom';
/*eslint-enable no-unused-vars*/


export default function FilesList ({DOM, props}) {
    const ROOT_REPO_PATH = '/';
    const PATH_SEPARATOR = '/';
    const BACK_SIGNAL = '..';

    const backClick$ = DOM.select('.go-back')
        .events('click')
        .do(ev => ev.preventDefault());

    const path$ = props.dirClick$
        .merge(backClick$.map(() => BACK_SIGNAL))
        .scan((p, c) => {
            // we need to reset path when someone changed repo
            if (null === c) return ROOT_REPO_PATH;
            if (BACK_SIGNAL === c) return p.split(PATH_SEPARATOR).slice(0, -1).join(PATH_SEPARATOR);
            return `${p}${PATH_SEPARATOR}${c}`;
        }, '')
        .map(path => path.replace('//', ROOT_REPO_PATH))
        .startWith(ROOT_REPO_PATH);

    const vtree$ = path$.map(path =>
        <div>
            <caption>{path}</caption>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="text-right">
                        {ROOT_REPO_PATH !== path ? <button className="btn btn-default btn-xs go-back">Go Back</button> : ''}
                    </th>
                </tr>
            </thead>
        </div>
    )

    return {
        DOM: vtree$,
        path$
    };
}

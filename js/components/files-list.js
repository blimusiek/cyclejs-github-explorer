/** @jsx hJSX */
/*eslint-disable no-unused-vars*/
import {hJSX} from '@cycle/dom';
/*eslint-enable no-unused-vars*/

export default function FilesList ({HTTP, props$}) {
    const GITHUB_SEARCH_API = 'https://api.github.com/repos/';

    const request$ = props$.map(name => `${GITHUB_SEARCH_API}${name}/contents`);
    const vtree$ = HTTP
        .flatMap(x => x)
        .map(res => res.body)
        .map(files => files.sort((a, b) => {
            if (a.type > b.type) return 1;
            if (a.type < b.type) return -1;
            return 0;
        }))
        .startWith([])
        .map(files => 
            <div className="row">
                <div className="col-md-12">
                    <table className="table">
                        <caption>/</caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th className="text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {files
                                .map(file =>
                                    <tr>
                                        <td>{file.name}</td>
                                        <td className="text-right"></td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    return {
        DOM: vtree$,
        HTTP: request$
    };
}

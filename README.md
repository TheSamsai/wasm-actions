# WASM Actions - platform for deploying WASM web workloads

WASM Actions is a pseudo-serverless platform intended to allow
developers to develop HTTP endpoint handlers in WebAssembly. WASM
Actions is being developed as part of a University of Helsinki Full
Stack Project course.

## How this project is structured

This project consists of two main pieces: the `backend` and the `frontend`.
Both are located in this repository under their respective directories.

The backend is a basic Express.js backend that implements the APIs required
to perform user authentication, WASM workload management and execution of
those workloads.

The frontend is a React application which provides an SPA (single-page-application)
dashboard for managing WASM Actions in the browser.

## Documentation

[User Guide](https://github.com/TheSamsai/wasm-actions/blob/main/docs/user-guide.md)

[Setup and developer guide](https://github.com/TheSamsai/wasm-actions/blob/main/docs/setup-guide.md)

## License

![AGPLv3 Logo](https://www.gnu.org/graphics/agplv3-with-text-162x68.png)

This project is licensed under the GNU Affero General Public License
version 3.0.  You can find the license terms under the LICENSE
file. But, in a nutshell, you can freely use the software for any
purpose, study and modify it and share with others. However,
modified versions must be accompanied with the source code and
be provided under the same or compatible license.

You must also provide the source code under the same or compatible
license for users if you deploy modified versions of the software for
them.

Note that these license terms do not affect any HTTP endpoint handlers
deployed onto a running instance of the platform. Deployments of WASM
endpoints are considered separate to the WASM Actions software itself.

## Try it out

TODO!

## Timekeeping and TODO

The tasks and timekeeping of this project are tracked in the `todo.org` file.
However, due to GitHub's exceptionally poor org-mode handling, the timekeeping
reports will be available in Markdown format.

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">
<caption class="t-above"><span class="table-number">Table 1:</span> Clock summary at <span class="timestamp-wrapper"><span class="timestamp">[2022-09-05 ma 19:32]</span></span></caption>

<colgroup>
<col  class="org-left" />

<col  class="org-right" />

<col  class="org-right" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Headline</th>
<th scope="col" class="org-right">Time</th>
<th scope="col" class="org-right">&#xa0;</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left"><b>Total time</b></td>
<td class="org-right"><b>2:14</b></td>
<td class="org-right">&#xa0;</td>
</tr>
</tbody>

<tbody>
<tr>
<td class="org-left">WASM Actions</td>
<td class="org-right">2:14</td>
<td class="org-right">&#xa0;</td>
</tr>


<tr>
<td class="org-left">&ensp;&ensp;Set up development environment</td>
<td class="org-right">&#xa0;</td>
<td class="org-right">0:56</td>
</tr>


<tr>
<td class="org-left">&ensp;&ensp;Define project goals</td>
<td class="org-right">&#xa0;</td>
<td class="org-right">0:49</td>
</tr>


<tr>
<td class="org-left">&ensp;&ensp;Set up testing frameworks for&#x2026;</td>
<td class="org-right">&#xa0;</td>
<td class="org-right">0:17</td>
</tr>


<tr>
<td class="org-left">&ensp;&ensp;Create initial README</td>
<td class="org-right">&#xa0;</td>
<td class="org-right">0:12</td>
</tr>
</tbody>
</table>


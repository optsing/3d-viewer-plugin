import './app.css';

import moment from 'moment';

import * as Api from 'scada-plugin-api';

import Plotly from 'plotly.js/lib/core';
import Plotly_ru from 'plotly.js/lib/locales/ru';

Plotly.register([
    Plotly_ru,
]);

const date_to = moment();
const date_from = date_to.clone().subtract(1, 'day');

async function main () {
    const devices: { [dev_id: string]: { title: string, vars: string[]; } } = {
        dtv1: {
            title: 'ДТВ1',
            vars: ['temp'],
        },
        dtv2: {
            title: 'ДТВ2',
            vars: ['temp'],
        },
        dtv3: {
            title: 'ДТВ3',
            vars: ['temp'],
        },
    };
    const device_ids = ['dtv1', 'dtv2', 'dtv3'];

    const results = await Promise.all(
        Object.entries(devices).map(([device_id, device_data]) =>
            Api.getDeviceArchiveData(
                device_id,
                device_data.vars,
                date_from.format('YYYY-MM-DD HH:mm:ss'),
                date_to.format('YYYY-MM-DD HH:mm:ss'),
                {
                    period: 120,
                },
            )
        ),
    );

    const traces: Partial<Plotly.PlotData>[] = [];

    results.forEach((result, ind) => {
        for (const var_id in result) {
            const var_data = result[var_id];
            const device_id = device_ids[ind];
            const trace: Partial<Plotly.PlotData> = {
                x: var_data.x,
                y: var_data.y,
                mode: 'lines',
                line: {
                    width: 3,
                    shape: 'spline',
                },
                name: `${devices[device_id].title}, Температура`,
            };
            traces.push(trace);
        }
    });

    await Plotly.newPlot('chart', traces, {
        showlegend: false,
        xaxis: {
            type: 'date',
            gridcolor: '#ddd',
            autorange: true,
        },
        yaxis: {
            ticksuffix: '°C'
        },
        margin: {
            t: 10, b: 50,
            l: 50, r: 10,
            pad: 5
        }
    }, {
        responsive: true,
        scrollZoom: true,
        displayModeBar: false,
        locale: 'ru',
    });
}

main();
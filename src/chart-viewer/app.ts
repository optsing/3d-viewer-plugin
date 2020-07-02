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
    const settings = await Api.loadSettings() as {
        devices: string[];
    };

    // const devices: { [dev_id: string]: { title: string, vars: string[]; } } = {
    //     dtv1: {
    //         title: 'ДТВ1',
    //         vars: ['temp'],
    //     },
    //     dtv2: {
    //         title: 'ДТВ2',
    //         vars: ['temp'],
    //     },
    //     dtv3: {
    //         title: 'ДТВ3',
    //         vars: ['temp'],
    //     },
    //     dtv4: {
    //         title: 'ДТВ4',
    //         vars: ['temp'],
    //     },
    //     dtv5: {
    //         title: 'ДТВ5',
    //         vars: ['temp'],
    //     },
    //     dtv6: {
    //         title: 'ДТВ6',
    //         vars: ['temp'],
    //     },
    //     dtv7: {
    //         title: 'ДТВ7',
    //         vars: ['temp'],
    //     },
    //     dtv8: {
    //         title: 'ДТВ8',
    //         vars: ['temp'],
    //     },
    //     dtv9: {
    //         title: 'ДТВ9',
    //         vars: ['temp'],
    //     },
    //     dtv10: {
    //         title: 'ДТВ10',
    //         vars: ['temp'],
    //     },
    //     dtv11: {
    //         title: 'ДТВ11',
    //         vars: ['temp'],
    //     },
    //     dtv12: {
    //         title: 'ДТВ12',
    //         vars: ['temp'],
    //     },
    // };
    const device_ids = settings.devices;

    const results = await Promise.all(
        device_ids.map((device_id) =>
            Api.getDeviceArchiveData(
                device_id,
                ['temp'],
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
                name: `${device_id}, Температура`,
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
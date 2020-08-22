import 'normalize.css';
import './app.css';

import { format, subMinutes } from 'date-fns';
import qs from 'qs';

import * as Api from 'scada-plugin-api';

import Plotly from 'plotly.js/lib/core';

// @ts-ignore
import ru_locale from 'plotly.js/lib/locales/ru';
// @ts-ignore
Plotly.register(ru_locale);

async function main () {
    const { devices, period = '1440', step = '120' } = qs.parse(location.search, { ignoreQueryPrefix: true }) as { [key: string]: string };

    const device_ids: string[] = devices.split(',');
    await Api.updateUrl({
        path: device_ids.join(','),
    });
    const device_definitions = await Api.loadDevicesDefinitions(device_ids);

    const date_to = new Date();
    const date_from = subMinutes(date_to, Number.parseInt(period));

    const step_number = Number.parseInt(step);

    const results = await Promise.all(
        device_ids.map(device_id =>
            Api.loadDeviceArchiveData(
                device_id,
                ['temp'],
                format(date_from, 'yyyy-MM-dd HH:mm:ss'),
                format(date_to, 'yyyy-MM-dd HH:mm:ss'),
                {
                    step: step_number,
                },
            )
        ),
    );

    const traces: Partial<Plotly.PlotData>[] = [];

    results.forEach((result, ind) => {
        for (const var_id in result) {
            const var_data = result[var_id];
            const device_id = device_ids[ind];
            const device_title = device_id in device_definitions ? device_definitions[device_id].title : device_id;
            const trace: Partial<Plotly.PlotData> = {
                x: var_data.x,
                y: var_data.y,
                mode: 'lines',
                line: {
                    width: 3,
                    shape: 'spline',
                },
                name: `${device_title}, Температура`,
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
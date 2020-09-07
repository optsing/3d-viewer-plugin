import 'normalize.css';
import './app.css';

import { format, subMinutes } from 'date-fns';
import { ru } from 'date-fns/locale';
import qs from 'qs';

import * as Api from 'scada-plugin-api';

import Chart from 'chart.js';

import 'chartjs-adapter-date-fns';
import 'chartjs-plugin-zoom';
import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes';
// @ts-ignore
import { Aspect6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';

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

    const datasets: Partial<Chart.ChartDataSets>[] = [];

    results.forEach((result, ind) => {
        for (const var_id in result) {
            const var_data = result[var_id];
            const device_id = device_ids[ind];
            const device_title = device_id in device_definitions ? device_definitions[device_id].title : device_id;
            const dataset: Partial<Chart.ChartDataSets> = {
                label: `${device_title}, Температура`,
                data: var_data.x.map((x, i) => ({ x, y: var_data.y[i] })),
                fill: false,
                cubicInterpolationMode: 'monotone',
            };
            datasets.push(dataset);
        }
    });

    // @ts-ignore
    const canvas: HTMLCanvasElement = document.getElementById('myChart');

    // const annotation = {
    //     annotations: [{
    //         type: 'line',
    //         mode: 'vertical',
    //         scaleID: 'x-axis',
    //         borderColor: '#b6fcd5',
    //         borderWidth: 2,
    //         value: new Date(),
    //     }]
    // };

    const chart = new Chart('myChart', {
        type: 'line',
        data: {
            datasets,
        },
        options: {
            tooltips: {
                mode: 'x',
                intersect: false,
                callbacks: {
                    label (tooltipItems, data) {
                        // @ts-ignore
                        const label = data.datasets[tooltipItems.datasetIndex].label;
                        return `${label} — ${tooltipItems.yLabel}°C`;
                    },
                },
                itemSort (a, b) {
                    // @ts-ignore
                    return a.y - b.y;
                },
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        tooltipFormat: 'dd MMMM yyyy HH:mm:ss',
                        displayFormats: {
                            hour: 'HH:mm',
                            minute: 'HH:mm',
                            second: 'HH:mm:ss',
                        }
                    },
                    // @ts-ignore
                    adapters: {
                        date: {
                            locale: ru,
                        },
                    },
                }],
                yAxes: [{
                    ticks: {
                        callback (value) {
                            return `${value}°C`;
                        },
                    },
                }]
            },
            legend: {
                display: false,
            },
            // annotation,
            plugins: {
                colorschemes: {
                    scheme: Aspect6
                },
                zoom: {
                    zoom: {
                        // Boolean to enable zooming
                        enabled: true,

                        // Enable drag-to-zoom behavior
                        drag: {
                            backgroundColor: 'rgba(51,51,51,0.2)',
                        },

                        mode: 'x',
                    }
                },
            },
            maintainAspectRatio: false,
        }
    });

    canvas.addEventListener('dblclick', () => {
        // @ts-ignore
        chart.resetZoom();
    });
    // canvas.addEventListener('mousemove', e => {
        // const [point] = chart.getElementsAtXAxis(e);
        // if (point) {
        //     // @ts-ignore
        //     annotation.annotations[0].value = new Date(chart.data.datasets[point._datasetIndex].data[point._index]);
        //     chart.update();
        // }
    // });
}

main();
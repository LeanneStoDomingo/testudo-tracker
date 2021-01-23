import React from 'react'
import { Line } from 'react-chartjs-2'

const LineChart = ({ data }) => {

    return (
        <div style={{ position: 'relative', height: '60vh' }}>
            <Line
                data={{
                    labels: [...Array(data.num_sections.length).keys()],
                    datasets: [
                        {
                            label: 'Total',
                            backgroundColor: 'rgb(73, 170, 243)',
                            borderColor: 'rgb(73, 170, 243)',
                            data: data.seats.total_seats,
                            lineTension: 0.1,
                            fill: false
                        },
                        {
                            label: 'Open',
                            backgroundColor: 'rgb(67, 230, 105)',
                            borderColor: 'rgb(67, 230, 105)',
                            data: data.seats.open_seats,
                            lineTension: 0.1,
                            fill: false
                        },
                        {
                            label: 'Waitlist',
                            backgroundColor: 'rgb(230, 67, 67)',
                            borderColor: 'rgb(230, 67, 67)',
                            data: data.seats.waitlist_seats,
                            lineTension: 0.1,
                            fill: false
                        },
                        {
                            label: 'Holdfile',
                            backgroundColor: 'rgb(153, 67, 230)',
                            borderColor: 'rgb(153, 67, 230)',
                            data: data.seats.holdfile_seats,
                            lineTension: 0.1,
                            fill: false
                        },
                    ]
                }}
                options={{
                    maintainAspectRatio: false,
                    elements: {
                        point: {
                            radius: 0
                        }
                    },
                    tooltips: {
                        intersect: false,
                        mode: 'index'
                    },
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: '# of Seats',
                                fontColor: 'black',
                                fontFamily: 'Rubik',
                                fontSize: 20
                            }
                        }],
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Day',
                                fontColor: 'black',
                                fontFamily: 'Rubik',
                                fontSize: 20
                            }
                        }],
                    },
                    legend: {
                        labels: {
                            fontColor: 'black',
                            fontFamily: 'Rubik'
                        }
                    }
                }}
            />
        </div>
    )
}

export default LineChart

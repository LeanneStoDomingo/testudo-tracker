import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const Chart = ({ seats }) => <Line data={{
    labels: [...Array(seats.total_seats.length).keys()],
    datasets: [
        {
            label: 'Total',
            backgroundColor: 'rgb(73, 170, 243)',
            borderColor: 'rgb(73, 170, 243)',
            data: seats.total_seats,
            lineTension: 0.1,
            fill: false
        },
        {
            label: 'Open',
            backgroundColor: 'rgb(67, 230, 105)',
            borderColor: 'rgb(67, 230, 105)',
            data: seats.open_seats,
            lineTension: 0.1,
            fill: false
        },
        {
            label: 'Waitlist',
            backgroundColor: 'rgb(230, 67, 67)',
            borderColor: 'rgb(230, 67, 67)',
            data: seats.waitlist_seats,
            lineTension: 0.1,
            fill: false
        },
        {
            label: 'Holdfile',
            backgroundColor: 'rgb(153, 67, 230)',
            borderColor: 'rgb(153, 67, 230)',
            data: seats.holdfile_seats,
            lineTension: 0.1,
            fill: false
        },
    ]
}} />

export default Chart

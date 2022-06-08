import { AxisOptions, Chart } from "react-charts";

interface ISeat {
  day: number;
  seats: number;
}

interface ISeries {
  label: string;
  data: ISeat[];
}

const primaryAxis: AxisOptions<ISeat> = {
  getValue: (datum) => datum.day,
};

const secondaryAxes: AxisOptions<ISeat>[] = [
  {
    getValue: (datum) => datum.seats,
  },
];

const SeatsChart: React.FC<{ data: ISeries[] }> = ({ data }) => {
  return (
    <div className="h-[50vh]">
      <Chart options={{ data, primaryAxis, secondaryAxes }} />
    </div>
  );
};

export default SeatsChart;

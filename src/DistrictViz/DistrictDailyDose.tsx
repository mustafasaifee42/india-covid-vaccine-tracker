import { timeFormat } from 'd3-time-format';
import { DataType } from '../types';
import BarGraphEl from '../Visualizations/BarGraphEl';
import DailyDoseVizForDistrict from '../Visualizations/DailyDoseVizForDistrict';

interface Props {
  districtData: DataType[];
  districtName: string;
  districtPopulation: number;
  windowWidth: number;
}

const StateDailyDose = (props: Props) => {
  const {
    districtData,
    districtName,
    districtPopulation,
    windowWidth,
  } = props;
  const formatTime = timeFormat('%B %d, %Y');
  return (
    <>
      <div className="container">
        In {districtName}, the total doses administerd by {formatTime(districtData[districtData.length - 1].date)} are <span className="bold tags">{new Intl.NumberFormat('en-US').format(districtData[districtData.length - 1].Cummilative_Total_Dose_Administered)}</span>.
        <br />
        <br />
        On {formatTime(districtData[districtData.length - 1].date)} <span className="bold tags">{new Intl.NumberFormat('en-US').format(districtData[districtData.length - 1].Delta_Total_Dose_Administered)}</span> doses were administered in {districtName}.
        <br />
        <br />
        Population of {districtName} is {new Intl.NumberFormat('en-US').format(districtPopulation)} (est. 2020).
        <br />
        <br />
        <span className="bold tags">{(districtData[districtData.length - 1].Cummilative_First_Dose_Administered * 100 / districtPopulation).toFixed(2)}%</span> of the population has been administered at least one dose and <span className="bold tags">{(districtData[districtData.length - 1].Cummilative_Second_Dose_Administered * 100 / districtPopulation).toFixed(2)}%</span> of the population has been fully vaccinated.
        <BarGraphEl
          data={
            [
              {
                value: districtData[districtData.length - 1].Cummilative_First_Dose_Administered - districtData[districtData.length - 1].Cummilative_Second_Dose_Administered,
                color: 'var(--primary-color-light)',
                key: 'Received 1 Dose:',
              },
              {
                value: districtData[districtData.length - 1].Cummilative_Second_Dose_Administered,
                color: 'var(--primary-color-dark)',
                key: 'Fully Vaccinated:',
              },
              {
                value: districtPopulation - districtData[districtData.length - 1].Cummilative_First_Dose_Administered,
                color: 'var(--light-gray)',
                key: 'Received No Doses:',
              },
            ]
          }
          totalValue={districtPopulation}
        />
        <div>
          Current rolling 7-day average of daily COVID-19 vaccines administered in {districtName} is <span className="bold tags">{new Intl.NumberFormat('en-US').format(parseFloat((districtData[districtData.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered']).toFixed(2)))}</span>.
          <br />
          <br />
          At this rate the whole population of {districtName} will have one dose of vaccine in <span className="bold tags">{(((districtPopulation - districtData[districtData.length - 1].Cummilative_First_Dose_Administered) / districtData[districtData.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered']) / 365).toFixed(1)} years</span> and fully vaccinated in next <span className="bold tags">{((((districtPopulation * 2 - districtData[districtData.length - 1].Cummilative_Total_Dose_Administered) / districtData[districtData.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered']) / 365).toFixed(1))} years</span>. To vaccinate 70% (threshold estimated for herd immunity) of population with one dose <span className="bold tags">{((((0.7 * districtPopulation) - districtData[districtData.length - 1].Cummilative_First_Dose_Administered) / districtData[districtData.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered']) / 365).toFixed(1)} years</span> will be needed.
        </div>
      </div>
      <br />
      <DailyDoseVizForDistrict
        data={districtData}
        windowWidth={windowWidth}
      />
    </>
  );
};

export default StateDailyDose;

import { timeFormat } from 'd3-time-format';
import { CountryStateWithDeltaDataType } from '../types';
import BarGraphEl from '../Visualizations/BarGraphEl';
import DailyDoseViz from '../Visualizations/DailyDoseViz';

interface Props {
  statesData: CountryStateWithDeltaDataType[];
  stateName: string;
  statePopulation: number;
  windowWidth: number;
}

const StateDailyDose = (props: Props) => {
  const {
    statesData,
    stateName,
    statePopulation,
    windowWidth,
  } = props;
  const formatTime = timeFormat('%B %d, %Y');
  return (
    <>
      <div className="container">
        In {stateName}, the total doses administerd by {formatTime(statesData[statesData.length - 1].Date)} are <span className="bold tags">{new Intl.NumberFormat('en-US').format(statesData[statesData.length - 1]['Total Doses Administered'])}</span>.
        <br />
        <br />
        On {formatTime(statesData[statesData.length - 1].Date)} <span className="bold tags">{new Intl.NumberFormat('en-US').format(statesData[statesData.length - 1]['Delta Doses Administered'])}</span> doses were administered in {stateName}.
        <br />
        <br />
        Population of {stateName} is {new Intl.NumberFormat('en-US').format(statePopulation)} (est. 2020).
        <br />
        <br />
        <span className="bold tags">{(statesData[statesData.length - 1]['Total Individuals Vaccinated'] * 100 / statePopulation).toFixed(2)}%</span> of the population has been administered at least one dose and <span className="bold tags">{(statesData[statesData.length - 1]['Second Dose Administered'] * 100 / statePopulation).toFixed(2)}%</span> of the population has been fully vaccinated.
        <BarGraphEl
          data={
            [
              {
                value: statesData[statesData.length - 1]['First Dose Administered'] - statesData[statesData.length - 1]['Second Dose Administered'],
                color: 'var(--primary-color-light)',
                key: 'Only 1 Dose:',
              },
              {
                value: statesData[statesData.length - 1]['Second Dose Administered'],
                color: 'var(--primary-color-dark)',
                key: 'Fully Vaccinated:',
              },
              {
                value: statePopulation - statesData[statesData.length - 1]['First Dose Administered'],
                color: 'var(--light-gray)',
                key: 'No Doses:',
              },
            ]
          }
          totalValue={statePopulation}
        />
        <div>
          Current rolling 7-day average of daily COVID-19 vaccines administered in {stateName} is <span className="bold tags">{new Intl.NumberFormat('en-US').format(parseFloat((statesData[statesData.length - 1]['7-day Average Doses Administered']).toFixed(2)))}</span>.
          <br />
          <br />
          At this rate the whole population of {stateName} will have one dose of vaccine in <span className="bold tags">{(((statePopulation - statesData[statesData.length - 1]['Total Individuals Vaccinated']) / statesData[statesData.length - 1]['7-day Average Doses Administered']) / 365).toFixed(1)} years</span> and fully vaccinated in next <span className="bold tags">{(((statePopulation * 2 - statesData[statesData.length - 1]['Total Doses Administered']) / statesData[statesData.length - 1]['7-day Average Doses Administered']) / 365).toFixed(1)} years</span>. To fully vaccinate 70% (threshold estimated for herd immunity) of population <span className="bold tags">{((((0.7 * 2 * statePopulation) - statesData[statesData.length - 1]['Total Doses Administered']) / statesData[statesData.length - 1]['7-day Average Doses Administered']) / 365).toFixed(1)} years</span> will be needed.
        </div>
        <br />
      </div>
      <DailyDoseViz
        data={statesData}
        windowWidth={windowWidth}
      />
    </>
  );
};

export default StateDailyDose;

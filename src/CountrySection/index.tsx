import { CountryStateWithDeltaDataType } from '../types';
import { INDIAPOPULATION } from '../Constants';
import { timeFormat } from 'd3-time-format';
import BarGraphEl from '../Visualizations/BarGraphEl';
import DailyDoseViz from '../Visualizations/DailyDoseViz';
import AreaGraph from '../Visualizations/AreaGraph';

interface Props {
  countryData: CountryStateWithDeltaDataType[];
  windowWidth: number;
}


const CountrySection = (props: Props) => {
  const { countryData, windowWidth } = props
  const formatTime = timeFormat('%B %d, %Y');
  return <>
    <div className="container">
      In India, the total doses administerd by {formatTime(countryData[countryData.length - 1].Date)} are <span className="bold tags">{new Intl.NumberFormat('en-US').format(countryData[countryData.length - 1]['Total Doses Administered'])}</span>, out of which <span className="bold tags">{new Intl.NumberFormat('en-US').format(countryData[countryData.length - 1]['First Dose Administered'])}</span> are first dose and <span className="bold tags">{new Intl.NumberFormat('en-US').format(countryData[countryData.length - 1]['Second Dose Administered'])}</span> are second dose. On {formatTime(countryData[countryData.length - 1].Date)} <span className="bold tags">{new Intl.NumberFormat('en-US').format(countryData[countryData.length - 1]['Delta Doses Administered'])}</span> doses were administered in India.
      <br />
      <br />
      <span className="bold tags">{(countryData[countryData.length - 1]['Total Individuals Vaccinated'] * 100 / INDIAPOPULATION).toFixed(2)}%</span> of the population has been administered at least one dose and <span className="bold tags">{(countryData[countryData.length - 1]['Second Dose Administered'] * 100 / INDIAPOPULATION).toFixed(2)}%</span> of the population has been fully vaccinated.
      <BarGraphEl
        data={
          [
            {
              value: countryData[countryData.length - 1]['First Dose Administered'] - countryData[countryData.length - 1]['Second Dose Administered'],
              color: 'var(--primary-color-light)',
              key: 'Vaccineated Only Once:',
            },
            {
              value: countryData[countryData.length - 1]['Second Dose Administered'],
              color: 'var(--primary-color-dark)',
              key: 'Fully Vaccinated:',
            },
            {
              value: INDIAPOPULATION - countryData[countryData.length - 1]['First Dose Administered'],
              color: 'var(--light-gray)',
              key: 'Not Vaccinated at all:',
            },
          ]
        }
        totalValue={INDIAPOPULATION}
      />
      The government of India announced that from May 1, 2021 everyone over the age of 18 will be elligible for vaccine.
      <BarGraphEl
        data={
          [
            {
              value: countryData[countryData.length - 1]['18-30 years (Age)'],
              color: 'var(--primary-color-very-light)',
              key: '18-30:',
            },
            {
              value: countryData[countryData.length - 1]['30-45 years (Age)'],
              color: 'var(--primary-color-light)',
              key: '30-45:',
            },
            {
              value: countryData[countryData.length - 1]['45-60 years (Age)'],
              color: 'var(--primary-color)',
              key: '45-60:',
            },
            {
              value: countryData[countryData.length - 1]['60+ years (Age)'],
              color: 'var(--primary-color-dark)',
              key: '60+ yrs:',
            },
            {
              value: countryData[countryData.length - 1]['Total Individuals Vaccinated'] - (countryData[countryData.length - 1]['18-30 years (Age)'] + countryData[countryData.length - 1]['30-45 years (Age)'] + countryData[countryData.length - 1]['45-60 years (Age)'] + countryData[countryData.length - 1]['60+ years (Age)']),
              color: 'var(--light-gray)',
              key: 'Age NA:',
            },
          ]
        }
        totalValue={countryData[countryData.length - 1]['Total Individuals Vaccinated']}
        title={'Age wise distribution of vaccine'}
      />
      <BarGraphEl
        data={
          [
            {
              value: countryData[countryData.length - 1]['Male(Individuals Vaccinated)'],
              color: '#8624f5',
              key: 'Males:',
            },
            {
              value: countryData[countryData.length - 1]['Female(Individuals Vaccinated)'],
              color: '#1fc3aa',
              key: 'Females:',
            },
            {
              value: countryData[countryData.length - 1]['Transgender(Individuals Vaccinated)'],
              color: '#176884',
              key: 'Third Gender:',
            },
            {
              value: countryData[countryData.length - 1]['Total Individuals Vaccinated'] - (countryData[countryData.length - 1]['Male(Individuals Vaccinated)'] + countryData[countryData.length - 1]['Female(Individuals Vaccinated)'] + countryData[countryData.length - 1]['Transgender(Individuals Vaccinated)']),
              color: 'var(--light-gray)',
              key: 'Sex NA:',
            },
          ]
        }
        totalValue={countryData[countryData.length - 1]['Total Individuals Vaccinated']}
        title={'Sex wise distribution of vaccine'}
      />
      <h3>Doses administered by day</h3>
      <div>
        In India, the total doses administerd on {formatTime(countryData[countryData.length - 1].Date)} were <span className="bold tags">{new Intl.NumberFormat('en-US').format(countryData[countryData.length - 1]['Delta Doses Administered'])}</span>, out of which <span className="bold tags">{new Intl.NumberFormat('en-US').format(countryData[countryData.length - 1]['Delta First Dose Administered'])}</span> were first dose and <span className="bold tags">{new Intl.NumberFormat('en-US').format(countryData[countryData.length - 1]['Delta Second Dose Administered'])}</span> were second dose.
        <br />
        <br />
        Current rolling 7-day average of daily COVID-19 vaccines administered is <span className="bold tags">{new Intl.NumberFormat('en-US').format(parseFloat((countryData[countryData.length - 1]['7-day Average Doses Administered']).toFixed(2)))}</span>. At this rate the whole population of India will have one dose of vaccine in <span className="bold tags">{(((INDIAPOPULATION - countryData[countryData.length - 1]['Total Individuals Vaccinated']) / countryData[countryData.length - 1]['7-day Average Doses Administered']) / 365).toFixed(1)} years</span> and fully vaccinated in next <span className="bold tags">{(((INDIAPOPULATION * 2 - countryData[countryData.length - 1]['Total Doses Administered']) / countryData[countryData.length - 1]['7-day Average Doses Administered']) / 365).toFixed(1)} years</span>. To vaccinate 70% (threshold estimated for herd immunity) of population with one dose <span className="bold tags">{((((0.7 * INDIAPOPULATION) - countryData[countryData.length - 1]['Total Individuals Vaccinated']) / countryData[countryData.length - 1]['7-day Average Doses Administered']) / 365).toFixed(1)} years</span> will be needed.
      </div>
      <br />
    </div>
    <DailyDoseViz
      windowWidth={windowWidth}
      data={countryData}
    />
    <br />
    <br />
    <div className="container">
      India has so far given doses of two approved vaccines - Covaxin and Covishield. Covaxin has been developed by Hyderabad-based Bharat Biotech International Ltd in association with the Indian Council of Medical Research (ICMR) and the National Institute of Virology (NIV). Covishield has been developed by the Oxford-AstraZeneca and is being manufactured by the Serum Institute of India (SII).
    </div>
    <br />
    <AreaGraph
      data={countryData}
      windowWidth={windowWidth}
    />
  </>
};

export default CountrySection;


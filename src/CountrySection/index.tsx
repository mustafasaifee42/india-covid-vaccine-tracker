import { CountryStateWithDeltaDataType } from '../types';
import { INDIAPOPULATION } from '../Constants';
import { timeFormat } from 'd3-time-format';
import BarGraphEl from '../Visualizations/BarGraphEl';
import DailyDoseViz from '../Visualizations/DailyDoseViz';
import AreaGraph from '../Visualizations/AreaGraph';
import styled from 'styled-components';
import _ from 'lodash';
import ProcurementData from '../data/procurementData.json';

interface Props {
  countryData: CountryStateWithDeltaDataType[];
  windowWidth: number;
}

const SubNote = styled.span`
  font-size: 16px;
  font-style: italic;
  font-weight: normal;
  color: var(--gray);
`

const SubNoteBody = styled.span`
  font-style: italic;
  color: var(--dark-gray);
`

const CountrySection = (props: Props) => {
  const { countryData, windowWidth } = props
  const formatTime = timeFormat('%B %d, %Y');
  const totalProcuremnt = _.sumBy(ProcurementData, 'Doses committed (in millions)')
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
              key: 'Only 1 Dose:',
            },
            {
              value: countryData[countryData.length - 1]['Second Dose Administered'],
              color: 'var(--primary-color-dark)',
              key: 'Fully Vaccinated:',
            },
            {
              value: INDIAPOPULATION - countryData[countryData.length - 1]['First Dose Administered'],
              color: 'var(--light-gray)',
              key: 'No Doses:',
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
              value: countryData[countryData.length - 1]['18-45 years (Age)'],
              color: 'var(--primary-color-light)',
              key: '18-45:',
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
              value: countryData[countryData.length - 1]['Total Individuals Vaccinated'] - (countryData[countryData.length - 1]['18-45 years (Age)'] + countryData[countryData.length - 1]['45-60 years (Age)'] + countryData[countryData.length - 1]['60+ years (Age)']),
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
    <div className="container">
      <h3>Vaccine Procurement <SubNote>Last Updated: 1 June 2021</SubNote></h3>
      India has so far given doses of three approved vaccines - CoviShield, Covaxin, and Sputnik V. CoviShield has been developed by the Oxford-AstraZeneca and is being manufactured by the Serum Institute of India (SII). Covaxin has been developed by Hyderabad-based Bharat Biotech International Ltd in association with the Indian Council of Medical Research (ICMR) and the National Institute of Virology (NIV). Sputnik V is developed by the Gamaleya Research Institute of Epidemiology and Microbiology in Russia.
      <br />
      <br />
      India has so far has finalised procurement of <span className="tags bold">{new Intl.NumberFormat('en-US').format(totalProcuremnt)} Million</span> doses of three approved vaccines <SubNoteBody>(this doesn't not include the 500 million doeses of Novavox vaccine as the procurement is unclear)</SubNoteBody>.
      <br />
      <br />
      The current procurement is sufficient to fully vaccinated <span className="bold tags">{(totalProcuremnt * 1000000 * 100 / (INDIAPOPULATION * 2)).toFixed(2)} %</span> of population of India i.e. <span className="bold tags">{(totalProcuremnt / 2)} Million</span> people since all the vaccines are 2 dose vaccines. <SubNoteBody>Note that procurement does not mean that vaccination has been delivered to India but it means that orders have been placed by India.</SubNoteBody>
      <BarGraphEl
        data={
          [
            {
              value: totalProcuremnt * 1000000,
              color: 'var(--primary-color-light)',
              key: 'Population Covered:',
            },
            {
              value: (INDIAPOPULATION * 2) - totalProcuremnt * 1000000,
              color: 'var(--light-gray)',
              key: 'Population Not Covered:',
            },
          ]
        }
        totalValue={INDIAPOPULATION * 2}
        title={'Population Covered'}
      />
      India has so far used <span className="tags bold">{new Intl.NumberFormat('en-US').format(countryData[countryData.length - 1]['Total Doses Administered'])} ({(countryData[countryData.length - 1]['Total Doses Administered'] * 100 / (totalProcuremnt * 1000000)).toFixed(2)}%)</span> doses out of the procured dosage.
      <BarGraphEl
        data={
          [
            {
              value: countryData[countryData.length - 1]['Total Doses Administered'],
              color: 'var(--primary-color-light)',
              key: 'Procured and used:',
            },
            {
              value: totalProcuremnt * 1000000 - countryData[countryData.length - 1]['Total Doses Administered'],
              color: 'var(--light-gray)',
              key: 'Produred but not used:',
            },
          ]
        }
        totalValue={totalProcuremnt * 1000000}
        title={'Dose Usage'}
      />
      With the current 7 days running average of vaccination the remaining procured vaccines with last <span className="bold tags">{new Intl.NumberFormat('en-US').format(Math.ceil((totalProcuremnt * 1000000 - countryData[countryData.length - 1]['Total Doses Administered']) / countryData[countryData.length - 1]['7-day Average Doses Administered']))}</span> more days.{' '}
      <SubNoteBody>
        Note the current stock of vaccine available with the government will last for less time as all the vaccines procured are not yet delivered.
        <br />
        <br />
        Please note procurement does not mean delivered, it just means thats the orders have been placed. So the no. of vaccines available is less than the no. procured.
        <br />
        <br />
        Also note there are some conflicting reports about some procurements. One of the order of 11 Million doses of AstraZeneca/Oxford CoviShield vaccine is based on Reuters and Livemint reports from January. However, there are other reports that suggest that number of doses ordered could be 56 Million.
      </SubNoteBody>
      <br />
      <br />
    India till now has administered <span className="bold tags">{new Intl.NumberFormat('en-US').format(countryData[countryData.length - 1]['Total CoviShield Administered'])}</span> doses of CoviShield, <span className="bold tags">{new Intl.NumberFormat('en-US').format(countryData[countryData.length - 1]['Total Covaxin Administered'])}</span> doses of Covaxin and <span className="bold tags">{new Intl.NumberFormat('en-US').format(countryData[countryData.length - 1]['Total Sputnik V Administered'])}</span> doses of Sputnuk V.
    </div>
    <br />
    <AreaGraph
      data={countryData}
      windowWidth={windowWidth}
    />
  </>
};

export default CountrySection;


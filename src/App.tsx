import { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { text, csv } from 'd3-request';
import { csvParseRows } from 'd3-dsv';
import { timeParse, timeFormat } from 'd3-time-format';
import _ from 'lodash';
import StateViz from './StateViz';
import DistrictViz from './DistrictViz';
import Loader from 'react-loader-spinner';
import { DataType, CityDataType, CountryStateDataType, CountryStateFormattedDataType, StateDataType, CountryStateWithDeltaDataType } from './types';
import CountrySection from './CountrySection';
import { INDIAPOPULATION, STATES } from './Constants';
import ReactGA from 'react-ga';
import { FacebookIcon, TwitterIcon, FacebookShareButton, TwitterShareButton } from 'react-share';

ReactGA.initialize('UA-197744587-1');
ReactGA.set({ anonymizeIp: true });
ReactGA.pageview('/');

const GlobalStyle = createGlobalStyle`
  :root {
    --white: #ffffff;
    --black: #2c2c2c;
    --dark-gray: #666666;
    --primary-color-very-light: #ffc282;
    --primary-color-light: #ff9f51;
    --primary-color: #ef5d09;
    --primary-color-dark: #ce440b;
    --primary-color-hover: #ce440b;
    --very-light-gray: #f6f6f6;
    --light-gray: #e5e5e5;
    --moderate-light-gray: #f1f1f1;
    --gray: #aaaaaa;
    --bg-color: #fafafa;
    --secondary-color: #7f8fa4;
    --tertiary-color: #bd304a;
  }

  .tags {
    background-color: var(--primary-color-light);
    padding: 2px 5px;
  }

  .react-dropdown-select-option{
    color:var(--black) !important;
    background-color:var(--primary-color-light) !important;
  }

  .react-dropdown-select-option-label, .react-dropdown-select-option-remove{
    font-weight: 400;
    background-color:var(--primary-color-light);
    padding: 5px;
  }

  ul{
    padding-left: 17px;
    margin: 0 0 20px 0;
  }

  body {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 16px;
    line-height: 2;
    color: var(--black);
    background-color: var(--bg-color);
    margin: 0;
    padding: 0 20px;
  }

  a {
    text-decoration: none;
    font-style: italic;
    color: var(--primary-color);
  }

  a:hover {
    font-weight: bold;
  }

  .bold{
    font-weight: 700;
  }

  h1 {
    margin: 0;
    font-weight: 700;
    font-size: 42px;
    line-height: 54px;
    font-family: IBM Plex Sans, sans-serif;
    color:var(--primary-color);
    text-align: center;
  }

  h3 {
    font-size: 22px;
    font-weight: 700;
    font-family: IBM Plex Sans, sans-serif;
    margin: 60px 0 20px 0;
  }

  h4 {
    font-size: 18px;
    font-weight: 700;
    font-family: IBM Plex Sans, sans-serif;
    margin: 0;
  }


  div.container {
    padding: 0 20px;
    max-width: 720px;
    margin: auto;
    font-size: 18px;
    line-height: 28px;
  }
  .selected {
    background-color: var(--light-gray);
    font-weight: 700;
  }

  .react-dropdown-select-content {
    padding: 10px;
    font-weight: 700;
  }

  .react-dropdown-select {
    border: 1px solid var(--black) !important;
  }
  .react-dropdown-select-dropdown-handle svg  {
    width: 36px !important;
    height: 36px !important;
    fill: var(--gray) !important;
  }

  .slider {
      overflow: hidden;
      width: 125px;
      -webkit-appearance: none;
      background-color: var(--light-gray);
      display: inline-block;
      border-radius: 10px;
      margin: 0 5px;
    }

  .slider::-webkit-slider-runnable-track {
    height: 12px;
    -webkit-appearance: none;
    color: var(--secondary-color);
  }

  .slider::-webkit-slider-thumb {
    width: 12px;
    height: 12px;
    -webkit-appearance: none;
    cursor: pointer;
    background: var(--primary-color);
    border-radius: 40px;
    box-shadow: -86px 0 0 80px var(--primary-color-very-light);
  }
`;

const Error = styled.div`
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  display: flex;
  border-radius: 4px;
  background-color: var(--light-gray);
  color: var(--black);
`

const VizDiv = styled.div`
  width: 100%;
  height: 500px;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const H1 = styled.h1`
  margin: 80px 20px;
`

const Footer = styled.div`
  background-color: var(--moderate-light-gray);
  margin: 60px -20px 0 -20px;
  font-size: 14px;
  line-height: 24px;
`

const EmailDiv = styled.div`
  background-color: var(--light-gray);
  padding: 15px 0;
  font-size: 16px;
  text-align: center;
  button {
    margin: 10px 5px 5px 5px;
  }
`

const FooterContainer = styled.div`
  max-width: 960px;
  padding: 20px;
  margin: auto;
`

const ShareDiv = styled.div`
  margin-top: 15px;
`

const BoldSpan = styled.div`
  font-weight: 700;
  margin: 10px 0;
`

function App() {
  const [districtData, setDistrictData] = useState<CityDataType[] | undefined>(undefined);
  const [stateData, setStateData] = useState<StateDataType[] | undefined>(undefined);
  const [countryData, setCountryData] = useState<CountryStateWithDeltaDataType[] | undefined>(undefined);
  const [error, setError] = useState(false);
  const [width, setWidth] = useState(window.innerWidth > 940 ? 900 : window.innerWidth - 40);
  const formatTime = timeFormat('%B %d, %Y');
  window.addEventListener('resize', () => {
    setWidth(window.innerWidth > 940 ? 900 : window.innerWidth - 40);
  })
  useEffect(() => {
    text('https://api.covid19india.org/csv/latest/cowin_vaccine_data_districtwise.csv', (err, d) => {
      if (err) setError(true)
      else {
        const parseTime = timeParse('%d/%m/%Y');
        const dataParsed = csvParseRows(d)
        const dates: string[] = [];
        const parameters: string[] = [];
        for (let i = 6; i < 16; i++) {
          parameters.push(dataParsed[1][i])
        }
        for (let i = 6; i < dataParsed[0].length; i++) {
          if (dates.indexOf(dataParsed[0][i]) === -1) dates.push(dataParsed[0][i])
        }

        const dataAsJson: CityDataType[] = []

        const cityList: string[] = [];
        const cityRepeated: string[] = [];
        const statesList: string[] = [];
        _.remove(dataParsed, (c: string[]) => c[5] === 'Lakshadweep' && c[0] === '')
        dataParsed.forEach((el: string[], s: number) => {
          el.forEach((c: string, t: number) => {
            if (c === '') dataParsed[s][t] = '0';
          })
        })
        for (let i = 2; i < dataParsed.length; i++) {
          const dataTemp: DataType[] = []
          const disctrictName = dataParsed[i][5];
          let endIndex = dates.length;
          for (let j = dates.length; j--; j > 0) {
            if (dataParsed[i][(j * 10) + 6] !== '0' && dataParsed[i][(j * 10) + 6] !== '') break
            else endIndex = j;
          }
          const datesCropped: string[] = _.dropRight(dates, dates.length - endIndex)
          if (cityList.indexOf(disctrictName) === -1) cityList.push(disctrictName)
          else cityRepeated.push(disctrictName)
          if (statesList.indexOf(dataParsed[i][2]) === -1) statesList.push(dataParsed[i][2])
          for (let k = 0; k < datesCropped.length; k++) {
            dataTemp.push({
              date: parseTime(dates[k]) as Date,
              Cummilative_Individuals_Registered: +dataParsed[i][(k * 10) + 6],
              Cummilative_Sessions_Conducted: +dataParsed[i][(k * 10) + 7],
              Total_Sites: +dataParsed[i][(k * 10) + 8],
              Cummilative_First_Dose_Administered: +dataParsed[i][(k * 10) + 9],
              Cummilative_Second_Dose_Administered: +dataParsed[i][(k * 10) + 10],
              Cummilative_Total_Dose_Administered: parseInt(dataParsed[i][(k * 10) + 9], 10) + parseInt(dataParsed[i][(k * 10) + 10], 10),
              Cummilative_Male_Individuals_Vaccinated: +dataParsed[i][(k * 10) + 11],
              Cummilative_Female_Individuals_Vaccinated: +dataParsed[i][(k * 10) + 12],
              Cummilative_Transgender_Individuals_Vaccinated: +dataParsed[i][(k * 10) + 13],
              Cummilative_Covaxin_Administered: +dataParsed[i][(k * 10) + 14],
              Cummilative_CoviShield_Administered: +dataParsed[i][(k * 10) + 15],
              Delta_First_Dose_Administered: k === 0 ? parseInt(dataParsed[i][(k * 10) + 9], 10) : parseInt(dataParsed[i][(k * 10) + 9], 10) - parseInt(dataParsed[i][((k - 1) * 10) + 9], 10),
              Delta_Second_Dose_Administered: k === 0 ? parseInt(dataParsed[i][(k * 10) + 10], 10) : parseInt(dataParsed[i][(k * 10) + 10], 10) - parseInt(dataParsed[i][((k - 1) * 10) + 10], 10),
              Delta_Total_Dose_Administered: k === 0 ? parseInt(dataParsed[i][(k * 10) + 9], 10) + parseInt(dataParsed[i][(k * 10) + 10], 10) : parseInt(dataParsed[i][(k * 10) + 9], 10) + parseInt(dataParsed[i][(k * 10) + 10], 10) - (parseInt(dataParsed[i][((k - 1) * 10) + 9], 10) + parseInt(dataParsed[i][((k - 1) * 10) + 10], 10)),
              Delta_Male_Individuals_Vaccinated: k === 0 ? parseInt(dataParsed[i][(k * 10) + 11], 10) : parseInt(dataParsed[i][(k * 10) + 11], 10) - parseInt(dataParsed[i][((k - 1) * 10) + 11], 10),
              Delta_Female_Individuals_Vaccinated: k === 0 ? parseInt(dataParsed[i][(k * 10) + 12], 10) : parseInt(dataParsed[i][(k * 10) + 12], 10) - parseInt(dataParsed[i][((k - 1) * 10) + 12], 10),
              Delta_Transgender_Individuals_Vaccinated: k === 0 ? parseInt(dataParsed[i][(k * 10) + 13], 10) : parseInt(dataParsed[i][(k * 10) + 13], 10) - parseInt(dataParsed[i][((k - 1) * 10) + 13], 10),
              Delta_Covaxin_Administered: k === 0 ? parseInt(dataParsed[i][(k * 10) + 14], 10) : parseInt(dataParsed[i][(k * 10) + 14], 10) - parseInt(dataParsed[i][((k - 1) * 10) + 14], 10),
              Delta_CoviShield_Administered: k === 0 ? parseInt(dataParsed[i][(k * 10) + 15], 10) : parseInt(dataParsed[i][(k * 10) + 15], 10) - parseInt(dataParsed[i][((k - 1) * 10) + 15], 10),
              '7_Day_Ruuning_Avg_First_Dose_Administered': k < 7 ? parseInt(dataParsed[i][(k * 10) + 9], 10) / (k + 1) : (parseInt(dataParsed[i][(k * 10) + 9], 10) - parseInt(dataParsed[i][((k - 7) * 10) + 9], 10)) / 7,
              '7_Day_Ruuning_Avg_Second_Dose_Administered': k < 7 ? parseInt(dataParsed[i][(k * 10) + 10], 10) / (k + 1) : (parseInt(dataParsed[i][(k * 10) + 10], 10) - parseInt(dataParsed[i][((k - 7) * 10) + 10], 10)) / 7,
              '7_Day_Ruuning_Avg_Total_Dose_Administered': k < 7 ? (parseInt(dataParsed[i][(k * 10) + 9], 10) + parseInt(dataParsed[i][(k * 10) + 10], 10)) / (k + 1) : ((parseInt(dataParsed[i][(k * 10) + 9], 10) + parseInt(dataParsed[i][(k * 10) + 10], 10)) - (parseInt(dataParsed[i][((k - 7) * 10) + 9], 10) + parseInt(dataParsed[i][((k - 7) * 10) + 10], 10))) / 7,
            })
          }
          dataAsJson.push({
            State_Code: dataParsed[i][1],
            State: dataParsed[i][2],
            District_Key: dataParsed[i][3],
            Cowin_Key: dataParsed[i][4],
            District: disctrictName,
            data: dataTemp,
          })
        }

        const cityRepeatedCombined: CityDataType[] = []
        cityRepeated.forEach((city: string) => {
          const duplicateCityData = _.filter(dataAsJson, o => o.District === city);
          const dataCombined = []
          const len = duplicateCityData[0].data.length <= duplicateCityData[1].data.length ? duplicateCityData[0].data.length : duplicateCityData[1].data.length
          for (let k = 0; k < len; k++) {
            dataCombined.push({
              date: duplicateCityData[0].data[k].date,
              Cummilative_Individuals_Registered: duplicateCityData[0].data[k].Cummilative_Individuals_Registered + duplicateCityData[1].data[k].Cummilative_Individuals_Registered,
              Cummilative_Sessions_Conducted: duplicateCityData[0].data[k].Cummilative_Sessions_Conducted + duplicateCityData[1].data[k].Cummilative_Sessions_Conducted,
              Total_Sites: duplicateCityData[0].data[k].Total_Sites + duplicateCityData[1].data[k].Total_Sites,
              Cummilative_First_Dose_Administered: duplicateCityData[0].data[k].Cummilative_First_Dose_Administered + duplicateCityData[1].data[k].Cummilative_First_Dose_Administered,
              Cummilative_Second_Dose_Administered: duplicateCityData[0].data[k].Cummilative_Second_Dose_Administered + duplicateCityData[1].data[k].Cummilative_Second_Dose_Administered,
              Cummilative_Total_Dose_Administered: duplicateCityData[0].data[k].Cummilative_Total_Dose_Administered + duplicateCityData[1].data[k].Cummilative_Total_Dose_Administered,
              Cummilative_Male_Individuals_Vaccinated: duplicateCityData[0].data[k].Cummilative_Male_Individuals_Vaccinated + duplicateCityData[1].data[k].Cummilative_Male_Individuals_Vaccinated,
              Cummilative_Female_Individuals_Vaccinated: duplicateCityData[0].data[k].Cummilative_Female_Individuals_Vaccinated + duplicateCityData[1].data[k].Cummilative_Female_Individuals_Vaccinated,
              Cummilative_Transgender_Individuals_Vaccinated: duplicateCityData[0].data[k].Cummilative_Transgender_Individuals_Vaccinated + duplicateCityData[1].data[k].Cummilative_Transgender_Individuals_Vaccinated,
              Cummilative_Covaxin_Administered: duplicateCityData[0].data[k].Cummilative_Covaxin_Administered + duplicateCityData[1].data[k].Cummilative_Covaxin_Administered,
              Cummilative_CoviShield_Administered: duplicateCityData[0].data[k].Cummilative_CoviShield_Administered + duplicateCityData[1].data[k].Cummilative_Individuals_Registered,
              Delta_First_Dose_Administered: k === 0 ? duplicateCityData[0].data[k].Cummilative_First_Dose_Administered + duplicateCityData[1].data[k].Cummilative_First_Dose_Administered : duplicateCityData[0].data[k].Cummilative_First_Dose_Administered - duplicateCityData[0].data[k - 1].Cummilative_First_Dose_Administered + duplicateCityData[1].data[k].Cummilative_First_Dose_Administered - duplicateCityData[1].data[k - 1].Cummilative_First_Dose_Administered,
              Delta_Second_Dose_Administered: k === 0 ? duplicateCityData[0].data[k].Cummilative_Second_Dose_Administered + duplicateCityData[1].data[k].Cummilative_Second_Dose_Administered : duplicateCityData[0].data[k].Cummilative_Second_Dose_Administered - duplicateCityData[0].data[k - 1].Cummilative_Second_Dose_Administered + duplicateCityData[1].data[k].Cummilative_Second_Dose_Administered - duplicateCityData[1].data[k - 1].Cummilative_Second_Dose_Administered,
              Delta_Total_Dose_Administered: k === 0 ? duplicateCityData[0].data[k].Delta_Total_Dose_Administered + duplicateCityData[1].data[k].Delta_Total_Dose_Administered : duplicateCityData[0].data[k].Delta_Total_Dose_Administered - duplicateCityData[0].data[k - 1].Delta_Total_Dose_Administered + duplicateCityData[1].data[k].Delta_Total_Dose_Administered - duplicateCityData[1].data[k - 1].Delta_Total_Dose_Administered,
              Delta_Male_Individuals_Vaccinated: k === 0 ? duplicateCityData[0].data[k].Delta_Male_Individuals_Vaccinated + duplicateCityData[1].data[k].Delta_Male_Individuals_Vaccinated : duplicateCityData[0].data[k].Delta_Male_Individuals_Vaccinated - duplicateCityData[0].data[k - 1].Delta_Male_Individuals_Vaccinated + duplicateCityData[1].data[k].Delta_Male_Individuals_Vaccinated - duplicateCityData[1].data[k - 1].Delta_Male_Individuals_Vaccinated,
              Delta_Female_Individuals_Vaccinated: k === 0 ? duplicateCityData[0].data[k].Delta_Female_Individuals_Vaccinated + duplicateCityData[1].data[k].Delta_Female_Individuals_Vaccinated : duplicateCityData[0].data[k].Delta_Female_Individuals_Vaccinated - duplicateCityData[0].data[k - 1].Delta_Female_Individuals_Vaccinated + duplicateCityData[1].data[k].Delta_Female_Individuals_Vaccinated - duplicateCityData[1].data[k - 1].Delta_Female_Individuals_Vaccinated,
              Delta_Transgender_Individuals_Vaccinated: k === 0 ? duplicateCityData[0].data[k].Delta_Transgender_Individuals_Vaccinated + duplicateCityData[1].data[k].Delta_Transgender_Individuals_Vaccinated : duplicateCityData[0].data[k].Delta_Transgender_Individuals_Vaccinated - duplicateCityData[0].data[k - 1].Delta_Transgender_Individuals_Vaccinated,
              Delta_Covaxin_Administered: k === 0 ? duplicateCityData[0].data[k].Delta_Covaxin_Administered + duplicateCityData[1].data[k].Delta_Covaxin_Administered : duplicateCityData[0].data[k].Delta_Covaxin_Administered - duplicateCityData[0].data[k - 1].Delta_Covaxin_Administered + duplicateCityData[1].data[k].Delta_Covaxin_Administered - duplicateCityData[1].data[k - 1].Delta_Covaxin_Administered,
              Delta_CoviShield_Administered: k === 0 ? duplicateCityData[0].data[k].Delta_CoviShield_Administered + duplicateCityData[1].data[k].Delta_CoviShield_Administered : duplicateCityData[0].data[k].Delta_CoviShield_Administered - duplicateCityData[0].data[k - 1].Delta_CoviShield_Administered + duplicateCityData[1].data[k].Delta_CoviShield_Administered - duplicateCityData[1].data[k - 1].Delta_CoviShield_Administered,
              '7_Day_Ruuning_Avg_First_Dose_Administered': k < 7 ? (duplicateCityData[0].data[k].Cummilative_First_Dose_Administered + duplicateCityData[1].data[k].Cummilative_First_Dose_Administered) / (k + 1) : ((duplicateCityData[0].data[k].Cummilative_First_Dose_Administered + duplicateCityData[1].data[k].Cummilative_First_Dose_Administered) - (duplicateCityData[0].data[k - 7].Cummilative_First_Dose_Administered + duplicateCityData[1].data[k - 7].Cummilative_First_Dose_Administered)) / 7,
              '7_Day_Ruuning_Avg_Second_Dose_Administered': k < 7 ? (duplicateCityData[0].data[k].Cummilative_Second_Dose_Administered + duplicateCityData[1].data[k].Cummilative_Second_Dose_Administered) / (k + 1) : ((duplicateCityData[0].data[k].Cummilative_Second_Dose_Administered + duplicateCityData[1].data[k].Cummilative_Second_Dose_Administered) - (duplicateCityData[0].data[k - 7].Cummilative_Second_Dose_Administered + duplicateCityData[1].data[k - 7].Cummilative_Second_Dose_Administered)) / 7,
              '7_Day_Ruuning_Avg_Total_Dose_Administered': k < 7 ? (duplicateCityData[0].data[k].Cummilative_Total_Dose_Administered + duplicateCityData[1].data[k].Cummilative_Total_Dose_Administered) / (k + 1) : ((duplicateCityData[0].data[k].Cummilative_Total_Dose_Administered + duplicateCityData[1].data[k].Cummilative_Total_Dose_Administered) - (duplicateCityData[0].data[k - 7].Cummilative_Total_Dose_Administered + duplicateCityData[1].data[k - 7].Cummilative_Total_Dose_Administered)) / 7,
            })
          }

          cityRepeatedCombined.push({
            State_Code: duplicateCityData[0].State_Code,
            State: duplicateCityData[0].State,
            District_Key: duplicateCityData[0].District_Key,
            Cowin_Key: [duplicateCityData[0].Cowin_Key as string, duplicateCityData[1].Cowin_Key as string],
            District: duplicateCityData[0].District,
            data: dataCombined,
          })
        })

        const removeDuplicateCities = _.filter(dataAsJson, o => cityRepeated.indexOf(o.District) === -1);
        const districtLevelData = _.sortBy(_.union(removeDuplicateCities, cityRepeatedCombined), [o => o.State])
        setDistrictData(districtLevelData);
      }
    })
  }, []);

  useEffect(() => {
    csv('https://api.covid19india.org/csv/latest/cowin_vaccine_data_statewise.csv', (err, d: any) => {
      if (err) {
        // tslint:disable-next-line: no-console
        console.error(err)
        setError(true)
      }
      else {
        const data: CountryStateDataType[] = d;
        const parseTime = timeParse('%d/%m/%Y');
        const statesList = _.remove(_.map(_.uniqBy(data, 'State'), 'State'), el => el !== 'India' && STATES.indexOf(el) !== -1);
        const countryFiltered = _.filter(data, (el: CountryStateDataType) => el.State === 'India');
        let endIndex = 0;
        for (let k = 0; k < countryFiltered.length; k++) {
          if (countryFiltered[k]['Total Doses Administered'] === '0' || countryFiltered[k]['Total Doses Administered'] === '') {
            endIndex = k;
            break;
          }
        }

        const countryDataTemp: CountryStateFormattedDataType[] = _.dropRight(_.filter(data, (el: CountryStateDataType) => el.State === 'India'), endIndex === 0 ? 0 : countryFiltered.length - endIndex).map((el: CountryStateDataType) => {
          return {
            '18-45 years (Age)': +el['18-45 years (Age)'],
            '45-60 years (Age)': +el['45-60 years (Age)'],
            '60+ years (Age)': +el['60+ years (Age)'],
            AEFI: +el.AEFI,
            'Female(Individuals Vaccinated)': +el['Female(Individuals Vaccinated)'],
            'First Dose Administered': +el['First Dose Administered'],
            'Male(Individuals Vaccinated)': +el['Male(Individuals Vaccinated)'],
            'Second Dose Administered': +el['Second Dose Administered'],
            'Total Covaxin Administered': +el['Total Covaxin Administered'],
            'Total CoviShield Administered': +el['Total CoviShield Administered'],
            'Total Sputnik V Administered': +el['Total Sputnik V Administered'],
            'Total Doses Administered': +el['Total Doses Administered'],
            'Total Individuals Vaccinated': +el['Total Individuals Vaccinated'],
            'Total Sessions Conducted': +el['Total Sessions Conducted'],
            'Total Sites ': +el['Total Sites '],
            'Transgender(Individuals Vaccinated)': +el['Transgender(Individuals Vaccinated)'],
            'Date': parseTime(el['Updated On']) as Date,
          }
        })

        const countryDataFinal: CountryStateWithDeltaDataType[] = countryDataTemp.map((el: CountryStateFormattedDataType, i: number) => {
          return {
            '18-45 years (Age)': el['18-45 years (Age)'],
            '45-60 years (Age)': el['45-60 years (Age)'],
            '60+ years (Age)': el['60+ years (Age)'],
            AEFI: el.AEFI,
            'Female(Individuals Vaccinated)': el['Female(Individuals Vaccinated)'],
            'First Dose Administered': el['First Dose Administered'],
            'Male(Individuals Vaccinated)': el['Male(Individuals Vaccinated)'],
            'Second Dose Administered': el['Second Dose Administered'],
            'Total Covaxin Administered': el['Total Covaxin Administered'],
            'Total CoviShield Administered': el['Total CoviShield Administered'],
            'Total Sputnik V Administered': el['Total Sputnik V Administered'],
            'Total Doses Administered': el['Total Doses Administered'],
            'Total Individuals Vaccinated': el['Total Individuals Vaccinated'],
            'Total Sessions Conducted': el['Total Sessions Conducted'],
            'Total Sites ': el['Total Sites '],
            'Transgender(Individuals Vaccinated)': el['Transgender(Individuals Vaccinated)'],
            'Date': el.Date,
            'Delta 18-45 years (Age)': i === 0 ? el['18-45 years (Age)'] : el['18-45 years (Age)'] - countryDataTemp[i - 1]['18-45 years (Age)'],
            'Delta 45-60 years (Age)': i === 0 ? el['45-60 years (Age)'] : el['45-60 years (Age)'] - countryDataTemp[i - 1]['45-60 years (Age)'],
            'Delta 60+ years (Age)': i === 0 ? el['60+ years (Age)'] : el['60+ years (Age)'] - countryDataTemp[i - 1]['60+ years (Age)'],
            'Delta Female(Individuals Vaccinated)': i === 0 ? el['Female(Individuals Vaccinated)'] : el['Female(Individuals Vaccinated)'] - countryDataTemp[i - 1]['Female(Individuals Vaccinated)'],
            'Delta First Dose Administered': i === 0 ? el['First Dose Administered'] : el['First Dose Administered'] - countryDataTemp[i - 1]['First Dose Administered'],
            'Delta Male(Individuals Vaccinated)': i === 0 ? el['Male(Individuals Vaccinated)'] : el['Male(Individuals Vaccinated)'] - countryDataTemp[i - 1]['Male(Individuals Vaccinated)'],
            'Delta Second Dose Administered': i === 0 ? el['Second Dose Administered'] : el['Second Dose Administered'] - countryDataTemp[i - 1]['Second Dose Administered'],
            'Delta Covaxin Administered': i === 0 ? el['Total Covaxin Administered'] : el['Total Covaxin Administered'] - countryDataTemp[i - 1]['Total Covaxin Administered'],
            'Delta CoviShield Administered': i === 0 ? el['Total CoviShield Administered'] : el['Total CoviShield Administered'] - countryDataTemp[i - 1]['Total CoviShield Administered'],
            'Delta Sputnik V Administered': i === 0 ? el['Total Sputnik V Administered'] : el['Total Sputnik V Administered'] - countryDataTemp[i - 1]['Total Sputnik V Administered'],
            'Delta Doses Administered': i === 0 ? el['Total Doses Administered'] : el['Total Doses Administered'] - countryDataTemp[i - 1]['Total Doses Administered'],
            'Delta Individuals Vaccinated': i === 0 ? el['Total Individuals Vaccinated'] : el['Total Individuals Vaccinated'] - countryDataTemp[i - 1]['Total Individuals Vaccinated'],
            'Delta Transgender(Individuals Vaccinated)': i === 0 ? el['Transgender(Individuals Vaccinated)'] : el['Transgender(Individuals Vaccinated)'] - countryDataTemp[i - 1]['Transgender(Individuals Vaccinated)'],
            '7-day Average 18-45 years (Age)': i < 7 ? el['18-45 years (Age)'] / (i + 1) : (el['18-45 years (Age)'] - countryDataTemp[i - 7]['18-45 years (Age)']) / 7,
            '7-day Average 45-60 years (Age)': i < 7 ? el['45-60 years (Age)'] / (i + 1) : (el['45-60 years (Age)'] - countryDataTemp[i - 7]['45-60 years (Age)']) / 7,
            '7-day Average 60+ years (Age)': i < 7 ? el['60+ years (Age)'] / (i + 1) : (el['60+ years (Age)'] - countryDataTemp[i - 7]['60+ years (Age)']) / 7,
            '7-day Average Female(Individuals Vaccinated)': i < 7 ? el['Female(Individuals Vaccinated)'] / (i + 1) : (el['Female(Individuals Vaccinated)'] - countryDataTemp[i - 7]['Female(Individuals Vaccinated)']) / 7,
            '7-day Average First Dose Administered': i < 7 ? el['First Dose Administered'] / (i + 1) : (el['First Dose Administered'] - countryDataTemp[i - 7]['First Dose Administered']) / 7,
            '7-day Average Male(Individuals Vaccinated)': i < 7 ? el['Male(Individuals Vaccinated)'] / (i + 1) : (el['Male(Individuals Vaccinated)'] - countryDataTemp[i - 7]['Male(Individuals Vaccinated)']) / 7,
            '7-day Average Second Dose Administered': i < 7 ? el['Second Dose Administered'] / (i + 1) : (el['Second Dose Administered'] - countryDataTemp[i - 7]['Second Dose Administered']) / 7,
            '7-day Average Covaxin Administered': i < 7 ? el['Total Covaxin Administered'] / (i + 1) : (el['Total Covaxin Administered'] - countryDataTemp[i - 7]['Total Covaxin Administered']) / 7,
            '7-day Average CoviShield Administered': i < 7 ? el['Total CoviShield Administered'] / (i + 1) : (el['Total CoviShield Administered'] - countryDataTemp[i - 7]['Total CoviShield Administered']) / 7,
            '7-day Average Sputnik V Administered': i < 7 ? el['Total Sputnik V Administered'] / (i + 1) : (el['Total Sputnik V Administered'] - countryDataTemp[i - 7]['Total Sputnik V Administered']) / 7,
            '7-day Average Doses Administered': i < 7 ? el['Total Doses Administered'] / (i + 1) : (el['Total Doses Administered'] - countryDataTemp[i - 7]['Total Doses Administered']) / 7,
            '7-day Average Individuals Vaccinated': i < 7 ? el['Total Individuals Vaccinated'] / (i + 1) : (el['Total Individuals Vaccinated'] - countryDataTemp[i - 7]['Total Individuals Vaccinated']) / 7,
            '7-day Average Transgender(Individuals Vaccinated)': i < 7 ? el['Transgender(Individuals Vaccinated)'] / (i + 1) : (el['Transgender(Individuals Vaccinated)'] - countryDataTemp[i - 7]['Transgender(Individuals Vaccinated)']) / 7,
          }
        })

        const statesData: StateDataType[] = statesList.map((state: string) => {
          let endIndexForState = 0;
          const stateFiltered = _.filter(data, (el: CountryStateDataType) => el.State === state);
          for (let k = 0; k < countryFiltered.length; k++) {
            if (stateFiltered[k]['Total Doses Administered'] === '0' || stateFiltered[k]['Total Doses Administered'] === '') {
              endIndexForState = k;
              break;
            }
          }
          const stateDataTemp: CountryStateFormattedDataType[] = _.dropRight(_.filter(data, (el: CountryStateDataType) => el.State === state), endIndexForState === 0 ? 0 : stateFiltered.length - endIndexForState).map((el: CountryStateDataType) => {
            return {
              '18-45 years (Age)': +el['18-45 years (Age)'],
              '45-60 years (Age)': +el['45-60 years (Age)'],
              '60+ years (Age)': +el['60+ years (Age)'],
              AEFI: +el.AEFI,
              'Female(Individuals Vaccinated)': +el['Female(Individuals Vaccinated)'],
              'First Dose Administered': +el['First Dose Administered'],
              'Male(Individuals Vaccinated)': +el['Male(Individuals Vaccinated)'],
              'Second Dose Administered': +el['Second Dose Administered'],
              'Total Covaxin Administered': +el['Total Covaxin Administered'],
              'Total CoviShield Administered': +el['Total CoviShield Administered'],
              'Total Sputnik V Administered': +el['Total Sputnik V Administered'],
              'Total Doses Administered': +el['Total Doses Administered'],
              'Total Individuals Vaccinated': +el['Total Individuals Vaccinated'],
              'Total Sessions Conducted': +el['Total Sessions Conducted'],
              'Total Sites ': +el['Total Sites '],
              'Transgender(Individuals Vaccinated)': +el['Transgender(Individuals Vaccinated)'],
              'Date': parseTime(el['Updated On']) as Date,
            }
          })

          const stateDataFinal: CountryStateWithDeltaDataType[] = stateDataTemp.map((el: CountryStateFormattedDataType, i: number) => {
            return {
              '18-45 years (Age)': el['18-45 years (Age)'],
              '45-60 years (Age)': el['45-60 years (Age)'],
              '60+ years (Age)': el['60+ years (Age)'],
              AEFI: el.AEFI,
              'Female(Individuals Vaccinated)': el['Female(Individuals Vaccinated)'],
              'First Dose Administered': el['First Dose Administered'],
              'Male(Individuals Vaccinated)': el['Male(Individuals Vaccinated)'],
              'Second Dose Administered': el['Second Dose Administered'],
              'Total Covaxin Administered': el['Total Covaxin Administered'],
              'Total CoviShield Administered': el['Total CoviShield Administered'],
              'Total Sputnik V Administered': el['Total Sputnik V Administered'],
              'Total Doses Administered': el['Total Doses Administered'],
              'Total Individuals Vaccinated': el['Total Individuals Vaccinated'],
              'Total Sessions Conducted': el['Total Sessions Conducted'],
              'Total Sites ': el['Total Sites '],
              'Transgender(Individuals Vaccinated)': el['Transgender(Individuals Vaccinated)'],
              'Date': el.Date,
              'Delta 18-45 years (Age)': i === 0 ? el['18-45 years (Age)'] : el['18-45 years (Age)'] - stateDataTemp[i - 1]['18-45 years (Age)'],
              'Delta 45-60 years (Age)': i === 0 ? el['45-60 years (Age)'] : el['45-60 years (Age)'] - stateDataTemp[i - 1]['45-60 years (Age)'],
              'Delta 60+ years (Age)': i === 0 ? el['60+ years (Age)'] : el['60+ years (Age)'] - stateDataTemp[i - 1]['60+ years (Age)'],
              'Delta Female(Individuals Vaccinated)': i === 0 ? el['Female(Individuals Vaccinated)'] : el['Female(Individuals Vaccinated)'] - stateDataTemp[i - 1]['Female(Individuals Vaccinated)'],
              'Delta First Dose Administered': i === 0 ? el['First Dose Administered'] : el['First Dose Administered'] - stateDataTemp[i - 1]['First Dose Administered'],
              'Delta Male(Individuals Vaccinated)': i === 0 ? el['Male(Individuals Vaccinated)'] : el['Male(Individuals Vaccinated)'] - stateDataTemp[i - 1]['Male(Individuals Vaccinated)'],
              'Delta Second Dose Administered': i === 0 ? el['Second Dose Administered'] : el['Second Dose Administered'] - stateDataTemp[i - 1]['Second Dose Administered'],
              'Delta Covaxin Administered': i === 0 ? el['Total Covaxin Administered'] : el['Total Covaxin Administered'] - stateDataTemp[i - 1]['Total Covaxin Administered'],
              'Delta CoviShield Administered': i === 0 ? el['Total CoviShield Administered'] : el['Total CoviShield Administered'] - stateDataTemp[i - 1]['Total CoviShield Administered'],
              'Delta Sputnik V Administered': i === 0 ? el['Total Sputnik V Administered'] : el['Total Sputnik V Administered'] - stateDataTemp[i - 1]['Total Sputnik V Administered'],
              'Delta Doses Administered': i === 0 ? el['Total Doses Administered'] : el['Total Doses Administered'] - stateDataTemp[i - 1]['Total Doses Administered'],
              'Delta Individuals Vaccinated': i === 0 ? el['Total Individuals Vaccinated'] : el['Total Individuals Vaccinated'] - stateDataTemp[i - 1]['Total Individuals Vaccinated'],
              'Delta Transgender(Individuals Vaccinated)': i === 0 ? el['Transgender(Individuals Vaccinated)'] : el['Transgender(Individuals Vaccinated)'] - stateDataTemp[i - 1]['Transgender(Individuals Vaccinated)'],
              '7-day Average 18-45 years (Age)': i < 7 ? el['18-45 years (Age)'] / (i + 1) : (el['18-45 years (Age)'] - stateDataTemp[i - 7]['18-45 years (Age)']) / 7,
              '7-day Average 45-60 years (Age)': i < 7 ? el['45-60 years (Age)'] / (i + 1) : (el['45-60 years (Age)'] - stateDataTemp[i - 7]['45-60 years (Age)']) / 7,
              '7-day Average 60+ years (Age)': i < 7 ? el['60+ years (Age)'] / (i + 1) : (el['60+ years (Age)'] - stateDataTemp[i - 7]['60+ years (Age)']) / 7,
              '7-day Average Female(Individuals Vaccinated)': i < 7 ? el['Female(Individuals Vaccinated)'] / (i + 1) : (el['Female(Individuals Vaccinated)'] - stateDataTemp[i - 7]['Female(Individuals Vaccinated)']) / 7,
              '7-day Average First Dose Administered': i < 7 ? el['First Dose Administered'] / (i + 1) : (el['First Dose Administered'] - stateDataTemp[i - 7]['First Dose Administered']) / 7,
              '7-day Average Male(Individuals Vaccinated)': i < 7 ? el['Male(Individuals Vaccinated)'] / (i + 1) : (el['Male(Individuals Vaccinated)'] - stateDataTemp[i - 7]['Male(Individuals Vaccinated)']) / 7,
              '7-day Average Second Dose Administered': i < 7 ? el['Second Dose Administered'] / (i + 1) : (el['Second Dose Administered'] - stateDataTemp[i - 7]['Second Dose Administered']) / 7,
              '7-day Average Covaxin Administered': i < 7 ? el['Total Covaxin Administered'] / (i + 1) : (el['Total Covaxin Administered'] - stateDataTemp[i - 7]['Total Covaxin Administered']) / 7,
              '7-day Average CoviShield Administered': i < 7 ? el['Total CoviShield Administered'] / (i + 1) : (el['Total CoviShield Administered'] - stateDataTemp[i - 7]['Total CoviShield Administered']) / 7,
              '7-day Average Sputnik V Administered': i < 7 ? el['Total Sputnik V Administered'] / (i + 1) : (el['Total Sputnik V Administered'] - stateDataTemp[i - 7]['Total Sputnik V Administered']) / 7,
              '7-day Average Doses Administered': i < 7 ? el['Total Doses Administered'] / (i + 1) : (el['Total Doses Administered'] - stateDataTemp[i - 7]['Total Doses Administered']) / 7,
              '7-day Average Individuals Vaccinated': i < 7 ? el['Total Individuals Vaccinated'] / (i + 1) : (el['Total Individuals Vaccinated'] - stateDataTemp[i - 7]['Total Individuals Vaccinated']) / 7,
              '7-day Average Transgender(Individuals Vaccinated)': i < 7 ? el['Transgender(Individuals Vaccinated)'] / (i + 1) : (el['Transgender(Individuals Vaccinated)'] - stateDataTemp[i - 7]['Transgender(Individuals Vaccinated)']) / 7,
            }
          })
          return {
            'State': state,
            'Data': stateDataFinal,

          }
        })
        setCountryData(countryDataFinal);
        setStateData(statesData);
      }
    })
  }, [])
  return (
    <>
      <GlobalStyle />
      <H1>
        India COVID-19 Vaccine Tracker
      </H1>
      <div className="container">
        <div>
          On January 16, 2021, the Government of India and State governments launched one of the most extensive vaccination drives against COVID-19, targeting 300 million beneficiaries of priority group comprising healthcare workers, frontline workers, and population above 50 years of age. Later the government  announced that from May 1, 2021 everyone over the age of 18 will be elligible for vaccine
          <br />
          <br />
        </div>
      </div>
      {
        error ? <Error>There is an error loading</Error> : null
      }
      {
        countryData ? <CountrySection windowWidth={width} countryData={countryData} /> :
          <VizDiv>
            <Loader type="Oval" color="#00BFFF" height={50} width={50} />
          </VizDiv>
      }
      {countryData && stateData ?
        <>
          <StateViz
            windowWidth={width}
            statesData={stateData}
            countryData={countryData}
          />
        </> :
        <VizDiv>
          <Loader type="Oval" color="#00BFFF" height={50} width={50} />
        </VizDiv>
      }
      {districtData && countryData ?
        <>
          <DistrictViz
            windowWidth={width}
            districtData={districtData}
            countryData={countryData}
          />
        </> :
        <VizDiv>
          <Loader type="Oval" color="#00BFFF" height={50} width={50} />
        </VizDiv>
      }
      <Footer>
        <EmailDiv>

          Help me improve the Covid-19 Vaccine Tracker. Please email me at <a href="mailto:saifee.mustafa@gmail.com" target="_blank" rel="noopener noreferrer">saifee.mustafa@gmail.com</a> or connect on <a href="https://twitter.com/mustafasaifee42" target="_blank" rel="noopener noreferrer">twitter</a> for suggestions or queries.
          <ShareDiv>
            <span className="footer-start">You got all the way down here, consider sharing the <span aria-label="love-emoji" role="img">💖</span></span>
            {
              countryData ? (
                <div className="icons">
                  <FacebookShareButton url={'https://india-covid-vaccine-tracker.mustafasaifee.com'} quote={`In India, by ${formatTime(countryData[countryData.length - 1].Date)}, ${(countryData[countryData.length - 1]['First Dose Administered'] * 100 / INDIAPOPULATION).toFixed(1)}% of population have received atleast 1 dose of COVID vaccination.`}>
                    <FacebookIcon size={32} round={true} />
                  </FacebookShareButton>
                  <TwitterShareButton url={'https://india-covid-vaccine-tracker.mustafasaifee.com'} title={`In India, by ${formatTime(countryData[countryData.length - 1].Date)}, ${(countryData[countryData.length - 1]['First Dose Administered'] * 100 / INDIAPOPULATION).toFixed(1)}% of population have received atleast 1 dose of COVID vaccination. https://india-covid-vaccine-tracker.mustafasaifee.com via @mustafasaifee42`}>
                    <TwitterIcon size={32} round={true} />
                  </TwitterShareButton>
                </div>
              ) : (
                <div className="icons">
                  <FacebookShareButton url={'https://india-covid-vaccine-tracker.mustafasaifee.com'} quote={'See How Vaccinations for COVID-19 Are Going in State And Districts in India'}>
                    <FacebookIcon size={32} round={true} />
                  </FacebookShareButton>
                  <TwitterShareButton url={'https://india-covid-vaccine-tracker.mustafasaifee.com'} title={'See How Vaccinations for COVID-19 Are Going in State And Districts in India https://india-covid-vaccine-tracker.mustafasaifee.com via @mustafasaifee42'}>
                    <TwitterIcon size={32} round={true} />
                  </TwitterShareButton>
                </div>
              )}
          </ShareDiv>
        </EmailDiv>
        <FooterContainer>
          <BoldSpan>DATA SOURCES</BoldSpan>
          The official government dashboard can be found <a href="https://dashboard.cowin.gov.in/" target="_blank" rel="noreferrer">here</a>.
          <br />
          <br />
          The vaccination data used in this portal is collected using the <a href="https://github.com/covid19india/api" target="_blank" rel="noreferrer">covid19india API</a>. In the data there might be some discrepancies like:
          <ul>
            <li>The age, gender or dose-specific category numbers might not add up to the total doses administered.</li>
            <li>Some states or districts might not have the most recent data.</li>
            <li>In some cases there might be a decline in the total no. of doses administered.</li>
          </ul>
          <a href="https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/RXYJR6" target="_blank" rel="noreferrer">The population estimates for districts and state by Wang, Weiyu; Kim, Rockli; Subramanian, S V, 2021 from Harvard Dataverse</a> is used to calculate the precentages and time needed to vaccinate the whole population. The population estimates are for the year 2020.
          <br />
          <br />
          The data for Mumbai and Mumbai Suburban in the state of Maharashtra are reported under Mumbai.
          <br />
          <br />
          The procurement data is from <a href="https://www.knowledgeportalia.org/" target="_blank" rel="noopener noreferrer">The Knowledge Network on Innovation and Access to Medicines</a>, project of the <a href="https://www.graduateinstitute.ch/globalhealth" target="_blank" rel="noopener noreferrer">Global Health Centre at the Graduate Institute, Geneva</a>. The source of this data is media reports, government publication and pharma companies press releases. The data sheet can be downloaded from <a href="https://www.knowledgeportalia.org/covid19-vaccine-arrangements" target="_blank" rel="noopener noreferrer">here</a>
          <br />
          <br />
          The layout for tile grid map for India is from <a href="https://graphics.reuters.com/world-coronavirus-tracker-and-maps/countries-and-territories/india/" target="_blank" rel="noopener noreferrer">Reuter's article</a> designed by Reuter's design team.
          <br />
          <br />
          <hr />
          <br />
          <span className="bold">PRIVACY POLICY</span> <br />This website does not save any information about you. We do not directly use cookies or other tracking technologies. We do, however, use Google Analytics for mere statistical reasons. It is possible that Google Analytics sets cookies or uses other tracking technologies, but this data is not directly accessible by us.
          <br />
          <br />
          This page is hosted on <a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer">Netlify</a>
        </FooterContainer>
      </Footer>
    </>
  );
}

export default App;

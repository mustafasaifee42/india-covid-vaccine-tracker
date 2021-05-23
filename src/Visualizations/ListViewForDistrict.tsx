import { useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { CityDataType, PopulationDataType } from '../types';

interface Props {
  data: CityDataType[];
  populationData: PopulationDataType[];
  title: string;
}


const GraphContainer = styled.div`
  max-width: 1000px;
  margin: auto;
  font-size: 18px;
  line-height: 28px;
  overflow-x:auto;
`

const ListContainer = styled.div`
  width: 1000px;
`

const TableHeader = styled.div`
  display: flex;
  border-bottom: 1px solid var(--black);
  align-items: flex-end;
  background-color: var(--moderate-light-gray);
`
const TableHeadEl = styled.div`
  font-size: 14px;
  text-align: right;
  width: calc(17% - 16px);
  padding: 10px 8px;

  &:first-of-type{
    text-align: left;
    width:calc(18% - 16px);
  }
  &:nth-child(2){
    width:calc(13% - 16px);
  }
  &:nth-child(3){
    width:calc(12% - 16px);
  }
  &:nth-child(4){
    width:calc(12% - 16px);
  }
  &:nth-child(5){
    width:calc(12% - 16px);
  }
  &:nth-child(6){
    width:calc(12% - 16px);
  }
  &:nth-child(7){
    width:calc(11% - 16px);
  }
  &:nth-child(8){
    width:calc(10% - 16px);
  }
`

const Rows = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid var(--moderate-light-gray);
  display: flex;
  font-size: 14px;
`

const RowEl = styled.div`
  font-size: 16px;
  width: calc(17% - 16px);
  text-align: right;
  padding: 0 8px;

  &:first-of-type{
    text-align: left;
    width:calc(18% - 16px);
  }
  &:nth-child(2){
    width:calc(13% - 16px);
  }
  &:nth-child(3){
    width:calc(12% - 16px);
  }
  &:nth-child(4){
    width:calc(12% - 16px);
  }
  &:nth-child(5){
    width:calc(12% - 16px);
  }
  &:nth-child(6){
    width:calc(12% - 16px);
  }
  &:nth-child(7){
    width:calc(11% - 16px);
  }
  &:nth-child(8){
    width:calc(10% - 16px);
  }
`

const Button = styled.div`
  cursor: pointer;
  margin: 0 auto 20px auto;
  width: 100%;
  max-width: 1000px;
  background-color: var(--moderate-light-gray);
  text-align: center;
  font-weight: 700;
  padding: 10px 0;
  &:hover {
    background-color: var(--light-gray);
  }
`
const TableCategoryHeader = styled.div`
  display: flex;
  align-items: flex-end;
  background-color: var(--moderate-light-gray);
`

const TableCategoryHead = styled.div`
  font-size: 14px;
  text-align: center;
  width: calc(17% - 16px);
  padding: 5px 0;
  margin: 0 8px;
  text-transform: uppercase;

  &:first-of-type{
    text-align: left;
    width:calc(18% - 16px);
  }
  &:nth-child(2){
    width:calc(37% - 16px);
    border-bottom: 1px solid var(--gray);
  }
  &:nth-child(3){
    width:calc(24% - 16px);
    border-bottom: 1px solid var(--gray);
  }
  &:nth-child(4){
    width:calc(21% - 16px);
    border-bottom: 1px solid var(--gray);
  }
`

const ListViewForStates = (props: Props) => {
  const {
    data,
    populationData,
    title,
  } = props;
  const [showMore, setShowMore] = useState(true);
  const [sortedBy, setSortedBy] = useState('PercentFirstDose');
  const [ascending, setAscending] = useState(false);
  return (
    <>
      <GraphContainer>
        <h4>{title}</h4>
        <br />
        <ListContainer>
          <TableCategoryHeader>
            <TableCategoryHead></TableCategoryHead>
            <TableCategoryHead>Doses Administered</TableCategoryHead>
            <TableCategoryHead>% Population</TableCategoryHead>
            <TableCategoryHead>Time Needed for everybody to</TableCategoryHead>
          </TableCategoryHeader>
          <div>
            <TableHeader>
              <TableHeadEl className={sortedBy === 'Name' ? 'tableHeaderEl bold' : 'tableHeaderEl'} onClick={() => { if (sortedBy === 'Name') { setAscending(!ascending) } else { setSortedBy('Name'); setAscending(false) } }}>{sortedBy === 'Name' ? 'Name ▼' : 'Name'}</TableHeadEl>
              <TableHeadEl className={sortedBy === 'TotalDosesGiven' ? 'tableHeaderEl bold' : 'tableHeaderEl'} onClick={() => { if (sortedBy === 'TotalDosesGiven') { setAscending(!ascending) } else { setSortedBy('TotalDosesGiven'); setAscending(false) } }}>{sortedBy === 'TotalDosesGiven' ? `Total Doses Given ${ascending ? '▲' : '▼'}` : 'Total Doses Given'}</TableHeadEl>
              <TableHeadEl className={sortedBy === 'DosesGiveYesterday' ? 'tableHeaderEl bold' : 'tableHeaderEl'} onClick={() => { if (sortedBy === 'DosesGiveYesterday') { setAscending(!ascending) } else { setSortedBy('DosesGiveYesterday'); setAscending(false) } }}>{sortedBy === 'DosesGiveYesterday' ? `Yesterday ${ascending ? '▲' : '▼'}` : 'Yesterday'}</TableHeadEl>
              <TableHeadEl className={sortedBy === '7_DayAvg' ? 'tableHeaderEl bold' : 'tableHeaderEl'} onClick={() => { if (sortedBy === '7_DayAvg') { setAscending(!ascending) } else { setSortedBy('7_DayAvg'); setAscending(false) } }}>{sortedBy === '7_DayAvg' ? `7-Day Avg. ${ascending ? '▲' : '▼'}` : '7-Day Avg.'}</TableHeadEl>
              <TableHeadEl className={sortedBy === 'PercentFirstDose' ? 'tableHeaderEl bold' : 'tableHeaderEl'} onClick={() => { if (sortedBy === 'PercentFirstDose') { setAscending(!ascending) } else { setSortedBy('PercentFirstDose'); setAscending(false) } }}>{sortedBy === 'PercentFirstDose' ? `Given 1 Dose ${ascending ? '▲' : '▼'}` : 'Given 1 Dose'}</TableHeadEl>
              <TableHeadEl className={sortedBy === 'PercentFullyVaccinated' ? 'tableHeaderEl bold' : 'tableHeaderEl'} onClick={() => { if (sortedBy === 'PercentFullyVaccinated') { setAscending(!ascending) } else { setSortedBy('PercentFullyVaccinated'); setAscending(false) } }}>{sortedBy === 'PercentFullyVaccinated' ? `Fully Vaccinated ${ascending ? '▲' : '▼'}` : 'Fully Vaccinated'}</TableHeadEl>
              <TableHeadEl className={sortedBy === 'TimeNeededOneDose' ? 'tableHeaderEl bold' : 'tableHeaderEl'} onClick={() => { if (sortedBy === 'TimeNeededOneDose') { setAscending(!ascending) } else { setSortedBy('TimeNeededOneDose'); setAscending(false) } }}>{sortedBy === 'TimeNeededOneDose' ? `Have 1 Dose ${ascending ? '▲' : '▼'}` : 'Have 1 Dose'}</TableHeadEl>
              <TableHeadEl className={sortedBy === 'TimeFullyVaccinated' ? 'tableHeaderEl bold' : 'tableHeaderEl'} onClick={() => { if (sortedBy === 'TimeFullyVaccinated') { setAscending(!ascending) } else { setSortedBy('TimeFullyVaccinated'); setAscending(false) } }}>{sortedBy === 'TimeFullyVaccinated' ? `Fully Vaccinated ${ascending ? '▲' : '▼'}` : 'Fully vaccinated'}</TableHeadEl>
            </TableHeader>
          </div>
          {ascending ? _.filter(_.sortBy(data, city => {
            if (sortedBy === 'Name') return `${city.District}, ${city.State_Code}`
            if (sortedBy === 'TotalDosesGiven') return city.data[city.data.length - 1].Cummilative_Total_Dose_Administered
            if (sortedBy === 'DosesGiveYesterday') return city.data[city.data.length - 1].Delta_Total_Dose_Administered
            if (sortedBy === '7_DayAvg') return city.data[city.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered']
            if (sortedBy === 'PercentFirstDose') return city.data[city.data.length - 1].Cummilative_First_Dose_Administered * 100 / populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${city.District}, ${city.State}`)].District_Population
            if (sortedBy === 'PercentFullyVaccinated') return city.data[city.data.length - 1].Cummilative_Second_Dose_Administered * 100 / populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${city.District}, ${city.State}`)].District_Population
            if (sortedBy === 'TimeNeededOneDose') return (populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${city.District}, ${city.State}`)].District_Population - city.data[city.data.length - 1].Cummilative_First_Dose_Administered) / city.data[city.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered'] / 365
            if (sortedBy === 'TimeFullyVaccinated') return (2 * populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${city.District}, ${city.State}`)].District_Population - city.data[city.data.length - 1].Cummilative_Total_Dose_Administered) / city.data[city.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered'] / 365
          }), (_d, i) => { const limit = showMore ? 10 : data.length; return i < limit }).map((d, i) =>
            <Rows>
              <RowEl>{`${d.District}, ${d.State_Code}`}</RowEl>
              <RowEl>{new Intl.NumberFormat('en-US').format(d.data[d.data.length - 1].Cummilative_Total_Dose_Administered)}</RowEl>
              <RowEl>{new Intl.NumberFormat('en-US').format(d.data[d.data.length - 1].Delta_Total_Dose_Administered)}</RowEl>
              <RowEl>{new Intl.NumberFormat('en-US').format(d.data[d.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered'])}</RowEl>
              <RowEl>{(d.data[d.data.length - 1].Cummilative_First_Dose_Administered * 100 / populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${d.District}, ${d.State}`)].District_Population).toFixed(2)}%</RowEl>
              <RowEl>{(d.data[d.data.length - 1].Cummilative_Second_Dose_Administered * 100 / populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${d.District}, ${d.State}`)].District_Population).toFixed(2)}%</RowEl>
              <RowEl>{(populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${d.District}, ${d.State}`)].District_Population - d.data[d.data.length - 1].Cummilative_First_Dose_Administered) / d.data[d.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered'] / 365 < 0 ? 'NA' : `${(((populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${d.District}, ${d.State}`)].District_Population - d.data[d.data.length - 1].Cummilative_First_Dose_Administered) / d.data[d.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered']) / 365).toFixed(1)} yrs`}</RowEl>
              <RowEl>{(2 * populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${d.District}, ${d.State}`)].District_Population - d.data[d.data.length - 1].Cummilative_Total_Dose_Administered) / d.data[d.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered'] / 365 < 0 ? 'NA' : `${(((2 * populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${d.District}, ${d.State}`)].District_Population - d.data[d.data.length - 1].Cummilative_Total_Dose_Administered) / d.data[d.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered']) / 365).toFixed(1)} yrs`}</RowEl>
            </Rows>

          ) :
            _.filter(_.reverse(_.sortBy(data, city => {
              if (sortedBy === 'Name') return `${city.District}, ${city.State}`
              if (sortedBy === 'TotalDosesGiven') return city.data[city.data.length - 1].Cummilative_Total_Dose_Administered
              if (sortedBy === 'DosesGiveYesterday') return city.data[city.data.length - 1].Delta_Total_Dose_Administered
              if (sortedBy === '7_DayAvg') return city.data[city.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered']
              if (sortedBy === 'PercentFirstDose') return city.data[city.data.length - 1].Cummilative_First_Dose_Administered * 100 / populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${city.District}, ${city.State}`)].District_Population
              if (sortedBy === 'PercentFullyVaccinated') return city.data[city.data.length - 1].Cummilative_Second_Dose_Administered * 100 / populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${city.District}, ${city.State}`)].District_Population
              if (sortedBy === 'TimeNeededOneDose') return (populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${city.District}, ${city.State}`)].District_Population - city.data[city.data.length - 1].Cummilative_First_Dose_Administered) / city.data[city.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered'] / 365
              if (sortedBy === 'TimeFullyVaccinated') return (2 * populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${city.District}, ${city.State}`)].District_Population - city.data[city.data.length - 1].Cummilative_Total_Dose_Administered) / city.data[city.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered'] / 365
            })), (_d, i) => { const limit = showMore ? 10 : data.length; return i < limit }).map((d, i) =>
              <Rows>
                <RowEl>{`${d.District}, ${d.State_Code}`}</RowEl>
                <RowEl>{new Intl.NumberFormat('en-US').format(d.data[d.data.length - 1].Cummilative_Total_Dose_Administered)}</RowEl>
                <RowEl>{new Intl.NumberFormat('en-US').format(d.data[d.data.length - 1].Delta_Total_Dose_Administered)}</RowEl>
                <RowEl>{new Intl.NumberFormat('en-US').format(Math.round(d.data[d.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered']))}</RowEl>
                <RowEl>{(d.data[d.data.length - 1].Cummilative_First_Dose_Administered * 100 / populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${d.District}, ${d.State}`)].District_Population).toFixed(2)}%</RowEl>
                <RowEl>{(d.data[d.data.length - 1].Cummilative_Second_Dose_Administered * 100 / populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${d.District}, ${d.State}`)].District_Population).toFixed(2)}%</RowEl>
                <RowEl>{(populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${d.District}, ${d.State}`)].District_Population - d.data[d.data.length - 1].Cummilative_First_Dose_Administered) / d.data[d.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered'] / 365 < 0 ? 'NA' : `${(((populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${d.District}, ${d.State}`)].District_Population - d.data[d.data.length - 1].Cummilative_First_Dose_Administered) / d.data[d.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered']) / 365).toFixed(1)} yrs`}</RowEl>
                <RowEl>{(2 * populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${d.District}, ${d.State}`)].District_Population - d.data[d.data.length - 1].Cummilative_Total_Dose_Administered) / d.data[d.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered'] / 365 < 0 ? 'NA' : `${(((2 * populationData[populationData.findIndex(el => `${el.District_Name}, ${el.State_Name}` === `${d.District}, ${d.State}`)].District_Population - d.data[d.data.length - 1].Cummilative_Total_Dose_Administered) / d.data[d.data.length - 1]['7_Day_Ruuning_Avg_Total_Dose_Administered']) / 365).toFixed(1)} yrs`}</RowEl>
              </Rows>
            )
          }
        </ListContainer>
      </GraphContainer>
      <Button onClick={() => { setShowMore(!showMore) }}>
        {showMore ? 'Show All Districts' : 'Show Less'}
      </Button>
    </>
  );
};

export default ListViewForStates;

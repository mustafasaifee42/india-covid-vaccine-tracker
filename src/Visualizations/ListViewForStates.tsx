import { useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { StateDataType, StatePopulationDataType } from '../types';

interface Props {
  data: StateDataType[];
  populationData: StatePopulationDataType[];
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
    title
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
          {ascending ? _.filter(_.sortBy(data, state => {
            if (sortedBy === 'Name') return state.State
            if (sortedBy === 'TotalDosesGiven') return state.Data[state.Data.length - 1]['Total Doses Administered']
            if (sortedBy === 'DosesGiveYesterday') return state.Data[state.Data.length - 1]['Delta Doses Administered']
            if (sortedBy === '7_DayAvg') return state.Data[state.Data.length - 1]['7-day Average Doses Administered']
            if (sortedBy === 'PercentFirstDose') return state.Data[state.Data.length - 1]['First Dose Administered'] * 100 / populationData[populationData.findIndex(el => el.State_Name === state.State)].State_Population
            if (sortedBy === 'PercentFullyVaccinated') return state.Data[state.Data.length - 1]['Second Dose Administered'] * 100 / populationData[populationData.findIndex(el => el.State_Name === state.State)].State_Population
            if (sortedBy === 'TimeNeededOneDose') return (populationData[populationData.findIndex(el => `${el.State_Name}` === `${state.State}`)].State_Population - state.Data[state.Data.length - 1]['First Dose Administered']) / state.Data[state.Data.length - 1]['7-day Average Doses Administered'] / 365
            if (sortedBy === 'TimeFullyVaccinated') return (2 * populationData[populationData.findIndex(el => `${el.State_Name}` === `${state.State}`)].State_Population - state.Data[state.Data.length - 1]['Total Doses Administered']) / state.Data[state.Data.length - 1]['7-day Average Doses Administered'] / 365
          }), (_d, i) => { const limit = showMore ? 10 : data.length; return i < limit }).map((d, i) =>
            <Rows key={i}>
              <RowEl>{d.State}</RowEl>
              <RowEl>{new Intl.NumberFormat('en-US').format(d.Data[d.Data.length - 1]['Total Doses Administered'])}</RowEl>
              <RowEl>{new Intl.NumberFormat('en-US').format(d.Data[d.Data.length - 1]['Delta Doses Administered'])}</RowEl>
              <RowEl>{new Intl.NumberFormat('en-US').format(d.Data[d.Data.length - 1]['7-day Average Doses Administered'])}</RowEl>
              <RowEl>{(d.Data[d.Data.length - 1]['First Dose Administered'] * 100 / populationData[populationData.findIndex(el => el.State_Name === d.State)].State_Population).toFixed(2)}%</RowEl>
              <RowEl>{(d.Data[d.Data.length - 1]['Second Dose Administered'] * 100 / populationData[populationData.findIndex(el => el.State_Name === d.State)].State_Population).toFixed(2)}%</RowEl>
              <RowEl>{(populationData[populationData.findIndex(el => `${el.State_Name}` === `${d.State}`)].State_Population - d.Data[d.Data.length - 1]['First Dose Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered'] / 365 < 0 ? 'NA' : `${(((populationData[populationData.findIndex(el => `${el.State_Name}` === `${d.State}`)].State_Population - d.Data[d.Data.length - 1]['First Dose Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365).toFixed(1)} yrs`}</RowEl>
              <RowEl>{(2 * populationData[populationData.findIndex(el => `${el.State_Name}` === `${d.State}`)].State_Population - d.Data[d.Data.length - 1]['Total Doses Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered'] / 365 < 0 ? 'NA' : `${(((2 * populationData[populationData.findIndex(el => `${el.State_Name}` === `${d.State}`)].State_Population - d.Data[d.Data.length - 1]['Total Doses Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365).toFixed(1)} yrs`}</RowEl>
            </Rows>

          ) :
            _.filter(_.reverse(_.sortBy(data, state => {
              if (sortedBy === 'Name') return state.State
              if (sortedBy === 'TotalDosesGiven') return state.Data[state.Data.length - 1]['Total Doses Administered']
              if (sortedBy === 'DosesGiveYesterday') return state.Data[state.Data.length - 1]['Delta Doses Administered']
              if (sortedBy === '7_DayAvg') return state.Data[state.Data.length - 1]['7-day Average Doses Administered']
              if (sortedBy === 'PercentFirstDose') return state.Data[state.Data.length - 1]['First Dose Administered'] * 100 / populationData[populationData.findIndex(el => el.State_Name === state.State)].State_Population
              if (sortedBy === 'PercentFullyVaccinated') return state.Data[state.Data.length - 1]['Second Dose Administered'] * 100 / populationData[populationData.findIndex(el => el.State_Name === state.State)].State_Population
              if (sortedBy === 'TimeNeededOneDose') return (populationData[populationData.findIndex(el => `${el.State_Name}` === `${state.State}`)].State_Population - state.Data[state.Data.length - 1]['First Dose Administered']) / state.Data[state.Data.length - 1]['7-day Average Doses Administered'] / 365
              if (sortedBy === 'TimeFullyVaccinated') return (2 * populationData[populationData.findIndex(el => `${el.State_Name}` === `${state.State}`)].State_Population - state.Data[state.Data.length - 1]['Total Doses Administered']) / state.Data[state.Data.length - 1]['7-day Average Doses Administered'] / 365
            })), (_d, i) => { const limit = showMore ? 10 : data.length; return i < limit }).map((d, i) =>
              <Rows key={i}>
                <RowEl>{d.State}</RowEl>
                <RowEl>{new Intl.NumberFormat('en-US').format(d.Data[d.Data.length - 1]['Total Doses Administered'])}</RowEl>
                <RowEl>{new Intl.NumberFormat('en-US').format(d.Data[d.Data.length - 1]['Delta Doses Administered'])}</RowEl>
                <RowEl>{new Intl.NumberFormat('en-US').format(Math.round(d.Data[d.Data.length - 1]['7-day Average Doses Administered']))}</RowEl>
                <RowEl>{(d.Data[d.Data.length - 1]['First Dose Administered'] * 100 / populationData[populationData.findIndex(el => el.State_Name === d.State)].State_Population).toFixed(2)}%</RowEl>
                <RowEl>{(d.Data[d.Data.length - 1]['Second Dose Administered'] * 100 / populationData[populationData.findIndex(el => el.State_Name === d.State)].State_Population).toFixed(2)}%</RowEl>
                <RowEl>{(populationData[populationData.findIndex(el => `${el.State_Name}` === `${d.State}`)].State_Population - d.Data[d.Data.length - 1]['First Dose Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered'] / 365 < 0 ? 'NA' : `${(((populationData[populationData.findIndex(el => `${el.State_Name}` === `${d.State}`)].State_Population - d.Data[d.Data.length - 1]['First Dose Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365).toFixed(1)} yrs`}</RowEl>
                <RowEl>{(2 * populationData[populationData.findIndex(el => `${el.State_Name}` === `${d.State}`)].State_Population - d.Data[d.Data.length - 1]['Total Doses Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered'] / 365 < 0 ? 'NA' : `${(((2 * populationData[populationData.findIndex(el => `${el.State_Name}` === `${d.State}`)].State_Population - d.Data[d.Data.length - 1]['Total Doses Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365).toFixed(1)} yrs`}</RowEl>
              </Rows>
            )
          }
        </ListContainer>
      </GraphContainer>
      <Button onClick={() => { setShowMore(!showMore) }}>
        {showMore ? 'Show All States' : 'Show Less'}
      </Button>
    </>
  );
};

export default ListViewForStates;

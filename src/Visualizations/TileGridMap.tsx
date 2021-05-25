import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { select, selectAll } from 'd3-selection';
import { StateDataType, StatePopulationDataType, CountryStateWithDeltaDataType } from '../types';
import { scaleTime, scaleLinear } from 'd3-scale';
import { format } from 'd3-format';
import { axisRight } from 'd3-axis';
import TileGridMap from '../data/IndiaTGM.json';
import { line, curveStep, area } from 'd3-shape';

interface Props {
  data: StateDataType[];
  populationData: StatePopulationDataType[];
  windowWidth: number;
}

const ToggleDiv = styled.div`
  display: flex;
`

const GraphArea = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 20px 0 15px 0;
`

const SettingsDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`

const ToggleOption = styled.div`
  font-size: 14px;
  text-align: center;
  border: 1px solid var(--light-gray);
  background-color: var(--white);
  padding: 5px 10px;
  cursor: pointer;
  &:first-of-type {
    border-radius: 5px 0 0 5px;
  }
  &:last-of-type {
    border-radius: 0 5px 5px 0;
  }
`
const Tooltip = styled.div`
  font-family: 'IBM Plex Sans',sans-serif;
  border-radius: 5px;
  padding: 10px 20px;
  max-width:360px;
  background-color:rgba(255,255,255,0.95);
  box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);
  font-size: 14px;
  display: none;
  opacity: 0.9;
`

const Header = styled.h3`
  margin-top: 50px;
  text-align: center;
`

const SubNote = styled.div`
  font-size: 14px;
  font-style: italic;
  color: var(--gray);
  margin-bottom: 40px;
`

const IndiaTGMViz = (props: Props) => {
  const {
    data,
    populationData,
    windowWidth,
  } = props;
  const GraphRef = useRef(null);
  const TooltipRef = useRef(null);
  const [option, setOption] = useState('Atleast One Dose');

  useEffect(() => {
    if (GraphRef.current && GraphRef !== null && TooltipRef.current && TooltipRef !== null) {
      const graphSVG = select(GraphRef.current);
      graphSVG.selectAll('g').remove();
      const gridSize = 100;
      const g = graphSVG.append('g');
      g.selectAll('.stateGroup')
        .data(TileGridMap)
        .enter()
        .append('g')
        .attr('class', 'stateGroup')
        .attr('transform', d => `translate(${d.x * gridSize},${d.y * gridSize})`)
        .on('mouseenter', (event, d: any) => {
          const indx = data.findIndex(state => state.State === d.STATE_NAME)
          const popIndx = populationData.findIndex(state => state.State_Name === d.STATE_NAME)
          select(TooltipRef.current)
            .style('position', 'absolute')
            .style('display', 'inline')
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
          select(TooltipRef.current)
            .select('.population')
            .html(new Intl.NumberFormat('en-US').format(populationData[popIndx].State_Population))
          select(TooltipRef.current)
            .select('.stateName')
            .html(d.STATE_NAME)
          select(TooltipRef.current)
            .select('.firstDose')
            .html(`${new Intl.NumberFormat('en-US').format(data[indx].Data[data[indx].Data.length - 1]['First Dose Administered'] * 100000 / populationData[popIndx].State_Population)}`)
          select(TooltipRef.current)
            .select('.secondDose')
            .html(`${new Intl.NumberFormat('en-US').format(data[indx].Data[data[indx].Data.length - 1]['Second Dose Administered'] * 100000 / populationData[popIndx].State_Population)}`)
          select(TooltipRef.current)
            .select('.avgDose')
            .html(`${new Intl.NumberFormat('en-US').format(data[indx].Data[data[indx].Data.length - 1]['7-day Average Doses Administered'] * 100000 / populationData[popIndx].State_Population)}`)
        })
        .on('mousemove', (event, _d) => {
          select(TooltipRef.current)
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
        })
        .on('mouseout', (_event, d) => {
          select(TooltipRef.current)
            .style('display', 'none')
        })
      selectAll('.stateGroup')
        .append('rect')
        .attr('class', 'stateBox')
        .attr('opacity', 1)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', gridSize)
        .attr('height', gridSize)
        .style('fill', 'var(--light-gray)')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
      selectAll('.stateGroup')
        .append('text')
        .attr('class', 'stateLabel')
        .attr('opacity', 1)
        .attr('x', 5)
        .attr('y', 15)
        .text((d: any) => d.STATE_CODE)
        .style('font-size', '10px')
        .style('font-family', 'IBM Plex Sans')
        .style('color', 'var(--black)')
    }
  }, [GraphRef, TooltipRef, data, populationData]);
  useEffect(() => {
    if (GraphRef.current && GraphRef !== null) {
      selectAll('.stateGraph').remove();
      const width = 90;
      const height = 60;
      const margin = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }
      const graphWidth = width - margin.left - margin.right;
      const graphHeight = height - margin.top - margin.bottom;
      const xScale = scaleTime()
        .range([0, graphWidth])
        .domain([data[0].Data[0].Date, data[0].Data[data[0].Data.length - 1].Date]);
      const yScale = scaleLinear()
        .range([0, graphHeight])
        .domain([option === 'Atleast One Dose' ? 40000 : option === 'Fully Vaccinated' ? 20000 : 1500, 0] as number[]);
      const group = selectAll('.stateGroup')
        .append('g')
        .attr('class', 'stateGraph')
        .attr('transform', `translate(5,30)`);
      const ticksG = group.append('g');
      const graphG = group.append('g')
        .attr('transform', `translate(0,5)`);
      ticksG.append('g')
        .style('font-size', '8px')
        .style('font-family', 'IBM Plex Sans')
        .style('color', 'var(--gray)')
        .style('pointer-events', 'none')
        .attr('transform', `translate(0,5)`)
        .call(axisRight(yScale).ticks(option === 'Atleast One Dose' ? 2 : option === 'Fully Vaccinated' ? 2 : 3).tickFormat(format('.2s')).tickSize(width + margin.left + margin.right))
        .call((tickGroup) => {
          tickGroup.select('.domain').remove();
          tickGroup.selectAll('.tick line')
            .attr('stroke-opacity', 0.5)
            .attr('stroke', 'var(--gray)')
          tickGroup.selectAll('.tick:not(:last-of-type) line')
            .attr('stroke-dasharray', '2,2');
          tickGroup.selectAll('.tick text').attr('x', 0).attr('dy', -4)
        });
      const areaGraph = area()
        .x((d: any) => xScale(d.Date))
        .y0(yScale(0))
        .y1((d: any) => option === 'Atleast One Dose' ? yScale(d['First Dose Administered Per 100000']) : option === 'Fully Vaccinated' ? yScale(d['Second Dose Administered Per 100000']) : yScale(d['7-day Average Doses Administered per 100000']))
        .curve(curveStep);
      const lineGraph = line()
        .x((d: any) => xScale(d.Date))
        .y((d: any) => option === 'Atleast One Dose' ? yScale(d['First Dose Administered Per 100000']) : option === 'Fully Vaccinated' ? yScale(d['Second Dose Administered Per 100000']) : yScale(d['7-day Average Doses Administered per 100000']))
        .curve(curveStep);
      graphG.append('path')
        .datum((d: any) => {
          const population = populationData[populationData.findIndex(el => el.State_Name === d.STATE_NAME)].State_Population;
          const stateData = data[data.findIndex(el => el.State === d.STATE_NAME)].Data.map((el: CountryStateWithDeltaDataType) => {
            return {
              Date: el.Date,
              'First Dose Administered Per 100000': el['First Dose Administered'] * 100000 / population,
              'Second Dose Administered Per 100000': el['Second Dose Administered'] * 100000 / population,
              '7-day Average Doses Administered per 100000': el['7-day Average Doses Administered'] * 100000 / population,
            }
          })
          return stateData
        })
        .attr('class', 'TGMArea')
        .style('pointer-events', 'none')
        .attr('d', areaGraph as any)
        .style('opacity', '0.5')
        .style('fill', 'var(--primary-color)')
      graphG.append('path')
        .datum((d: any) => {
          const population = populationData[populationData.findIndex(el => el.State_Name === d.STATE_NAME)].State_Population;
          const stateData = data[data.findIndex(el => el.State === d.STATE_NAME)].Data.map((el: CountryStateWithDeltaDataType) => {
            return {
              Date: el.Date,
              'First Dose Administered Per 100000': el['First Dose Administered'] * 100000 / population,
              'Second Dose Administered Per 100000': el['Second Dose Administered'] * 100000 / population,
              '7-day Average Doses Administered per 100000': el['7-day Average Doses Administered'] * 100000 / population,
            }
          })
          return stateData
        })
        .attr('class', 'TGMLine')
        .style('pointer-events', 'none')
        .attr('d', lineGraph as any)
        .style('stroke', 'var(--primary-color)')
        .attr('fill', 'none')
        .attr('stroke-width', 1);
    }
  }, [option, GraphRef, data, populationData]);
  return (
    <>
      <Tooltip ref={TooltipRef}>
        <div><span className="stateName bold">StateName</span> (per 100,000)</div>
        <div>First Dose Administered: <span className="firstDose bold">0</span></div>
        <div>Second Dose Administered: <span className="secondDose bold">0</span></div>
        <div>7-day Avg. Dose Administered: <span className="avgDose bold">0</span></div>
      </Tooltip>
      <Header>
        State by State Vaccination Campaign Comparison
      </Header>
      <SettingsDiv>
        <ToggleDiv>
          <ToggleOption className={`${option === 'Atleast One Dose' ? 'selected' : null}`} onClick={() => { setOption('Atleast One Dose') }}>1 Dose Adm. (per 100,000)</ToggleOption>
          <ToggleOption className={`${option === 'Fully Vaccinated' ? 'selected' : null}`} onClick={() => { setOption('Fully Vaccinated') }}>Fully Vaccinated (per 100,000)</ToggleOption>
          <ToggleOption className={`${option === '7-Day Avg.' ? 'selected' : null}`} onClick={() => { setOption('7-Day Avg.') }}>7-Day Avg. Dose Adm. (per 100,000)</ToggleOption>
        </ToggleDiv>
      </SettingsDiv>
      <GraphArea>
        <svg width={windowWidth} height={windowWidth * 800 / 700} ref={GraphRef} viewBox={'0 0 700 800'}>
        </svg>
      </GraphArea>
      <SubNote>The layout of the Tile Grid Map for India is from a <a href="https://www.washingtonpost.com/world/interactive/2021/india-covid-cases-surge/" target="_blank" rel="noopener noreferrer">Washington Post article.</a></SubNote>
    </>
  );
};

export default IndiaTGMViz;

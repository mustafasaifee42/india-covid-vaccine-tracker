import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { select } from 'd3-selection';
import _ from 'lodash';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { axisRight } from 'd3-axis';
import { StateDataType, CountryStateWithDeltaDataType, StatePopulationDataType } from '../types';

interface Props {
  data: StateDataType[];
  populationData: StatePopulationDataType[];
  refData: CountryStateWithDeltaDataType;
  refPopulation: number;
  windowWidth: number;
}

interface TitleDivProps {
  bottomMargin?: number;
}

const GraphContainer = styled.div`
  max-width: 900px;
  margin: auto;
  font-size: 18px;
  line-height: 28px;
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
`

const TitleDiv = styled.div<TitleDivProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom:${props => props.bottomMargin ? props.bottomMargin : 0}px;
  flex-wrap: wrap;
`

const ToggleDiv = styled.div`
  display: flex;
`

const ToggleOption = styled.div`
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

const DailyDoseViz = (props: Props) => {
  const {
    data,
    populationData,
    refData,
    refPopulation,
    windowWidth
  } = props;
  const GraphRef = useRef(null);
  const TooltipRef = useRef(null);
  const [option, setOption] = useState('Atleast One Dose');
  useEffect(() => {
    if (GraphRef.current && GraphRef !== null && TooltipRef.current && TooltipRef !== null) {
      const graphSVG = select(GraphRef.current);
      const width = 900;
      const height = 400
      const margin = {
        top: 0,
        bottom: 20,
        left: 10,
        right: 0
      };
      const ticksG = graphSVG.append('g').attr('class', 'tickGroup')
      const graphHeight = height - margin.top - margin.bottom;
      const g = graphSVG.append('g').attr('transform', `translate(${margin.left},0)`)
      const barG = graphSVG.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
      const stateDataSorted = _.sortBy(data, state => state.State)
      const maxValue = max(data, (d: StateDataType) => ((populationData[populationData.findIndex(st => st.State_Name === d.State)].State_Population - d.Data[d.Data.length - 1]['First Dose Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365);
      const statesArray = stateDataSorted.map(state => state.State)
      const yScale = scaleLinear()
        .range([0, height - margin.top - margin.bottom])
        .domain([maxValue, 0] as number[]);
      const xScale = scaleBand()
        .range([0, width - margin.left - margin.right])
        .domain(statesArray)
        .padding(0.3);

      ticksG.append('g')
        .style('font-size', '10px')
        .style('font-family', 'IBM Plex Sans')
        .style('color', 'var(--black)')
        .attr('transform', `translate(0,${margin.top})`)
        .call(axisRight(yScale).ticks(6).tickSize(width))
        .call(group => {
          group.select('.domain').remove();
          group.selectAll('.tick line')
            .attr('stroke-opacity', 0.5)
            .attr('stroke', 'var(--gray)')

          group.selectAll('.tick:not(:last-of-type) line')
            .attr('stroke-dasharray', '2,2')
          group
            .selectAll('.tick:first-of-type text')
            .text(`${group.selectAll('.tick:first-of-type text').text()} yrs`);
          group.selectAll('.tick text').attr('x', 0).attr('dy', -4)
        })
      g.selectAll('.labels')
        .data(stateDataSorted)
        .enter()
        .append('text')
        .attr('class', 'barsText')
        .attr('x', 0)
        .attr('y', 0)
        .text((d) => populationData[populationData.findIndex(st => st.State_Name === d.State)].State_Letter_Code)
        .style('fill', 'var(--black)')
        .style('font-size', '10px')
        .style('text-anchor', 'start')
        .attr('transform', d => `translate(${xScale(d.State) as number + xScale.bandwidth() / 2 - 5},${height - margin.bottom + 2})rotate(90)`)
      barG.selectAll('.bars')
        .data(stateDataSorted)
        .enter()
        .append('rect')
        .attr('class', 'bars')
        .attr('x', d => xScale(d.State) as number)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('height', d => graphHeight - yScale(((populationData[populationData.findIndex(st => st.State_Name === d.State)].State_Population - d.Data[d.Data.length - 1]['First Dose Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365))
        .attr('y', (d) => yScale(((populationData[populationData.findIndex(st => st.State_Name === d.State)].State_Population - d.Data[d.Data.length - 1]['First Dose Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365))
        .attr('width', xScale.bandwidth)
        .style('fill', 'var(--primary-color-light)')
        .on('mouseenter', (event, d: any) => {
          select(TooltipRef.current)
            .style('position', 'absolute')
            .style('display', 'inline')
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
          select(TooltipRef.current)
            .select('.stateName')
            .html(d.State)
          select(TooltipRef.current)
            .select('.totalDose')
            .html(`${(((populationData[populationData.findIndex(st => st.State_Name === d.State)].State_Population - d.Data[d.Data.length - 1]['First Dose Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365).toFixed(1)} yrs`)
          select(TooltipRef.current)
            .select('.avgDose')
            .html(`${(((2 * populationData[populationData.findIndex(st => st.State_Name === d.State)].State_Population - d.Data[d.Data.length - 1]['Total Doses Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365).toFixed(1)} yrs`)
          select(event.target)
            .style('fill', 'var(--primary-color-dark)')
        })
        .on('mousemove', (event, d) => {
          select(TooltipRef.current)
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
        })
        .on('mouseout', (event, d) => {
          graphSVG.selectAll('.bars')
            .style('fill', 'var(--primary-color-light)')
          select(TooltipRef.current)
            .style('display', 'none')
        });

      const lineG = select(GraphRef.current)
      lineG
        .append('line')
        .attr('class', 'nationalLine')
        .attr('x1', 0)
        .attr('y1', yScale(((refPopulation - refData['First Dose Administered']) / refData['7-day Average Doses Administered']) / 365))
        .attr('x2', width)
        .attr('y2', yScale(((refPopulation - refData['First Dose Administered']) / refData['7-day Average Doses Administered']) / 365))
        .style('stroke', 'var(--black)')
        .style('stroke-width', 2)
        .style('fill', 'none')
      lineG
        .append('text')
        .attr('class', 'nationalText01')
        .attr('x', width)
        .attr('y', yScale(((refPopulation - refData['First Dose Administered']) / refData['7-day Average Doses Administered']) / 365))
        .attr('dy', -5)
        .style('fill', 'var(--black)')
        .style('font-size', '10px')
        .style('text-anchor', 'end')
        .style('font-weight', '700')
        .text('For India')

      lineG
        .append('text')
        .attr('class', 'nationalText02')
        .attr('x', width)
        .attr('y', yScale(((refPopulation - refData['First Dose Administered']) / refData['7-day Average Doses Administered']) / 365))
        .attr('dy', 10)
        .style('fill', 'var(--black)')
        .style('font-size', '10px')
        .style('text-anchor', 'end')
        .style('font-weight', '700')
        .text(`${(((refPopulation - refData['First Dose Administered']) / refData['7-day Average Doses Administered']) / 365).toFixed(1)} yrs`)

    }

  }, [GraphRef, TooltipRef, data, populationData, refData, refPopulation])

  useEffect(() => {
    if (GraphRef.current && GraphRef !== null) {
      const graphSVG = select(GraphRef.current);
      const maxValue = option === 'Atleast One Dose' ?
        max(data, (d: StateDataType) => ((populationData[populationData.findIndex(st => st.State_Name === d.State)].State_Population - d.Data[d.Data.length - 1]['First Dose Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365) :
        max(data, (d: StateDataType) => ((2 * populationData[populationData.findIndex(st => st.State_Name === d.State)].State_Population - d.Data[d.Data.length - 1]['Total Doses Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365)
      const height = 400;
      const width = 900;
      const margin = {
        top: 0,
        bottom: 20,
        left: 10,
        right: 0
      };
      const graphHeight = height - margin.top - margin.bottom;
      const yScale = scaleLinear()
        .range([0, height - margin.top - margin.bottom])
        .domain([maxValue, 0] as number[]);
      if (option === 'Atleast One Dose') {
        graphSVG.selectAll('.bars')
          .attr('height', (d: any) => graphHeight - yScale(((populationData[populationData.findIndex(st => st.State_Name === d.State)].State_Population - d.Data[d.Data.length - 1]['First Dose Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365))
          .attr('y', (d: any) => yScale(((populationData[populationData.findIndex(st => st.State_Name === d.State)].State_Population - d.Data[d.Data.length - 1]['First Dose Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365))
        graphSVG.select('.nationalLine')
          .attr('y1', yScale(((refPopulation - refData['First Dose Administered']) / refData['7-day Average Doses Administered']) / 365))
          .attr('y2', yScale(((refPopulation - refData['First Dose Administered']) / refData['7-day Average Doses Administered']) / 365))
        graphSVG.select('.nationalText01')
          .attr('y', yScale(((refPopulation - refData['First Dose Administered']) / refData['7-day Average Doses Administered']) / 365))
        graphSVG.select('.nationalText02')
          .attr('y', yScale(((refPopulation - refData['First Dose Administered']) / refData['7-day Average Doses Administered']) / 365))
          .text(`${(((refPopulation - refData['First Dose Administered']) / refData['7-day Average Doses Administered']) / 365).toFixed(1)} yrs`)
      } else {
        graphSVG.selectAll('.bars')
          .attr('height', (d: any) => graphHeight - yScale(((2 * populationData[populationData.findIndex(st => st.State_Name === d.State)].State_Population - d.Data[d.Data.length - 1]['Total Doses Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365))
          .attr('y', (d: any) => yScale(((2 * populationData[populationData.findIndex(st => st.State_Name === d.State)].State_Population - d.Data[d.Data.length - 1]['Total Doses Administered']) / d.Data[d.Data.length - 1]['7-day Average Doses Administered']) / 365))
        graphSVG.select('.nationalLine')
          .attr('y1', yScale(((2 * refPopulation - refData['Total Doses Administered']) / refData['7-day Average Doses Administered']) / 365))
          .attr('y2', yScale(((2 * refPopulation - refData['Total Doses Administered']) / refData['7-day Average Doses Administered']) / 365))
        graphSVG.select('.nationalText01')
          .attr('y', yScale(((2 * refPopulation - refData['Total Doses Administered']) / refData['7-day Average Doses Administered']) / 365))
        graphSVG.select('.nationalText02')
          .attr('y', yScale(((2 * refPopulation - refData['Total Doses Administered']) / refData['7-day Average Doses Administered']) / 365))
          .text(`${(((2 * refPopulation - refData['Total Doses Administered']) / refData['7-day Average Doses Administered']) / 365).toFixed(1)} yrs`)
      }

      const ticksG = graphSVG.select('.tickGroup')

      ticksG.selectAll('g').remove()

      ticksG.append('g')
        .style('font-size', '10px')
        .style('font-family', 'IBM Plex Sans')
        .style('color', 'var(--black)')
        .attr('transform', `translate(0,${margin.top})`)
        .call(axisRight(yScale).ticks(6).tickSize(width))
        .call((g) => g.select('.domain').remove())
        .call((g) => {
          g.selectAll('.tick line')
            .attr('stroke-opacity', 0.5)
            .attr('stroke', 'var(--gray)')

          g.selectAll('.tick:not(:last-of-type) line')
            .attr('stroke-dasharray', '2,2')
          g
            .selectAll('.tick:first-of-type text')
            .text(`${g.selectAll('.tick:first-of-type text').text()} yrs`)
        })
        .call((g) => g.selectAll('.tick text').attr('x', 0).attr('dy', -4));
    }
  }, [option, GraphRef, data, populationData, refData, refPopulation]);

  return (
    <>
      <Tooltip ref={TooltipRef}>
        <div className="bold stateName">StateName</div>
        <div>Time needed for rest of population to be</div>
        <div>Vaccinated with atleast one dose: <span className="totalDose bold">0</span></div>
        <div>Fully vaccination: <span className="avgDose bold">0</span></div>
      </Tooltip>
      <GraphContainer>
        <TitleDiv>
          <h4>Time needed to vaccinate the rest of the population</h4>
          <div>
            <ToggleDiv>
              <ToggleOption className={`${option === 'Atleast One Dose' ? 'selected' : null}`} onClick={() => { setOption('Atleast One Dose') }}>Atleast One Dose</ToggleOption>
              <ToggleOption className={`${option === 'Fully Vaccinated' ? 'selected' : null}`} onClick={() => { setOption('Fully Vaccinated') }}>Fully Vaccinated</ToggleOption>
            </ToggleDiv>
          </div>
        </TitleDiv>
        <br />
        <svg height={(windowWidth * 410 / 900)} ref={GraphRef} viewBox={'0 0 900 410'} />
      </GraphContainer>
    </>
  );
};

export default DailyDoseViz;

import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { select } from 'd3-selection';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { max } from 'd3-array';
import { StateDataType, CountryStateWithDeltaDataType, StatePopulationDataType } from '../types';
import { forceSimulation, forceX, forceY, forceCollide, forceManyBody } from 'd3-force';

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

const TitleDiv = styled.div<TitleDivProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
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

const BeeSwarmForStates = (props: Props) => {
  const {
    data,
    populationData,
    refData,
    refPopulation,
    windowWidth,
  } = props;
  const GraphRef = useRef(null);
  const TooltipRef = useRef(null);
  const [option, setOption] = useState('Atleast One Dose');
  useEffect(() => {
    if (GraphRef.current && GraphRef !== null) {
      const graphSVG = select(GraphRef.current);
      graphSVG.selectAll('g').remove();
      const width = 900;
      const height = 450;
      const maxPercent = option === 'Atleast One Dose' ? max(data, d => d.Data[d.Data.length - 1]['First Dose Administered'] * 100 / populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population) : max(data, d => d.Data[d.Data.length - 1]['Second Dose Administered'] * 100 / populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population)
      const tick = () => {
        graphSVG.selectAll('.dots')
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y)
        graphSVG.selectAll('.dotsText')
          .attr('x', (d: any) => d.x)
          .attr('y', (d: any) => d.y)
      }
      const xScale = scaleLinear()
        .domain([0, Math.ceil(maxPercent as number / 10) * 10])
        .range([50, width - 50])

      const g = graphSVG.append('g')
      const radiusScale = scaleSqrt()
        .domain([0, 300000000])
        .range([2.5, 40])
      const dataDuplicate = [...data]
      const arr = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      g.selectAll('.dots')
        .data(dataDuplicate)
        .enter()
        .append('circle')
        .attr('class', 'dots')
        .attr('r', d => radiusScale(populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population))
        .attr('cx', (d: any) => option === 'Atleast One Dose' ? xScale(d.Data[d.Data.length - 1]['First Dose Administered'] * 100 / populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population) : xScale(d.Data[d.Data.length - 1]['Second Dose Administered'] * 100 / populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population))
        .attr('cy', height / 2)
        .style('fill', 'var(--primary-color-light')
        .on('mouseenter', (event, d: any) => {
          select(TooltipRef.current)
            .style('position', 'absolute')
            .style('display', 'inline')
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
          select(TooltipRef.current)
            .select('.population')
            .html(new Intl.NumberFormat('en-US').format(populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population))
          select(TooltipRef.current)
            .select('.stateName')
            .html(d.State)
          select(TooltipRef.current)
            .select('.totalDose')
            .html(`${(d.Data[d.Data.length - 1]['First Dose Administered'] * 100 / populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population).toFixed(2)}%`)
          select(TooltipRef.current)
            .select('.avgDose')
            .html(`${(d.Data[d.Data.length - 1]['Second Dose Administered'] * 100 / populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population).toFixed(2)}%`)

        })
        .on('mousemove', (event, d) => {
          select(TooltipRef.current)
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
        })
        .on('mouseout', (_event, d) => {
          select(TooltipRef.current)
            .style('display', 'none')
        })

      g.selectAll('.dotsText')
        .data(dataDuplicate)
        .enter()
        .append('text')
        .attr('class', 'dotsText')
        .attr('x', (d: any) => option === 'Atleast One Dose' ? xScale(d.Data[d.Data.length - 1]['First Dose Administered'] * 100 / populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population) : xScale(d.Data[d.Data.length - 1]['Second Dose Administered'] * 100 / populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population))
        .attr('y', height / 2)
        .attr('dy', '4')
        .text(d => populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Letter_Code)
        .style('fill', 'var(--black')
        .style('font-size', '8px')
        .style('font-weight', '700')
        .style('font-family', 'IBM Plex Sans')
        .style('text-anchor', 'middle')
        .style('color', 'var(--black)')
        .on('mouseenter', (event, d: any) => {
          select(TooltipRef.current)
            .style('position', 'absolute')
            .style('display', 'inline')
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
          select(TooltipRef.current)
            .select('.population')
            .html(new Intl.NumberFormat('en-US').format(populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population))
          select(TooltipRef.current)
            .select('.stateName')
            .html(d.State)
          select(TooltipRef.current)
            .select('.totalDose')
            .html(`${(d.Data[d.Data.length - 1]['First Dose Administered'] * 100 / populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population).toFixed(2)}%`)
          select(TooltipRef.current)
            .select('.avgDose')
            .html(`${(d.Data[d.Data.length - 1]['Second Dose Administered'] * 100 / populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population).toFixed(2)}%`)

        })
        .on('mousemove', (event, _d) => {
          select(TooltipRef.current)
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
        })
        .on('mouseout', (_event, _d) => {
          select(TooltipRef.current)
            .style('display', 'none')
        })

      g.selectAll('.ticks')
        .data(arr)
        .enter()
        .append('line')
        .attr('class', 'ticks')
        .attr('x1', d => xScale(d))
        .attr('x2', d => xScale(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke-opacity', 0.5)
        .attr('stroke', 'var(--gray)')
        .attr('stroke-dasharray', '2,2')
      g.selectAll('.ticksText')
        .data(arr)
        .enter()
        .append('text')
        .attr('class', 'ticksText')
        .attr('x', d => xScale(d) + 5)
        .attr('y', 10)
        .style('font-size', '10px')
        .style('font-family', 'IBM Plex Sans')
        .style('color', 'var(--black)')
        .text(d => `${d}%`)
      g.append('line')
        .attr('class', 'nationalLine')
        .attr('x1', option === 'Atleast One Dose' ? xScale(refData['First Dose Administered'] * 100 / refPopulation) : xScale(refData['Second Dose Administered'] * 100 / refPopulation))
        .attr('x2', option === 'Atleast One Dose' ? xScale(refData['First Dose Administered'] * 100 / refPopulation) : xScale(refData['Second Dose Administered'] * 100 / refPopulation))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', 'var(--black)')
        .attr('stroke-width', '2')
      g.append('text')
        .attr('class', 'nationalLineText')
        .attr('x', option === 'Atleast One Dose' ? xScale(refData['First Dose Administered'] * 100 / refPopulation) : xScale(refData['Second Dose Administered'] * 100 / refPopulation))
        .attr('dx', '5')
        .attr('y', 10)
        .text('National %age')
        .style('font-size', '10px')
        .style('font-weight', '700')
        .style('font-family', 'IBM Plex Sans')
        .style('color', 'var(--black)')
      g.append('text')
        .attr('class', 'nationalLineText')
        .attr('x', option === 'Atleast One Dose' ? xScale(refData['First Dose Administered'] * 100 / refPopulation) : xScale(refData['Second Dose Administered'] * 100 / refPopulation))
        .attr('dx', '5')
        .attr('y', 20)
        .text(`${option === 'Atleast One Dose' ? (refData['First Dose Administered'] * 100 / refPopulation).toFixed(2) : (refData['Second Dose Administered'] * 100 / refPopulation).toFixed(2)}%`)
        .style('font-size', '10px')
        .style('font-weight', '700')
        .style('font-family', 'IBM Plex Sans')
        .style('color', 'var(--black)')
      forceSimulation(dataDuplicate as any)
        .force('x', forceX((d: any) => option === 'Atleast One Dose' ? xScale(d.Data[d.Data.length - 1]['First Dose Administered'] * 100 / populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population) : xScale(d.Data[d.Data.length - 1]['Second Dose Administered'] * 100 / populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population)).strength(10))
        .force('y', forceY(height / 2).strength(0.5))
        .force('collide', forceCollide((d: any) => radiusScale(populationData[populationData.findIndex(state => state.State_Name === d.State)].State_Population) + 1))
        .force('charge', forceManyBody().strength(0))
        .on('tick', tick)
        .tick(1000)

    }
  }, [GraphRef, TooltipRef, option, data, populationData, refData, refPopulation]);
  return (
    <>
      <Tooltip ref={TooltipRef}>
        <div><span className="stateName bold">StateName</span> (Tot. Pop.: <span className="population">0</span>)</div>
        <div>% of pop. with first dose: <span className="totalDose bold">0</span></div>
        <div>% of pop. fully vaccinated: <span className="avgDose bold">0</span></div>
      </Tooltip>
      <GraphContainer>
        <TitleDiv bottomMargin={40}>
          <h4>Percent of population vaccinated</h4>
          <div>
            <ToggleDiv>
              <ToggleOption className={`${option === 'Atleast One Dose' ? 'selected' : null}`} onClick={() => { setOption('Atleast One Dose') }}>Atleast One Dose</ToggleOption>
              <ToggleOption className={`${option === 'Fully Vaccinated' ? 'selected' : null}`} onClick={() => { setOption('Fully Vaccinated') }}>Fully Vaccinated</ToggleOption>
            </ToggleDiv>
          </div>
        </TitleDiv>
        <br />
        <svg width={windowWidth} height={(windowWidth * 450 / 900)} ref={GraphRef} viewBox={'0 0 900 450'} ></svg>
      </GraphContainer>
    </>
  );
};

export default BeeSwarmForStates;

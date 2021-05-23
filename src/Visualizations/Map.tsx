import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { select } from 'd3-selection';
import { StateDataType, StatePopulationDataType } from '../types';
import { scaleThreshold } from 'd3-scale';
import { geoMercator, geoPath } from 'd3-geo';
import * as topojson from 'topojson';
import MapData from '../data/india.json';

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
`

const SettingsDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
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

const SquareDiv = styled.div`
  width: 80px;
  height: 10px;
  background-color: ${props => props.color};
  @media (max-width: 768px) {
    width: 65px;
  }
  @media (max-width: 480px) {
    width: 50px;
  }
`
const KeyTitle = styled.div`
  font-size: 14px;
  color: var(--black);
  text-align: center;
  margin-top: 20px;
`
const LegendText = styled.div`
  font-size: 14px;
  color: var(--gray);
  text-align: center;
  @media (max-width: 768px) {
    font-size: 12px;
  }
  @media (max-width: 480px) {
    font-size: 10px;
  }
`

const KeyUnit = styled.div`
  display: flex;
  justify-content: center;
`

const Keys = styled.div`
  margin: auto;
  display: flex;
  align-items: start;
`


const DailyDoseViz = (props: Props) => {
  const {
    data,
    populationData,
    windowWidth,
  } = props;
  const GraphRef = useRef(null);
  const TooltipRef = useRef(null);
  const [option, setOption] = useState('Atleast One Dose');

  const colorArray = [
    {
      value: '#ffe6b3',
      firstDose: '<10%',
      secondDose: '<2.5%',
    },
    {
      value: '#febf84',
      firstDose: '10-15%',
      secondDose: '2.5-5%',
    },
    {
      value: '#f3995d',
      firstDose: '15-20%',
      secondDose: '5-7.5%',
    },
    {
      value: '#e1753d',
      firstDose: '20-25%',
      secondDose: '7.5-10%',
    },
    {
      value: '#c95324',
      firstDose: '25-30%',
      secondDose: '10-12.5%',
    },
    {
      value: '#ad3314',
      firstDose: '30-35%',
      secondDose: '12.5-15%',
    },
    {
      value: '#8c130e',
      firstDose: '>35%',
      secondDose: '>15%',
    },
  ];
  useEffect(() => {
    if (GraphRef.current && GraphRef !== null && TooltipRef.current && TooltipRef !== null) {
      const graphSVG = select(GraphRef.current);
      graphSVG.selectAll('g').remove();

      const colorScale = scaleThreshold()
        .domain([0.000001, 10, 15, 20, 25, 30, 35])
        .range(['#f1f1f1', '#ffe6b3', '#febf84', '#f3995d', '#e1753d', '#c95324', '#ad3314', '#8c130e'] as any)
      const projection = geoMercator()
        .scale(1425)
        .translate([-1600, 950]);
      const path = geoPath()
        .projection(projection)
      const mapShapeData: any = (topojson.feature(MapData as any, MapData.objects.states as any) as any);
      const g = graphSVG.append('g');
      g.selectAll('.path')
        .data(mapShapeData.features)
        .enter()
        .append('path')
        .attr('class', 'countryShape')
        .attr('d', (d: any) => path(d))
        .attr('opacity', 1)
        .attr('fill', (d: any) => {
          const indx = data.findIndex(state => state.State === d.properties.st_nm)
          const popIndx = populationData.findIndex(state => state.State_Name === d.properties.st_nm)
          const percent = (data[indx].Data[data[indx].Data.length - 1]['First Dose Administered'] * 100 / populationData[popIndx].State_Population)
          return colorScale(percent)
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .on('mouseenter', (event, d: any) => {
          const indx = data.findIndex(state => state.State === d.properties.st_nm)
          const popIndx = populationData.findIndex(state => state.State_Name === d.properties.st_nm)
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
            .html(d.properties.st_nm)
          select(TooltipRef.current)
            .select('.totalDose')
            .html(`${new Intl.NumberFormat('en-US').format(data[indx].Data[data[indx].Data.length - 1]['First Dose Administered'])} (${(data[indx].Data[data[indx].Data.length - 1]['First Dose Administered'] * 100 / populationData[popIndx].State_Population).toFixed(2)}%)`)
          select(TooltipRef.current)
            .select('.avgDose')
            .html(`${new Intl.NumberFormat('en-US').format(data[indx].Data[data[indx].Data.length - 1]['Second Dose Administered'])} (${(data[indx].Data[data[indx].Data.length - 1]['Second Dose Administered'] * 100 / populationData[popIndx].State_Population).toFixed(2)}%)`)

          select(event.target)
            .attr('stroke', '#2c2c2c')
            .attr('stroke-width', 2)
        })
        .on('mousemove', (event, d) => {
          select(TooltipRef.current)
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
        })
        .on('mouseout', (event, d) => {
          select(event.target)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
          select(TooltipRef.current)
            .style('display', 'none')
        })
    }
  }, [GraphRef, TooltipRef, data, populationData]);
  useEffect(() => {
    if (GraphRef.current && GraphRef !== null) {
      const graphSVG = select(GraphRef.current);
      const firstDoseArray = [0.000001, 10, 15, 20, 25, 30, 35];
      const secondDoseArray = [0.000001, 2.5, 5, 7.5, 10, 12.5, 15];
      const colorScale = scaleThreshold()
        .domain(option === 'Atleast One Dose' ? firstDoseArray : secondDoseArray)
        .range(['#f1f1f1', '#ffe6b3', '#febf84', '#f3995d', '#e1753d', '#c95324', '#ad3314', '#8c130e'] as any)
      graphSVG.selectAll('.countryShape')
        .attr('fill', (d: any) => {
          const indx = data.findIndex(state => state.State === d.properties.st_nm)
          const popIndx = populationData.findIndex(state => state.State_Name === d.properties.st_nm)

          const percent = option === 'Atleast One Dose' ?
            (data[indx].Data[data[indx].Data.length - 1]['First Dose Administered'] * 100 / populationData[popIndx].State_Population) :
            (data[indx].Data[data[indx].Data.length - 1]['Second Dose Administered'] * 100 / populationData[popIndx].State_Population)
          return colorScale(percent)
        })
    }
  }, [option, GraphRef, data, populationData]);
  return (
    <>
      <Tooltip ref={TooltipRef}>
        <div><span className="stateName bold">StateName</span> (Tot. Pop.: <span className="population">0</span>)</div>
        <div>First Dose Administered: <span className="totalDose bold">0</span></div>
        <div>Second Dose Administered: <span className="avgDose bold">0</span></div>
      </Tooltip>
      <SettingsDiv>
        <ToggleDiv>
          <ToggleOption className={`${option === 'Atleast One Dose' ? 'selected' : null}`} onClick={() => { setOption('Atleast One Dose') }}>Atleast One Dose</ToggleOption>
          <ToggleOption className={`${option === 'Fully Vaccinated' ? 'selected' : null}`} onClick={() => { setOption('Fully Vaccinated') }}>Fully Vaccinated</ToggleOption>
        </ToggleDiv>
      </SettingsDiv>
      <KeyTitle>Pct. of Population</KeyTitle>
      <KeyUnit>
        <Keys>
          {
            colorArray.map((d, i) =>
              <div key={i}>
                <SquareDiv color={d.value} />
                <LegendText>{option === 'Atleast One Dose' ? d.firstDose : d.secondDose}</LegendText>
              </div>
            )
          }
        </Keys>
      </KeyUnit>
      <GraphArea>
        <svg width={windowWidth} height={(windowWidth * 720 / 900) + 40} ref={GraphRef} viewBox={'0 0 900 720'}>
        </svg>
      </GraphArea>
    </>
  );
};

export default DailyDoseViz;

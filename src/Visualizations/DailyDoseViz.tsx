import { useRef, useEffect } from 'react';
import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';
import styled from 'styled-components';
import { select } from 'd3-selection';
import { line, curveStep } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisRight } from 'd3-axis';
import { CountryStateWithDeltaDataType } from '../types';

interface Props {
  data: CountryStateWithDeltaDataType[];
  windowWidth: number;
}

const GraphContainer = styled.div`
  max-width: 900px;
  margin: auto;
  font-size: 18px;
  line-height: 28px;
`
const Keys = styled.div`
  margin: 10px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

const Legend = styled.div`
  margin-right: 20px;
  display: flex;
  align-items: center;
`

const SquareDiv = styled.div`
  width: 16px;
  height: 16px;
  background-color: var(--primary-color-light);
  margin-right: 5px;
`

const LineDiv = styled.div`
  width: 24px;
  height: 3px;
  background-color: var(--primary-color-dark);
  margin-right: 5px;
`

const LegendText = styled.div`
  font-size: 14px;
  color: var(--gray);
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

const DailyDoseViz = (props: Props) => {
  const {
    data,
    windowWidth,
  } = props;
  const GraphRef = useRef(null);
  const TooltipRef = useRef(null);
  useEffect(() => {
    if (GraphRef.current && GraphRef !== null && TooltipRef.current && TooltipRef !== null) {
      const graphSVG = select(GraphRef.current);
      const formatTime = timeFormat('%B %d, %Y');
      graphSVG.selectAll('g').remove();
      const width = 900;
      const height = 400;
      const margin = {
        top: 0,
        left: 10,
        right: 0,
        bottom: 25,
      }
      const graphWidth = width - margin.left - margin.right;
      const graphHeight = height - margin.top - margin.bottom;
      const xScale = scaleTime()
        .range([0, graphWidth])
        .domain([data[0].Date, data[data.length - 1].Date]);
      const yScale = scaleLinear()
        .range([0, graphHeight])
        .domain([max(data, (d: CountryStateWithDeltaDataType) => d['Delta Doses Administered']), 0] as number[]);
      const ticksG = graphSVG.append('g');
      const g = graphSVG.append('g')
        .attr('transform', `translate(${margin.top},${margin.left})`);
      const barWidth = ((graphWidth) / data.length) - 4
      ticksG
        .append('g')
        .style('font-size', '10px')
        .style('font-family', 'IBM Plex Sans')
        .style('color', 'var(--black)')
        .attr('transform', `translate(0,${height - 20})`)
        .call(axisBottom(xScale).tickFormat(formatTime as any).ticks(5))
        .call((group) => {
          group.select('.domain').remove();
          group.selectAll('line').remove()
        });

      ticksG.append('g')
        .style('font-size', '10px')
        .style('font-family', 'IBM Plex Sans')
        .style('color', 'var(--black)')
        .attr('transform', `translate(0,10)`)
        .call(axisRight(yScale).ticks(4).tickFormat(format('.2s')).tickSize(width + margin.left + margin.right))
        .call((group) => {
          group.select('.domain').remove();

          group.selectAll('.tick line')
            .attr('stroke-opacity', 0.5)
            .attr('stroke', 'var(--gray)');

          group.selectAll('.tick:not(:last-of-type) line')
            .attr('stroke-dasharray', '2,2');
          group.selectAll('.tick text').attr('x', 0).attr('dy', -4)
        })

      g.selectAll('.bars')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bars')
        .attr('x', (d: CountryStateWithDeltaDataType) => xScale(d.Date) - barWidth / 2)
        .attr('height', (d: CountryStateWithDeltaDataType) => graphHeight - yScale(d['Delta Doses Administered']))
        .attr('width', barWidth)
        .attr('y', (d: CountryStateWithDeltaDataType) => yScale(d['Delta Doses Administered']))
        .style('fill', 'var(--primary-color-light)')
        .on('mouseenter', (event, d) => {
          select(TooltipRef.current)
            .style('position', 'absolute')
            .style('display', 'inline')
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
          select(TooltipRef.current)
            .select('.date')
            .html(formatTime(d.Date))
          select(TooltipRef.current)
            .select('.totalDose')
            .html(new Intl.NumberFormat('en-US').format(d['Delta Doses Administered']))
          select(TooltipRef.current)
            .select('.avgDose')
            .html(new Intl.NumberFormat('en-US').format(parseFloat((d['7-day Average Doses Administered']).toFixed(2))))

          select(event.target).style('fill', 'var(--primary-color')
        })
        .on('mousemove', (event, _d) => {
          select(TooltipRef.current)
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
        })
        .on('mouseout', (event, _d) => {
          select(event.target).style('fill', 'var(--primary-color-light')
          select(TooltipRef.current)
            .style('display', 'none')
        })

      const lineGraph = line()
        .x((d: any) => xScale(d.Date))
        .y((d: any) => yScale(d['7-day Average Doses Administered']))
        .curve(curveStep);
      g.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', lineGraph as any)
        .attr('fill', 'none')
        .style('stroke', 'var(--primary-color-dark)')
        .attr('stroke-width', 2);
      g.append('circle')
        .attr('cx', xScale(data[data.length - 1].Date))
        .attr('cy', yScale(data[data.length - 1]['7-day Average Doses Administered']))
        .attr('r', 2.5)
        .style('fill', 'var(--primary-color-dark)')
    }
  }, [GraphRef, TooltipRef, data]);
  return (
    <>
      <Tooltip ref={TooltipRef}>
        <div className="bold date">Date</div>
        <div>Total Doses: <span className="totalDose bold">0</span></div>
        <div>7-day Avg.: <span className="avgDose bold">0</span></div>
      </Tooltip>
      <GraphContainer>
        <h4>Daily reported doses administered</h4>
        < Keys>
          <Legend>
            <SquareDiv />
            <LegendText>Daily Doses</LegendText>
          </Legend>
          <Legend>
            <LineDiv />
            <LegendText>7-day running average</LegendText>
          </Legend>
        </Keys>
        <svg width={windowWidth} height={(windowWidth * 400 / 900)} ref={GraphRef} viewBox={'0 0 900 400'} ></svg>
      </GraphContainer>
    </>
  );
};

export default DailyDoseViz;

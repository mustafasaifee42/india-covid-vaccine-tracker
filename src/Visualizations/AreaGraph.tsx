import { useRef, useEffect } from "react";
import { timeFormat } from "d3-time-format";
import { format } from "d3-format";
import styled from "styled-components";
import { select } from "d3-selection";
import { line, curveStep, area } from "d3-shape";
import { scaleLinear, scaleTime } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisRight } from "d3-axis";
import { CountryStateWithDeltaDataType } from "../types";

interface Props {
  data: CountryStateWithDeltaDataType[];
  windowWidth: number;
}

const GraphContainer = styled.div`
  max-width: 900px;
  margin: auto;
  font-size: 18px;
  line-height: 28px;
`;
const Keys = styled.div`
  margin: 10px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const Legend = styled.div`
  margin-right: 20px;
  display: flex;
  align-items: center;
`;

const SquareDiv = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 5px;
`;

const LegendText = styled.div`
  font-size: 14px;
  color: var(--black);
`;

const AreaGraph = (props: Props) => {
  const { data, windowWidth } = props;
  const ManufacturingGraph = useRef(null);
  useEffect(() => {
    if (ManufacturingGraph.current && ManufacturingGraph !== null) {
      const graphSVG = select(ManufacturingGraph.current);
      const formatTime = timeFormat("%B %d, %Y");
      const width = 900;
      const height = 400;
      const margin = {
        top: 0,
        left: 10,
        right: 0,
        bottom: 25,
      };
      const graphWidth = width - margin.left - margin.right;
      const graphHeight = height - margin.top - margin.bottom;
      const xScale = scaleTime()
        .range([0, graphWidth])
        .domain([data[0].Date, data[data.length - 1].Date]);
      const yScale = scaleLinear()
        .range([0, graphHeight])
        .domain([
          max(
            data,
            (d: CountryStateWithDeltaDataType) => d["Total Doses Administered"]
          ),
          0,
        ] as number[]);
      const ticksG = graphSVG.append("g");
      const g = graphSVG
        .append("g")
        .attr("transform", `translate(${margin.top},${margin.left})`);
      ticksG
        .append("g")
        .style("font-size", "10px")
        .style("font-family", "IBM Plex Sans")
        .style("color", "var(--black)")
        .attr("transform", `translate(0,${height - 20})`)
        .call(
          axisBottom(xScale)
            .tickFormat(formatTime as any)
            .ticks(5)
        )
        .call((group) => {
          group.select(".domain").remove();
          group.selectAll("line").remove();
        });

      ticksG
        .append("g")
        .style("font-size", "10px")
        .style("font-family", "IBM Plex Sans")
        .style("color", "var(--black)")
        .attr("transform", `translate(0,10)`)
        .call(
          axisRight(yScale)
            .ticks(4)
            .tickFormat(format(".2s"))
            .tickSize(width + margin.left + margin.right)
        )
        .call((group) => {
          group.select(".domain").remove();
          group
            .selectAll(".tick line")
            .attr("stroke-opacity", 0.5)
            .attr("stroke", "var(--gray)");
          group
            .selectAll(".tick:not(:last-of-type) line")
            .attr("stroke-dasharray", "2,2");
          group.selectAll(".tick text").attr("x", 0).attr("dy", -4);
        });

      const areaGraph = area()
        .x((d: any) => xScale(d.Date))
        .y0(yScale(0))
        .y1((d: any) =>
          yScale(
            d[" Covaxin (Doses Administered)"] +
              d["Sputnik V (Doses Administered)"] +
              d["CoviShield (Doses Administered)"]
          )
        )
        .curve(curveStep);
      const covaxAreaGraph = area()
        .x((d: any) => xScale(d.Date))
        .y0(yScale(0))
        .y1((d: any) =>
          yScale(
            d[" Covaxin (Doses Administered)"] +
              d["Sputnik V (Doses Administered)"]
          )
        )
        .curve(curveStep);
      const sputnikAreaGraph = area()
        .x((d: any) => xScale(d.Date))
        .y0(yScale(0))
        .y1((d: any) => yScale(d["Sputnik V (Doses Administered)"]))
        .curve(curveStep);
      const lineGraph = line()
        .x((d: any) => xScale(d.Date))
        .y((d: any) =>
          yScale(
            d[" Covaxin (Doses Administered)"] +
              d["Sputnik V (Doses Administered)"] +
              d["CoviShield (Doses Administered)"]
          )
        )
        .curve(curveStep);
      const covaxLineGraph = line()
        .x((d: any) => xScale(d.Date))
        .y((d: any) =>
          yScale(
            d[" Covaxin (Doses Administered)"] +
              d["Sputnik V (Doses Administered)"]
          )
        )
        .curve(curveStep);
      const sputnikLineGraph = line()
        .x((d: any) => xScale(d.Date))
        .y((d: any) => yScale(d["Sputnik V (Doses Administered)"]))
        .curve(curveStep);
      g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", areaGraph as any)
        .style("opacity", "0.7")
        .style("fill", "var(--primary-color)");
      g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", covaxAreaGraph as any)
        .style("opacity", "0.7")
        .style("fill", "#ffc400");
      g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", sputnikAreaGraph as any)
        .style("opacity", "0.7")
        .style("fill", "#00aeff");
      g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", lineGraph as any)
        .style("stroke", "var(--primary-color)")
        .attr("fill", "none")
        .attr("stroke-width", 2);
      g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", covaxLineGraph as any)
        .style("stroke", "#ffc400")
        .attr("fill", "none")
        .attr("stroke-width", 2);
      g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", sputnikLineGraph as any)
        .style("stroke", "#00aeff")
        .attr("fill", "none")
        .attr("stroke-width", 2);
    }
  }, [ManufacturingGraph, data]);
  return (
    <GraphContainer>
      <h4>Cummulative doses administered by manufacturers</h4>
      <Keys>
        <Legend>
          <SquareDiv style={{ backgroundColor: "#00aeff" }} />
          <LegendText>
            Sputnik V Doses:{" "}
            <span className="bold">
              {(
                (data[data.length - 1]["Sputnik V (Doses Administered)"] *
                  100) /
                (data[data.length - 1]["Sputnik V (Doses Administered)"] +
                  data[data.length - 1][" Covaxin (Doses Administered)"] +
                  data[data.length - 1]["CoviShield (Doses Administered)"])
              ).toFixed(2)}
              %
            </span>
          </LegendText>
        </Legend>

        <Legend>
          <SquareDiv style={{ backgroundColor: "#ffc400" }} />
          <LegendText>
            Covaxin Doses:{" "}
            <span className="bold">
              {(
                (data[data.length - 1][" Covaxin (Doses Administered)"] * 100) /
                (data[data.length - 1]["Sputnik V (Doses Administered)"] +
                  data[data.length - 1][" Covaxin (Doses Administered)"] +
                  data[data.length - 1]["CoviShield (Doses Administered)"])
              ).toFixed(2)}
              %
            </span>
          </LegendText>
        </Legend>
        <Legend>
          <SquareDiv style={{ backgroundColor: "var(--primary-color)" }} />
          <LegendText>
            Covishield Doses:{" "}
            <span className="bold">
              {(
                (data[data.length - 1]["CoviShield (Doses Administered)"] *
                  100) /
                (data[data.length - 1]["Sputnik V (Doses Administered)"] +
                  data[data.length - 1][" Covaxin (Doses Administered)"] +
                  data[data.length - 1]["CoviShield (Doses Administered)"])
              ).toFixed(2)}
              %
            </span>
          </LegendText>
        </Legend>
      </Keys>
      <svg
        width={windowWidth}
        height={(windowWidth * 400) / 900}
        ref={ManufacturingGraph}
        viewBox={"0 0 900 400"}
      ></svg>
    </GraphContainer>
  );
};

export default AreaGraph;

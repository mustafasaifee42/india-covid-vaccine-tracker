import styled from 'styled-components';
import { BarGraphDataType } from '../types';

interface Props {
  data: BarGraphDataType[];
  totalValue: number;
  title?: string;
}

const GraphUnit = styled.div`
  margin: 20px 0;
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
  margin-right: 5px;
`

const LegendText = styled.div`
  font-size: 14px;
  color: var(--black);
`

const BarGraphContainer = styled.div`
  margin-bottom: 30px;
  display: flex;
  background-color: var(--light-gray);
`

const H4 = styled.h4`
  margin: 0;
`

const BarGraphEl = (props: Props) => {
  const {
    data,
    totalValue,
    title,
  } = props;
  return <GraphUnit>
    {title ? <H4>{title}</H4> : null}
    <Keys>
      {data.map((d, i) => <Legend key={i}>
        <SquareDiv style={{ backgroundColor: `${d.color}` }} />
        <LegendText>{d.key} <span className="bold">{(d.value * 100 / totalValue).toFixed(2)}%</span></LegendText>
      </Legend>
      )}
    </Keys>
    <BarGraphContainer>
      {data.map((d, i) => <div key={i} style={{ height: '60px', backgroundColor: `${d.color}`, width: `${d.value * 100 / totalValue}%` }}></div>)}
    </BarGraphContainer>
  </GraphUnit>
};

export default BarGraphEl;
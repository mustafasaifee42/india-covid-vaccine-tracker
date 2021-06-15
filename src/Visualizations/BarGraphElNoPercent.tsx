import styled from 'styled-components';
import { BarGraphDataType } from '../types';

interface Props {
  data: BarGraphDataType[];
  title?: string;
  subNote?: string;
}

interface BarProps {
  color: string;
  percent: number;
  textColor: string;
}

const GraphUnit = styled.div`
  margin: 40px 0 20px 0;
`

const BarGraphContainer = styled.div`
  margin: 20px 0 30px 0;
`

const H4 = styled.h4`
  margin: 0;
`


const SubNote = styled.span`
  font-size: 16px;
  font-style: italic;
  color: var(--dark-gray);
  font-weight: normal;
`

const BarEl = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 10px 0;
`;

const Bars = styled.div<BarProps>`
  background-color: ${props => props.color};
  color: ${props => props.textColor};
  font-weight: bold;
  font-size: 14px;
  padding: 10px;
  border-radius: 5px;
  width: ${props => `calc(${props.percent} * (100% - 110px))`};
`

const BarTitle = styled.div`
  width: 90px;
  font-size: 14px;
  font-weight: bold;
  color: ${props => props.color ? props.color : 'var(--black)'};
`

const BarGraphEl = (props: Props) => {
  const {
    data,
    title,
    subNote,
  } = props;
  let maxValue = 0;
  data.forEach(d => {
    if (d.value > maxValue) maxValue = d.value;
  })
  return <GraphUnit>
    {title ? <H4>{title} {subNote ? <SubNote>{subNote}</SubNote> : null}</H4> : null}
    <BarGraphContainer>
      {data.map((d, i) =>
        <BarEl key={i}>
          <BarTitle color={d.color}>{d.key}</BarTitle>
          <Bars color={d.value <= 0 ? 'white' : d.color} textColor={d.value > 0 ? 'white' : d.color} percent={d.value < 0 ? 1 : d.value / maxValue}>{d.value < 0 ? '0' : (d.value).toFixed(1)} days</Bars>
        </BarEl>)}
    </BarGraphContainer>
  </GraphUnit>
};

export default BarGraphEl;
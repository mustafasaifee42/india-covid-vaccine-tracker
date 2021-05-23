import { useState } from 'react';
import styled from 'styled-components';
import { CountryStateWithDeltaDataType, CityDataType } from '../types';
import { INDIAPOPULATION } from '../Constants';
import Select from 'react-dropdown-select';
import DistrictDailyDose from './DistrictDailyDose';
import BeeSwarmForDistrict from '../Visualizations/BeeSwarmForDistrict';
import ListViewForDistrict from '../Visualizations/ListViewForDistrict';

import PopulationData from '../data/populationData.json';

interface Props {
  districtData: CityDataType[];
  countryData: CountryStateWithDeltaDataType[];
  windowWidth: number;
}

const SelectDiv = styled.div`
  margin: 0;
  margin-top: 10px;
`

const StateViz = (props: Props) => {
  const { districtData, countryData, windowWidth } = props;
  const cityList: string[] = [];
  const options: { value: string, label: string, key: string }[] = [];
  districtData.forEach((district) => {
    if (cityList.indexOf(`${district.District}, ${district.State}`) === -1) {
      cityList.push(`${district.District}, ${district.State}`)
      options.push({
        'value': `${district.District}, ${district.State}`,
        'label': `${district.District}, ${district.State}`,
        'key': `${district.District}, ${district.State}`,
      })
    }
  })

  const [selectedOption, setSelectedOption] = useState({
    value: 'Mumbai, Maharashtra',
    label: 'Mumbai, Maharashtra',
    key: 'Mumbai, Maharashtra',
  });
  return <>
    <div className="container">
      <h3>Vaccination District by District</h3>
    </div>
    <BeeSwarmForDistrict
      dropdownOption={options}
      data={districtData}
      populationData={PopulationData}
      refData={countryData[countryData.length - 1]}
      refPopulation={INDIAPOPULATION}
      windowWidth={windowWidth}
    />
    <br />
    <div className="container">
      <h4>How District Vaccinations Stack Up</h4>
      <SelectDiv>
        <Select
          options={options}
          onChange={(value: any) => { setSelectedOption(value[0]) }}
          values={[selectedOption]}
          dropdownHeight="250px"
          dropdownPosition="auto"
        />
      </SelectDiv>
    </div>
    <br />
    <DistrictDailyDose
      windowWidth={windowWidth}
      districtData={districtData[districtData.findIndex(district => `${district.District}, ${district.State}` === selectedOption.label)].data}
      districtName={selectedOption.label}
      districtPopulation={PopulationData[PopulationData.findIndex(district => `${district.District_Name}, ${district.State_Name}` === selectedOption.label)].District_Population}
    />
    <br />
    <ListViewForDistrict
      title={'Indian Vaccination Campaign (District by District)'}
      data={districtData}
      populationData={PopulationData}
    />
  </>
};

export default StateViz;
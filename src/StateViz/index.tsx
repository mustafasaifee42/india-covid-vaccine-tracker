import { useState } from "react";
import styled from "styled-components";
import {
  StateDataType,
  StatePopulationDataType,
  CountryStateWithDeltaDataType,
} from "../types";
import { INDIAPOPULATION } from "../Constants";
import _ from "lodash";
import Select from "react-dropdown-select";
import StateDailyDose from "./StateDailyDose";
import BeeSwarmForStates from "../Visualizations/BeeSwarmForStates";
import IndiaTGMViz from "../Visualizations/TileGridMap";
import ColumnBarChart from "../Visualizations/ColumnBarChart";
import ListViewForStates from "../Visualizations/ListViewForStates";

import PopulationData from "../data/populationData.json";

interface Props {
  statesData: StateDataType[];
  countryData: CountryStateWithDeltaDataType[];
  windowWidth: number;
}

const SelectDiv = styled.div`
  margin-top: 20px;
`;
const H4 = styled.h4`
  margin-bottom: 10px;
`;

const H3 = styled.h3`
  margin-top: 40px;
`;

const StateViz = (props: Props) => {
  const { statesData, countryData, windowWidth } = props;

  const statesList = _.map(
    _.uniqBy(PopulationData, "State_Name"),
    "State_Name"
  );
  const statePopulation: StatePopulationDataType[] = statesList.map((state) => {
    const districtsInState = _.filter(
      PopulationData,
      (d) => d.State_Name === state
    );
    const State_Letter_Code = districtsInState[0].State_Letter_Code;
    let statePop = 0;
    districtsInState.forEach((d) => {
      statePop = statePop + d.District_Population;
    });
    return {
      State_Name: state,
      State_Population: statePop,
      State_Letter_Code,
    };
  });

  const options = statePopulation.map((state) => {
    return {
      value: `${state.State_Letter_Code}`,
      label: `${state.State_Name}`,
    };
  });

  const [selectedState, setSelectedState] = useState({
    value: "UP",
    label: "Uttar Pradesh",
  });

  const percentPopulationVaccinated = statesData.map((state) => {
    const dosage = state.Data[state.Data.length - 1]["First Dose Administered"];
    const popIndx = statePopulation.findIndex(
      (st) => st.State_Name === state.State
    );
    return {
      State: state.State,
      Percent: (dosage * 100) / statePopulation[popIndx].State_Population,
    };
  });

  const percentPopulationVaccinatedSorted = _.sortBy(
    percentPopulationVaccinated,
    (d) => d.Percent
  );
  return (
    <>
      <div className="container">
        <H3>Vaccination State by State</H3>
        <div>
          <span className="bold tags">
            {
              percentPopulationVaccinatedSorted[
                percentPopulationVaccinatedSorted.length - 1
              ].State
            }
          </span>{" "}
          lead the way with{" "}
          <span className="bold tags">
            {percentPopulationVaccinatedSorted[
              percentPopulationVaccinatedSorted.length - 1
            ].Percent.toFixed(2)}
            %
          </span>{" "}
          of population vaccinated with atleast one dose, followed by{" "}
          <span className="bold tags">
            {
              percentPopulationVaccinatedSorted[
                percentPopulationVaccinatedSorted.length - 2
              ].State
            }{" "}
            (
            {percentPopulationVaccinatedSorted[
              percentPopulationVaccinatedSorted.length - 2
            ].Percent.toFixed(2)}
            %)
          </span>{" "}
          and{" "}
          <span className="bold tags">
            {
              percentPopulationVaccinatedSorted[
                percentPopulationVaccinatedSorted.length - 3
              ].State
            }{" "}
            (
            {percentPopulationVaccinatedSorted[
              percentPopulationVaccinatedSorted.length - 3
            ].Percent.toFixed(2)}
            %)
          </span>
        </div>
        <br />
      </div>
      <BeeSwarmForStates
        data={statesData}
        populationData={statePopulation}
        refData={countryData[countryData.length - 1]}
        refPopulation={INDIAPOPULATION}
        windowWidth={windowWidth}
      />
      <br />
      <div className="container">
        <H4>Vaccine across India</H4>
        Across India,{" "}
        <span className="bold tags">
          {(
            (countryData[countryData.length - 1]["First Dose Administered"] *
              100) /
            INDIAPOPULATION
          ).toFixed(2)}
          %
        </span>{" "}
        of the population has been given alteast one dose and{" "}
        <span className="bold tags">
          {(
            (countryData[countryData.length - 1]["Second Dose Administered"] *
              100) /
            INDIAPOPULATION
          ).toFixed(2)}
          %
        </span>{" "}
        of population is fully vaccinated.
        <IndiaTGMViz
          data={statesData}
          populationData={statePopulation}
          windowWidth={windowWidth > 700 ? 700 : windowWidth}
        />
        <H4>Time needed to vaccinate the population</H4>
        Based on the current rolling 7-day average of daily vaccines
        administered the whole population of India will have one dose of vaccine
        in{" "}
        <span className="bold tags">
          {(
            (INDIAPOPULATION -
              countryData[countryData.length - 1][
                "Total Individuals Vaccinated"
              ]) /
            countryData[countryData.length - 1][
              "7-day Average Doses Administered"
            ] /
            365
          ).toFixed(1)}{" "}
          years
        </span>{" "}
        and fully vaccinated in next{" "}
        <span className="bold tags">
          {(
            (INDIAPOPULATION * 2 -
              countryData[countryData.length - 1]["Total Doses Administered"]) /
            countryData[countryData.length - 1][
              "7-day Average Doses Administered"
            ] /
            365
          ).toFixed(1)}{" "}
          years
        </span>
        . To fully vaccinate 70% (threshold estimated for herd immunity) of
        population{" "}
        <span className="bold tags">
          {(
            (0.7 * 2 * INDIAPOPULATION -
              countryData[countryData.length - 1]["Total Doses Administered"]) /
            countryData[countryData.length - 1][
              "7-day Average Doses Administered"
            ] /
            365
          ).toFixed(1)}{" "}
          years
        </span>{" "}
        will be needed.
      </div>
      <br />
      <ColumnBarChart
        data={statesData}
        populationData={statePopulation}
        refData={countryData[countryData.length - 1]}
        refPopulation={INDIAPOPULATION}
        windowWidth={windowWidth}
      />
      <br />
      <div className="container">
        <H4>How State Vaccinations Stack Up</H4>
        <SelectDiv>
          <Select
            options={options}
            onChange={(value: any) => {
              setSelectedState(value[0]);
            }}
            values={[selectedState]}
            dropdownHeight="250px"
            dropdownPosition="auto"
          />
        </SelectDiv>
        <br />
      </div>
      <StateDailyDose
        windowWidth={windowWidth}
        statesData={
          statesData[
            statesData.findIndex((state) => state.State === selectedState.label)
          ].Data
        }
        stateName={selectedState.label}
        statePopulation={
          statePopulation[
            statePopulation.findIndex(
              (st) => st.State_Name === selectedState.label
            )
          ].State_Population
        }
      />
      <br />
      <ListViewForStates
        title={"Indian Vaccination Campaign (State by State)"}
        data={statesData}
        populationData={statePopulation}
      />
    </>
  );
};

export default StateViz;

import { CountryStateWithDeltaDataType } from "../types";
import { useState } from "react";
import { INDIAPOPULATION } from "../Constants";
import { timeFormat } from "d3-time-format";
import BarGraphEl from "../Visualizations/BarGraphEl";
import BarGraphElNoPercent from "../Visualizations/BarGraphElNoPercent";
import DailyDoseViz from "../Visualizations/DailyDoseViz";
import AreaGraph from "../Visualizations/AreaGraph";
import styled from "styled-components";
import _ from "lodash";
import ProcurementData from "../data/procurementData.json";

interface Props {
  countryData: CountryStateWithDeltaDataType[];
  windowWidth: number;
}

const SubNote = styled.span`
  font-size: 16px;
  font-style: italic;
  font-weight: normal;
  color: var(--gray);
`;

const SubNoteBody = styled.span`
  font-size: 16px;
  font-style: italic;
  color: var(--dark-gray);
`;

const P = styled.p`
  line-height: 44px;
  margin: 0;
`;

const DateInput = styled.input`
  font-family: "IBM Plex Sans";
  width: 140px;
  font-size: 16px;
  border: 1px solid var(--black);
  border-radius: 3px;
  font-weight: 700;
  color: var(--primary-color);
  background-color: var(--light-gray);
  padding: 0 0 0 5px;
`;

const CalculatorDiv = styled.div`
  border-radius: 5px;
  padding: 20px;
  background-color: var(--very-light-gray);
  border: 1px solid var(--light-gray);
  box-shadow: 0 2px 5px 1px var(--gray);
`;

const H3 = styled.h3`
  margin-top: 40px;
`;

const CountrySection = (props: Props) => {
  const { countryData, windowWidth } = props;
  const [sliderValue, setSliderValue] = useState(70);
  const someDate = new Date();
  const numberOfDaysToAdd = 100;
  someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
  const [dateValue, setDateValue] = useState(someDate);
  const formatTime = timeFormat("%B %d, %Y");
  const formatDate = timeFormat("%Y-%m-%d");
  const totalProcuremnt = _.sumBy(
    ProcurementData,
    "Doses committed (in millions)"
  );
  const CovaxinTotal = _.sumBy(
    _.filter(
      ProcurementData,
      (d) => d["Vaccine candidate"] === "Bharat Biotech"
    ),
    "Doses committed (in millions)"
  );
  const CoviShieldTotal = _.sumBy(
    _.filter(
      ProcurementData,
      (d) => d["Vaccine candidate"] === "AstraZeneca/Oxford"
    ),
    "Doses committed (in millions)"
  );
  const SputknikTotal = _.sumBy(
    _.filter(ProcurementData, (d) => d["Vaccine candidate"] === "Gamaleya"),
    "Doses committed (in millions)"
  );
  const CorbevaxTotal = _.sumBy(
    _.filter(ProcurementData, (d) => d["Vaccine candidate"] === "Corbevax"),
    "Doses committed (in millions)"
  );

  return (
    <>
      <div className="container">
        In India, the total doses administerd by{" "}
        {formatTime(countryData[countryData.length - 1].Date)} are{" "}
        <span className="bold tags">
          {new Intl.NumberFormat("en-US").format(
            countryData[countryData.length - 1]["Total Doses Administered"]
          )}
        </span>
        , out of which{" "}
        <span className="bold tags">
          {new Intl.NumberFormat("en-US").format(
            countryData[countryData.length - 1]["First Dose Administered"]
          )}
        </span>{" "}
        are first dose and{" "}
        <span className="bold tags">
          {new Intl.NumberFormat("en-US").format(
            countryData[countryData.length - 1]["Second Dose Administered"]
          )}
        </span>{" "}
        are second dose. On{" "}
        {formatTime(countryData[countryData.length - 1].Date)}{" "}
        <span className="bold tags">
          {new Intl.NumberFormat("en-US").format(
            countryData[countryData.length - 1]["Delta Doses Administered"]
          )}
        </span>{" "}
        doses were administered in India.
        <br />
        <br />
        <span className="bold tags">
          {(
            (countryData[countryData.length - 1][
              "Total Individuals Vaccinated"
            ] *
              100) /
            INDIAPOPULATION
          ).toFixed(2)}
          %
        </span>{" "}
        of the population has been administered at least one dose and{" "}
        <span className="bold tags">
          {(
            (countryData[countryData.length - 1]["Second Dose Administered"] *
              100) /
            INDIAPOPULATION
          ).toFixed(2)}
          %
        </span>{" "}
        of the population has been fully vaccinated.
        <BarGraphEl
          data={[
            {
              value:
                countryData[countryData.length - 1]["First Dose Administered"] -
                countryData[countryData.length - 1]["Second Dose Administered"],
              color: "var(--primary-color-light)",
              key: "Only 1 Dose:",
            },
            {
              value:
                countryData[countryData.length - 1]["Second Dose Administered"],
              color: "var(--primary-color-dark)",
              key: "Fully Vaccinated:",
            },
            {
              value:
                INDIAPOPULATION -
                countryData[countryData.length - 1]["First Dose Administered"],
              color: "var(--light-gray)",
              key: "No Doses:",
            },
          ]}
          totalValue={INDIAPOPULATION}
        />
        <SubNoteBody>All population estimates are for 2020</SubNoteBody>
        <br />
        <br />
        The government of India announced that from May 1, 2021 everyone over
        the age of 18 will be elligible for vaccine.
        <h3>Doses administered by day</h3>
        In India, the total doses administerd on{" "}
        {formatTime(countryData[countryData.length - 1].Date)} were{" "}
        <span className="bold tags">
          {new Intl.NumberFormat("en-US").format(
            countryData[countryData.length - 1]["Delta Doses Administered"]
          )}
        </span>
        , out of which{" "}
        <span className="bold tags">
          {new Intl.NumberFormat("en-US").format(
            countryData[countryData.length - 1]["Delta First Dose Administered"]
          )}
        </span>{" "}
        were first dose and{" "}
        <span className="bold tags">
          {new Intl.NumberFormat("en-US").format(
            countryData[countryData.length - 1][
              "Delta Second Dose Administered"
            ]
          )}
        </span>{" "}
        were second dose.
      </div>
      <br />
      <br />
      <DailyDoseViz windowWidth={windowWidth} data={countryData} />
      <div className="container">
        <br />
        <br />
        Current rolling 7-day average of daily COVID-19 vaccines administered is{" "}
        <span className="bold tags">
          {new Intl.NumberFormat("en-US").format(
            parseFloat(
              countryData[countryData.length - 1][
                "7-day Average Doses Administered"
              ].toFixed(2)
            )
          )}
        </span>
        . At this rate the whole population of India will have one dose of
        vaccine in{" "}
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
        <br />
        <br />
        <CalculatorDiv>
          <P>
            To fully vaccinate
            <input
              className="slider"
              type="range"
              min="20"
              max="100"
              value={sliderValue}
              onChange={(event) => {
                setSliderValue(parseFloat(event.target.value));
              }}
              step="1"
            />
            <span className="bold tags">{sliderValue}%</span> of population by{" "}
            <DateInput
              type="date"
              value={formatDate(dateValue)}
              min={formatDate(new Date())}
              max="2025-12-31"
              onChange={(event) => {
                setDateValue(new Date(event.target.value));
              }}
            />
            ,{" "}
            <span className="tags bold">
              {new Intl.NumberFormat("en-US").format(
                Math.ceil((sliderValue / 100) * INDIAPOPULATION * 2) -
                  countryData[countryData.length - 1][
                    "Total Doses Administered"
                  ]
              )}
            </span>{" "}
            more doses are need to administer in next{" "}
            <span className="bold tags">
              {Math.ceil(
                (dateValue.getTime() - new Date().getTime()) /
                  (3600 * 24 * 1000)
              )}{" "}
              days
            </span>
            , at a rate of{" "}
            <span className="tags bold">
              {new Intl.NumberFormat("en-US").format(
                Math.ceil(
                  (Math.ceil((sliderValue / 100) * INDIAPOPULATION * 2) -
                    countryData[countryData.length - 1][
                      "Total Doses Administered"
                    ]) /
                    Math.ceil(
                      (dateValue.getTime() - new Date().getTime()) /
                        (3600 * 24 * 1000)
                    )
                )
              )}
            </span>{" "}
            doses per day ({" "}
            <span className="tags bold">
              {(Math.ceil((sliderValue / 100) * INDIAPOPULATION * 2) -
                countryData[countryData.length - 1][
                  "Total Doses Administered"
                ]) /
                Math.ceil(
                  (dateValue.getTime() - new Date().getTime()) /
                    (3600 * 24 * 1000)
                ) >
              countryData[countryData.length - 1][
                "7-day Average Doses Administered"
              ]
                ? "▲"
                : "▼"}{" "}
              {(
                ((Math.ceil(
                  (Math.ceil((sliderValue / 100) * INDIAPOPULATION * 2) -
                    countryData[countryData.length - 1][
                      "Total Doses Administered"
                    ]) /
                    Math.ceil(
                      (dateValue.getTime() - new Date().getTime()) /
                        (3600 * 24 * 1000)
                    )
                ) -
                  countryData[countryData.length - 1][
                    "7-day Average Doses Administered"
                  ]) *
                  100) /
                countryData[countryData.length - 1][
                  "7-day Average Doses Administered"
                ]
              ).toFixed(1)}
              %
            </span>
            {(Math.ceil((sliderValue / 100) * INDIAPOPULATION * 2) -
              countryData[countryData.length - 1]["Total Doses Administered"]) /
              Math.ceil(
                (dateValue.getTime() - new Date().getTime()) /
                  (3600 * 24 * 1000)
              ) >
            countryData[countryData.length - 1][
              "7-day Average Doses Administered"
            ]
              ? " increase"
              : " decrease"}{" "}
            from current average).
          </P>
        </CalculatorDiv>
        <H3>
          Vaccine Procurement <SubNote>Last Updated: June 17, 2021</SubNote>
        </H3>
        India has so far given doses of three approved vaccines and pre ordered
        one vaccine still under Phase 3 trial:
        <ul>
          <li>
            <span className="bold">CoviShield</span>: Developed by the
            Oxford-AstraZeneca and manufactured by the Serum Institute of India
          </li>
          <li>
            <span className="bold">Covaxin</span>: Developed by Bharat Biotech
            International Ltd in association with the Indian Council of Medical
            Research and National Institute of Virology
          </li>
          <li>
            <span className="bold">Sputnik V</span>: Developed by the Gamaleya
            Research Institute of Epidemiology and Microbiology in Russia
          </li>
          <li>
            <span className="bold">Corbevax</span>: Developed by Indian
            biopharmacutical firm Biological E. Limited, the Baylor College of
            Medicine in Houston, and Dynavax Technologies.{" "}
            <span className="italics">
              Purchase order placed while vaccine is still in Phase 3 trials.
            </span>
          </li>
        </ul>
        India has so far has finalised purchase of{" "}
        <span className="tags bold">
          {new Intl.NumberFormat("en-US").format(totalProcuremnt)} Million
        </span>{" "}
        doses of three approved vaccines.{" "}
        <SubNoteBody>
          Please note: The procurement of 300 million doses of Corbevax out of{" "}
          {new Intl.NumberFormat("en-US").format(totalProcuremnt)} Million doses
          will arrive in August and are not in use, as the vaccine is still
          under Pase 3 trials.
        </SubNoteBody>
        <BarGraphEl
          data={[
            {
              value: CoviShieldTotal,
              color: "#8624f5",
              key: `CoviShield (${CoviShieldTotal} mil):`,
            },
            {
              value: CovaxinTotal,
              color: "#1fc3aa",
              key: `Covaxin (${CovaxinTotal} mil):`,
            },
            {
              value: SputknikTotal,
              color: "#176884",
              key: `Sputnik V (${SputknikTotal} mil):`,
            },
            {
              value: CorbevaxTotal,
              color: "#ce440b",
              key: `Corbevax (${CorbevaxTotal} mil):`,
            },
          ]}
          totalValue={
            CoviShieldTotal + CovaxinTotal + SputknikTotal + CorbevaxTotal
          }
          title={"Procurement Based on Manufacturer"}
        />
        The current procurement is sufficient to fully vaccinated{" "}
        <span className="bold tags">
          {((totalProcuremnt * 1000000 * 100) / (INDIAPOPULATION * 2)).toFixed(
            2
          )}{" "}
          %
        </span>{" "}
        of population of India i.e.{" "}
        <span className="bold tags">{totalProcuremnt / 2} Million</span> people
        since all the vaccines are 2 dose vaccines.{" "}
        <SubNoteBody>
          Note that procurement does not mean that vaccination has been
          delivered to India but it means that orders have been placed by India.
        </SubNoteBody>
        <BarGraphEl
          data={[
            {
              value: totalProcuremnt * 1000000,
              color: "var(--primary-color-light)",
              key: "Population Covered:",
            },
            {
              value: INDIAPOPULATION * 2 - totalProcuremnt * 1000000,
              color: "var(--light-gray)",
              key: "Population Not Covered:",
            },
          ]}
          totalValue={INDIAPOPULATION * 2}
          title={"Population Covered"}
        />
        India has so far used{" "}
        <span className="tags bold">
          {new Intl.NumberFormat("en-US").format(
            countryData[countryData.length - 1]["Total Doses Administered"]
          )}{" "}
          (
          {(
            (countryData[countryData.length - 1]["Total Doses Administered"] *
              100) /
            (totalProcuremnt * 1000000)
          ).toFixed(2)}
          %)
        </span>{" "}
        doses out of the procured dosage.
        <BarGraphEl
          data={[
            {
              value:
                countryData[countryData.length - 1]["Total Doses Administered"],
              color: "var(--primary-color-light)",
              key: "Procured and used:",
            },
            {
              value:
                totalProcuremnt * 1000000 -
                countryData[countryData.length - 1]["Total Doses Administered"],
              color: "var(--light-gray)",
              key: "Produred but not used:",
            },
          ]}
          totalValue={totalProcuremnt * 1000000}
          title={"Dose Usage"}
        />
        India till now has administered{" "}
        <span className="bold tags">
          {new Intl.NumberFormat("en-US").format(
            countryData[countryData.length - 1][
              "CoviShield (Doses Administered)"
            ]
          )}
        </span>{" "}
        doses of CoviShield,{" "}
        <span className="bold tags">
          {new Intl.NumberFormat("en-US").format(
            countryData[countryData.length - 1][" Covaxin (Doses Administered)"]
          )}
        </span>{" "}
        doses of Covaxin and{" "}
        <span className="bold tags">
          {new Intl.NumberFormat("en-US").format(
            countryData[countryData.length - 1][
              "Sputnik V (Doses Administered)"
            ]
          )}
        </span>{" "}
        doses of Sputnuk V.
        <br />
        <br />
        India has already administered{" "}
        <span className="bold tags">
          {(countryData[countryData.length - 1][
            "CoviShield (Doses Administered)"
          ] *
            100) /
            (CoviShieldTotal * 1000000) >=
          100
            ? "all"
            : `${(
                (countryData[countryData.length - 1][
                  "CoviShield (Doses Administered)"
                ] *
                  100) /
                (CoviShieldTotal * 1000000)
              ).toFixed(2)}%`}
        </span>{" "}
        of procured doses of CoviShield,{" "}
        <span className="bold tags">
          {(countryData[countryData.length - 1][
            " Covaxin (Doses Administered)"
          ] *
            100) /
            (CovaxinTotal * 1000000) >=
          100
            ? "all"
            : `${(
                (countryData[countryData.length - 1][
                  " Covaxin (Doses Administered)"
                ] *
                  100) /
                (CovaxinTotal * 1000000)
              ).toFixed(2)}%`}
        </span>{" "}
        of procured doses of Covaxin, and{" "}
        <span className="bold tags">
          {(countryData[countryData.length - 1][
            "Sputnik V (Doses Administered)"
          ] *
            100) /
            (SputknikTotal * 1000000) >=
          100
            ? "all"
            : `${(
                (countryData[countryData.length - 1][
                  "Sputnik V (Doses Administered)"
                ] *
                  100) /
                (SputknikTotal * 1000000)
              ).toFixed(2)}%`}
        </span>{" "}
        of procured doses of Sputnik V.
        <br />
        <br />
        With the current 7 days running average of vaccination the remaining
        procured vaccines with last{" "}
        <span className="bold tags">
          {new Intl.NumberFormat("en-US").format(
            Math.ceil(
              (totalProcuremnt * 1000000 -
                countryData[countryData.length - 1][
                  "Total Doses Administered"
                ]) /
                countryData[countryData.length - 1][
                  "7-day Average Doses Administered"
                ]
            )
          )}
        </span>{" "}
        more days.{" "}
        <SubNoteBody>
          Note the current stock of vaccine available with the government will
          last for less time as all the vaccines procured are not yet delivered.
        </SubNoteBody>
        <BarGraphElNoPercent
          data={[
            {
              value:
                (CoviShieldTotal * 1000000 -
                  countryData[countryData.length - 1][
                    "CoviShield (Doses Administered)"
                  ]) /
                countryData[countryData.length - 1][
                  "7-day Average Doses Administered"
                ],
              color: "#8624f5",
              key: "CoviShield",
            },
            {
              value:
                (CovaxinTotal * 1000000 -
                  countryData[countryData.length - 1][
                    " Covaxin (Doses Administered)"
                  ]) /
                countryData[countryData.length - 1][
                  "7-day Average Doses Administered"
                ],
              color: "#1fc3aa",
              key: "Covaxin",
            },
            {
              value:
                (SputknikTotal * 1000000 -
                  countryData[countryData.length - 1][
                    "Sputnik V (Doses Administered)"
                  ]) /
                countryData[countryData.length - 1][
                  "7-day Average Doses Administered"
                ],
              color: "#176884",
              key: "Sputnik V",
            },
            {
              value:
                (CorbevaxTotal * 1000000) /
                countryData[countryData.length - 1][
                  "7-day Average Doses Administered"
                ],
              color: "#ce440b",
              key: "Corbevax*",
            },
          ]}
          title={"Days the Remaining Doses Will Last"}
          subNote={"Based on the 7-day running avg. doses administered"}
        />
        <SubNoteBody>
          *No doses of Corbevax has been administered yet, as the vaccine is
          still under Phase 3 trial and the order is pre-order supoose to be
          delivered around August.
        </SubNoteBody>
      </div>
      <br />
      <AreaGraph data={countryData} windowWidth={windowWidth} />
      <div className="container">
        <SubNoteBody>
          <br />
          <br />
          Please note procurement does not mean delivered, it just means thats
          the orders have been placed. So the no. of vaccines available is less
          than the no. procured.
          <br />
          <br />
          Total order and price per dose based are based on the Hindu Report.
          However, there are other reports (Reuters and Livemint reports from
          January) that suggest that number of doses ordered could be 11m.
          <br />
          <br />
          This procurement data doesn't not include the 500 million doses of
          Novavox vaccine as the procurement is unclear.
        </SubNoteBody>
      </div>
    </>
  );
};

export default CountrySection;

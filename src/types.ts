export interface  DataType {
  date: Date;
  Cummilative_Individuals_Registered: number;
  Cummilative_Sessions_Conducted: number;
  Total_Sites: number;
  Cummilative_First_Dose_Administered: number;
  Cummilative_Second_Dose_Administered: number;
  Cummilative_Total_Dose_Administered: number;
  Cummilative_Male_Individuals_Vaccinated: number;
  Cummilative_Female_Individuals_Vaccinated: number;
  Cummilative_Transgender_Individuals_Vaccinated: number;
  Cummilative_Covaxin_Administered: number;
  Cummilative_CoviShield_Administered: number;
  Delta_First_Dose_Administered: number;
  Delta_Second_Dose_Administered: number;
  Delta_Total_Dose_Administered: number;
  Delta_Male_Individuals_Vaccinated: number;
  Delta_Female_Individuals_Vaccinated: number;
  Delta_Transgender_Individuals_Vaccinated: number;
  Delta_Covaxin_Administered: number;
  Delta_CoviShield_Administered: number;
  '7_Day_Ruuning_Avg_First_Dose_Administered': number;
  '7_Day_Ruuning_Avg_Second_Dose_Administered': number;
  '7_Day_Ruuning_Avg_Total_Dose_Administered': number;
}


export interface CityDataType {
  State_Code: string;
  State: string;
  District_Key: string;
  Cowin_Key: string | string[];
  District: string;
  data: DataType[];
}

export interface CountryStateDataType {
  '18-45 years (Age)': string;
  '45-60 years (Age)': string;
  '60+ years (Age)': string;
  'AEFI': string;
  'Female(Individuals Vaccinated)': string;
  'First Dose Administered': string;
  'Male(Individuals Vaccinated)': string;
  'Second Dose Administered': string;
  'State': string;
  'Total Covaxin Administered': string;
  'Total CoviShield Administered': string;
  'Total Sputnik V Administered': string;
  'Total Doses Administered': string;
  'Total Individuals Vaccinated': string;
  'Total Sessions Conducted': string;
  'Total Sites ': string;
  'Transgender(Individuals Vaccinated)': string;
  'Updated On': string;
}

export interface CountryStateFormattedDataType {
  '18-45 years (Age)': number;
  '45-60 years (Age)': number;
  '60+ years (Age)': number;
  AEFI: number;
  'Female(Individuals Vaccinated)': number;
  'First Dose Administered': number;
  'Male(Individuals Vaccinated)': number;
  'Second Dose Administered': number;
  'Total Covaxin Administered': number;
  'Total CoviShield Administered': number;
  'Total Sputnik V Administered': number;
  'Total Doses Administered': number;
  'Total Individuals Vaccinated': number;
  'Total Sessions Conducted': number;
  'Total Sites ': number;
  'Transgender(Individuals Vaccinated)': number;
  'Date': Date;
}
export interface CountryStateWithDeltaDataType {
  '18-45 years (Age)': number;
  '45-60 years (Age)': number;
  '60+ years (Age)': number;
  AEFI: number;
  'Female(Individuals Vaccinated)': number;
  'First Dose Administered': number;
  'Male(Individuals Vaccinated)': number;
  'Second Dose Administered': number;
  'Total Covaxin Administered': number;
  'Total CoviShield Administered': number;
  'Total Sputnik V Administered': number;
  'Total Doses Administered': number;
  'Total Individuals Vaccinated': number;
  'Total Sessions Conducted': number;
  'Total Sites ': number;
  'Transgender(Individuals Vaccinated)': number;
  'Date': Date;
  'Delta 18-45 years (Age)': number;
  'Delta 45-60 years (Age)': number;
  'Delta 60+ years (Age)': number;
  'Delta Female(Individuals Vaccinated)': number;
  'Delta First Dose Administered': number;
  'Delta Male(Individuals Vaccinated)': number;
  'Delta Second Dose Administered': number;
  'Delta Covaxin Administered': number;
  'Delta CoviShield Administered': number;
  'Delta Sputnik V Administered': number;
  'Delta Doses Administered': number;
  'Delta Individuals Vaccinated': number;
  'Delta Transgender(Individuals Vaccinated)': number;
  '7-day Average 18-45 years (Age)': number;
  '7-day Average 45-60 years (Age)': number;
  '7-day Average 60+ years (Age)': number;
  '7-day Average Female(Individuals Vaccinated)': number;
  '7-day Average First Dose Administered': number;
  '7-day Average Male(Individuals Vaccinated)': number;
  '7-day Average Second Dose Administered': number;
  '7-day Average Covaxin Administered': number;
  '7-day Average CoviShield Administered': number;
  '7-day Average Sputnik V Administered': number;
  '7-day Average Doses Administered': number;
  '7-day Average Individuals Vaccinated': number;
  '7-day Average Transgender(Individuals Vaccinated)': number;
}

export interface StateDataType {
  'State': string;
  'Data': CountryStateWithDeltaDataType[];
}

export interface PopulationDataType {
  State_Name: string;
  District_Name: string;
  State_Letter_Code: string;
  District_Population: number;
}


export interface StatePopulationDataType {
  State_Name: string,
  State_Population: number;
  State_Letter_Code: string;
}

export interface BarGraphDataType {
  value: number;
  color: string;
  key: string;
}
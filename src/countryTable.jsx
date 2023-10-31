import { useEffect, useState } from "react";

export default function Countryable() {
  // State to hold the filter values for different criteria
  const [filters, setFilters] = useState({
    country: "",
    capital: "",
    region: "",
    subregion: "",
  });

  // State to hold the filtered data
  const [filteredData, setFilteredData] = useState([]);

  //State to hold the completed Data fetched from the API
  const [data, setData] = useState([]);

  // Fetch data asynchronously and update the data state
  useEffect(() => {
    fetchData().then((data) => {
      setData(data);
    });
  }, []);

  // Fetch data function (similar to your fetchData function)
  async function fetchData() {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/mledoze/countries/master/countries.json"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error on my path");
    }
  }

  // Function to handle filter input changes
  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  }

  // Function to filter the data based on user input
  useEffect(() => {
    const filtered = data.filter((item) => {
      const {
        name: { common },
        capital: [firstCapital],
        region,
        subregion,
      } = item;

      // Check if each criterion matches the corresponding filter value
      return (
        common.toLowerCase().includes(filters.country.toLowerCase()) &&
        (firstCapital
          ? firstCapital.toLowerCase().includes(filters.capital.toLowerCase())
          : false) &&
        region.toLowerCase().includes(filters.region.toLowerCase()) &&
        subregion.toLowerCase().includes(filters.subregion.toLowerCase())
      );
    });

    setFilteredData(filtered);
  }, [data, filters]);

  return (
    <>
      <input
        type="text"
        name="country"
        placeholder="Filter by Country Name"
        value={filters.country}
        onChange={handleFilterChange}
      />
      <input
        type="text"
        name="capital"
        placeholder="Filter by Capital"
        value={filters.capital}
        onChange={handleFilterChange}
      />
      <input
        type="text"
        name="region"
        placeholder="Filter by Region"
        value={filters.region}
        onChange={handleFilterChange}
      />
      <input
        type="text"
        name="subregion"
        placeholder="Filter by Subregion"
        value={filters.subregion}
        onChange={handleFilterChange}
      />
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Capital</th>
            <th>Region</th>
            <th>Subregion</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => {
            const {
              name: { common },
              capital: [firstCapital],
              region,
              subregion,
              latlng: [latitude, longitude],
            } = item;

            // Format latitude and longitude to have 2 decimal places
            const formattedLatitude = parseFloat(latitude).toFixed(2);
            const formattedLongitude = parseFloat(longitude).toFixed(2);
            return (
              <tr key={index}>
                <td>{common}</td>
                <td>{firstCapital}</td>
                <td>{region}</td>
                <td>{subregion}</td>
                <td>{formattedLatitude}</td>
                <td>{formattedLongitude}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

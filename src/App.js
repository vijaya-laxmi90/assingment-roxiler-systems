import logo from './logo.svg';
import './App.css';
import originalTableData from "./tableData.json"
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const enumMonth = [
  { 'January': 1 },
  { 'February': 2 },
  { 'March': 3 },
  { 'April': 4 },
  { 'May': 5 },
  { 'June': 6 },
  { 'July': 7 },
  { 'August': 8 },
  { 'September': 9 },
  { 'October': 10 },
  { 'November': 11 },
  { 'December': 12 }
];

function valueFormatter(value) {
  return `${value}mm`;
}

function App() {
  const [selectedMonth, setSelectedMonth] = useState ('March');
  const [originalTableDataCopy, setOriginalTableDataCopy] = useState ([]);
  const [tableData, setTableData] = useState ([]);
  const [currentPage, setCurrentPage] = useState (1);
  const [searchText, setSearchText] = useState ('');
  const [barChartDataset, setBarChartDataset] = useState ([
    {
      count: 0,
      priceRange: '0-100',
    },
    {
      count: 0,
      priceRange: '101-200',
    },
    {
      count: 0,
      priceRange: '201-300',
    },
    {
      count: 0,
      priceRange: '301-400',
    },
    {
      count: 0,
      priceRange: '401-500',
    },
    {
      count: 0,
      priceRange: '501-600',
    },
    {
      count: 0,
      priceRange: '601-700',
    },
    {
      count: 0,
      priceRange: '701-800',
    },
    {
      count: 0,
      priceRange: '801-900',
    },
    {
      count: 0,
      priceRange: '901-above',
    }
  ])
  const itemPerPage = 3;

  useEffect(() => {
    // const getTableDataFromS3 = async () => {
    //   try {
    //     return new Promise ((resolve, reject) => {
    //       // fetch ('https://s3.amazonaws.com/roxiler.com/product_transaction.json', { mode: 'cors' })
    //       // .then ((response) => {
    //       //   if (!response.ok) reject (response)
    //       //   resolve (response)}
    //       // )
    //       // .catch (error => reject (error));
    //       fetch("tableData.json")
    //       .then (response => resolve (response.json()))
    //       .catch (error => reject ('error'));
    //     })
    //   } catch (getTableDataError) {
    //     console.log (getTableDataError)
    //   }
    // }
    

    // getTableDataFromS3 ()
    // .then (response => console.log ('response: ', response))
    // .catch (error => console.error('Error: ', error));
    const selectedMonthID = enumMonth.filter ((enumMonthObject) => {
      if (Object.keys(enumMonthObject)[0] === selectedMonth) return true;
      return false;
    })[0][selectedMonth];

    if (originalTableData?.data){
      const currentMonthTableData = originalTableData.data.filter((dataObject) => {
        if (dataObject.dateOfSale.split('-')[1] == selectedMonthID) return true;
        return false;
      })
      
      setTableData (currentMonthTableData.slice (0, itemPerPage));
      setOriginalTableDataCopy (currentMonthTableData);
    }
  }, []);

  useEffect (() => {
    const selectedMonthID = enumMonth.filter ((enumMonthObject) => {
      if (Object.keys(enumMonthObject)[0] === selectedMonth) return true;
      return false;
    })[0][selectedMonth];
    
    const currentMonthTableData = originalTableData.data.filter((dataObject) => {
      if (dataObject.dateOfSale.split('-')[1] == selectedMonthID) return true;
      return false;
    })
    
    setTableData (currentMonthTableData.slice (0, itemPerPage));
    setOriginalTableDataCopy (currentMonthTableData);
    setCurrentPage(1);

    let countArray = [];
    for (let i = 0; i <= 9; i += 1) countArray.push (0);
    for (let i = 0; i < currentMonthTableData.length; i += 1) {
      const originalTableDataCopyObject = currentMonthTableData [i];
      if (originalTableDataCopyObject.price >= 901) countArray[9] += 1;
      else countArray[parseInt(parseInt(originalTableDataCopyObject.price) / 100)] += 1;
    }
    console.log(countArray);
    
    // updating bar chart data
    let tempBarChartDataset = barChartDataset;
    for (let i = 0; i < 9; i += 1) {
      tempBarChartDataset[i].count = countArray[i];
    }
    setBarChartDataset (tempBarChartDataset);
  }, [selectedMonth]);

  useEffect (() => {
    if (!originalTableDataCopy || originalTableDataCopy.length == 0) return; 
    if (!searchText || searchText.length == 0) setTableData (originalTableDataCopy);
    setTableData (originalTableDataCopy.filter((originalTableDataCopyObj) => {
      if (originalTableDataCopyObj.title.toLowerCase().includes(searchText.toLowerCase ())) return true;
      else if (originalTableDataCopyObj.description.toLowerCase ().includes(searchText.toLowerCase ())) return true;
      else if (originalTableDataCopyObj.price.toString ().toLowerCase ().includes(searchText.toLowerCase ())) return true;

      return false;
    }))
  }, [searchText])
  
  const handleSelectedOtherMonth = (e) => {
    console.log(e.target.value);
    setSelectedMonth (e.target.value)
  }
  
  const handleSearchTextUpdate = (e) => {
    setSearchText(e.target.value);
  }
  

  const handleNextClick = () => {
    console.log('originalTableDataCopy', originalTableDataCopy);
    
    if (currentPage * itemPerPage >= originalTableDataCopy.length) return;
    else if (!originalTableDataCopy) return;
    setTableData (originalTableDataCopy.slice ((currentPage * itemPerPage), (currentPage * itemPerPage) + itemPerPage));
    setCurrentPage (currentPage + 1);
  }

  const handlePrevClick = () => {
    if (currentPage <= 1) return;
    setTableData (originalTableDataCopy.slice ((currentPage * itemPerPage) - itemPerPage, (currentPage * itemPerPage)));
    setCurrentPage (currentPage - 1);
  }

  return (
    <div className="main-container">
      <div className='row row-1'>
        <header className="pointer_cursor" onClick={() => window.location.reload () }>
          <div className='header'>
            <div>Transaction</div>
            <div>Dashboard</div>
          </div>
        </header>
      </div>
      <div className='row row-2'>
        <input 
          type='text' 
          placeholder='Search transaction by Title, Description, or Price ...'
          value={searchText}
          onChange={handleSearchTextUpdate}
        />
        <select value={selectedMonth} onChange={handleSelectedOtherMonth}>
          {
            enumMonth.map ((enumMonthObject, enumMonthKey) => {
              const currentMonth = Object.keys(enumMonthObject)[0]
              return (
                <option key={enumMonthKey} name={currentMonth}>{currentMonth}</option>
              )
            })
          }
        </select>
      </div>
      <div className='row row-3'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              {/* <th>Sale month</th> */}
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {
              tableData.map ((tableDataObject, tableDataKey) => {
                return (
                  <tr key={tableDataKey}>
                    <td>{tableDataObject.id}</td>
                    <td>{tableDataObject.title}</td>
                    <td>{tableDataObject.description}</td>
                    <td>{tableDataObject.price}</td>
                    <td>{tableDataObject.category}</td>
                    {/* <td>{Object.keys(enumMonth.filter((enumMonthObj) => {
                      const tempMonth = Object.keys(enumMonthObj)[0];
                      const tempMonthId = enumMonthObj[tempMonth];
                      if (tempMonthId === parseInt (tableDataObject.dateOfSale.split('-')[1])) return true;
                      return false;
                    })[0])[0]}</td> */}
                    <td>{tableDataObject.sold ? 'Yes' : 'No' }</td>
                    <td><img className="icon-image" src={tableDataObject.image} alt={tableDataObject.image}/></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      <div className='row row-4'>
          <span>Page No: {currentPage}</span>
          <span>
            <span 
              className= { 'mg-right-5 pointer_cursor' } 
              onClick={handleNextClick}
            >Next</span>
            <span>-</span>
            <span 
              className='mg-left-5 pointer_cursor'
              onClick={handlePrevClick}
            >Previous</span>
          </span>
          <span>Per Page: {itemPerPage}</span>
      </div>
      <div className='row row-5'>
          <div>Statistics - {selectedMonth}</div>
      </div>
      <div className='row row-6'>
          <div>
            <div>
              <span>Total Sale</span>
              <span>{originalTableDataCopy.length}</span>
            </div>
            <div>
              <span>Total Sold item</span>
              <span>{originalTableDataCopy.filter((originalTableDataCopyObj) => {
                return originalTableDataCopyObj.sold;
              }).length}</span>
            </div>
            <div>
              <span>Total not Sold item</span>
              <span>{originalTableDataCopy.length - originalTableDataCopy.filter((originalTableDataCopyObj) => {
                return originalTableDataCopyObj.sold;
              }).length}</span>
            </div>
          </div>
      </div>
      <div className='row row-5'>
          <div>Bar Chart Stats - {selectedMonth}</div>
      </div>
      <div className='row row-7'>
        <BarChart
          dataset={barChartDataset}
          yAxis={[{ scaleType: 'band', dataKey: 'priceRange' }]}
          series={[{ dataKey: 'count', valueFormatter }]}
          layout="horizontal"
          {...chartSetting}
        />
      </div>
    </div>
  );
}

const chartSetting = {
  xAxis: [
    {
      label: 'Count',
    },
  ],
  width: 700,
  height: 400,
};

export default App;

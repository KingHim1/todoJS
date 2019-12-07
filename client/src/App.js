import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import axios from 'axios';
// import {LicenseManager} from "ag-grid-enterprise";
// LicenseManager.setLicenseKey("your license key");





function App() {
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
  const [userDetails, setUserDetails] = useState({name: "", password: ""})
  const [state, setState] = useState({
    columnDefs: [{
  headerName: "Make", field: "make", sortable:true, filter: true,
},{
  headerName: "Price", field: "price", sortable: true
}],
// autoGroupColumnDef: {
//   headerName: "Model",
//   field: "model",
//   // cellRenderer:'agGroupCellRenderer',
//   // cellRendererParams: {
//   //   checkbox: true
//   // }
// },
})

const onClick = () => {
  
  axios.get('http://localhost:5000/api/pets')
    .then(
      response => console.log(response.data)
    )
}
const title = 'Car Sell Report';
const header = ["Year", "Month", "Make", "Model", "Quantity", "Pct"]
const data = [
  [2007, 1, "Volkswagen ", "Volkswagen Passat", 1267, 10],
  [2007, 1, "Toyota ", "Toyota Rav4", 819, 6.5],
  [2007, 1, "Toyota ", "Toyota Avensis", 787, 6.2],
  [2007, 1, "Volkswagen ", "Volkswagen Golf", 0, 5.7],
  [2007, 1, "Toyota ", "Toyota Corolla", 691, 5.4],
];

let workbook = new Workbook();
let worksheet = workbook.addWorksheet('Car Data');

// Add new row
let titleRow = worksheet.addRow([title]);
// Set font, size and style in title row.
titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
// Blank Row
worksheet.addRow([]);
//Add row with current date
// let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')]);

//Add Header Row
let headerRow = worksheet.addRow(header);

// Cell Style : Fill and Border
headerRow.eachCell((cell, number) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF00' },
    bgColor: { argb: 'FF0000FF' }
  }
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
});

// Add Data and Conditional Formatting
data.forEach(d => {
  let row = worksheet.addRow(d);
  let qty = row.getCell(5);
  let color = 'FF99FF99';
  if (+qty.value < 500) {
    color = 'FF9999'
  }

  qty.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: color }
  }
}

);


const onClickButton = (e) => {
  
  // workbook.xlsx.writeBuffer().then((data) => {
  //   let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   fs.saveAs(blob, 'CarData.xlsx');
  // });
  console.log("test on click button");
  axios.post('http://localhost:5000/auth/', {
    username: userDetails.name,
    password: userDetails.password,
  })
    .then(
      response => console.log(response)
    )
}


var dataFetched = false;
useEffect(()=>{
  if (state.rowData === undefined){
  fetch('https://api.myjson.com/bins/ly7d1')
.then(result => result.json())
.then(rowData => {
    setState({...state, rowData: rowData});
    console.log(dataFetched)
    dataFetched = true;
    console.log(rowData);
}
)
}
})


  return (
    <div className="App">

			<h1>Login Form</h1>
			<form onSubmit={onClickButton}>
				<input type="text" name="username" placeholder="Username" required value={userDetails.name} onChange={(e) => {console.log(e.target.value); setUserDetails({...userDetails, name: e.target.value})}}/>
				<input type="password" name="password" placeholder="Password" required value={userDetails.password} onChange ={(e) => {console.log("test"); setUserDetails({...userDetails, password: e.target.value})}}/>
				<input type="submit" onSubmit={onClickButton}/>
			</form>
	


      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <button onClick={onClick}></button>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          target="_blank"
          rel="noopener noreferrer"
          onClick = {onClickButton}
        >
          Learn React
        </a>
      </header>
	<div
        className="ag-theme-balham"
        style={{
        height: '500px',
        width: '600px' }}
      >
        <AgGridReact
          columnDefs={state.columnDefs}
          rowData={state.rowData}>
        </AgGridReact>
      </div>
    </div>
  );
}

export default App;

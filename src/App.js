import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import Sunburst from "./SunburstChartInt";
import data from "./data2";
import { Button, Divider, TextField } from "@mui/material";
import DataGrid from "./components/DataGrid";
import Drawer from "./components/Drawer";
import CollapsibleTable from "./components/CollapseTable";

function App() {
  const [chart, setChart] = React.useState(true);
  const [renderElement, setRenderElement] = React.useState([]);
  const [newAccountValue, setNewAccountValue] = useState("");
  const [newBalanceValue, setNewBalanceValue] = useState("");
  const [rows, setRows] = useState([]);
  const [jsonData, setJsonData] = useState({
    name: "BASE_ACCOUNT",
    children: [],
  });
  const [jsonChildrens, setJsonChildrens] = useState({});

  const handleClick = () => {
    setChart(!chart);
  };

  useEffect(() => {
    makeJson(rows);
  }, [rows]);

  const appendStateArray = (newItem, getAction, setAction) => {
    let newStateArray = [...newItem, ...getAction];
    setAction(newStateArray);
  };

  const appendRow = (newFields = {}) => {
    if (Object.keys(newFields).length < 1) return;

    const newRow = [];
    const { balance, account } = newFields;

    if (jsonChildrens[account] !== undefined) {
      return;
    }

    newRow.push({ id: Date.now(), account: account, balance: balance });
    appendStateArray(newRow, rows, setRows);

    setJsonChildrens({
      ...jsonChildrens,
      [account]: [{ name: "uncategorized", value: balance }],
    });
  };

  const makeJson = (rows) => {
    if (rows.length < 1) return;
  };

  const loadData = (data) => {
    if (!data && data === undefined && data?.children === undefined) return;

    const tempData = data;

    const newElements = [];

    const manipulateJSON = () => {
      // tempData.children
      console.log(tempData);
    };

    data.children.forEach((child) => {
      newElements.push(
        <TextField
          key={child.name}
          style={{ width: "500px", margin: "10px" }}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          value={child.name}
        />
      );
      newElements.push(<Button onClick={() => manipulateJSON()}>+</Button>);
      newElements.push(<Divider />);
      // console.log(renderElement);
      child.children.forEach((child) => {
        if (child.children !== undefined) {
          child.children.forEach((child) => {
            newElements.push(
              <TextField
                style={{ width: "500px", margin: "10px" }}
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
                value={child.name}
              />
            );
          });
        }
      });
      newElements.push(<Divider />);
    });

    appendStateArray(newElements, renderElement, setRenderElement);
  };

  useEffect(() => {
    if (Object.keys(jsonChildrens).length < 1) {
      return;
    }
    setJsonData((jsonData) => {
      return {
        ...jsonData,
        children: Object.entries(jsonChildrens).map(([key, value]) => {
          return {
            name: key,
            children: value,
          };
        }),
      };
    });

    console.log("Updating...", jsonData);
  }, [jsonChildrens]);

  const handleSave = (saveData) => {
    const updatedChildren = jsonChildrens;
    updatedChildren[saveData["name"]] = saveData["children"];
    setJsonChildrens((jsonChildren) => ({
      ...jsonChildren,
      [saveData["name"]]: saveData["children"],
    }));
  };

  // React.useEffect(() => {
  //   loadData(data);
  // }, []);

  const renderForm = () => {
    // console.log(renderElement);

    return (
      <React.Fragment>
        <h1>Account Overview</h1>
        <TextField
          style={{ width: "500px", margin: "10px" }}
          id="outlined-basic"
          label="Account"
          variant="outlined"
          value={newAccountValue}
          onChange={(e) => setNewAccountValue(e.target.value)}
        />

        <TextField
          style={{ width: "500px", margin: "10px" }}
          id="outlined-basic"
          label="Balance"
          variant="outlined"
          value={newBalanceValue}
          onChange={(e) => setNewBalanceValue(e.target.value)}
        />
        <Button
          onClick={() =>
            appendRow({ account: newAccountValue, balance: newBalanceValue })
          }
        >
          Add
        </Button>
        <div style={{ justifyContent: "center", display: "flex" }}>
          <CollapsibleTable
            onSave={handleSave}
            data={jsonData}
          ></CollapsibleTable>
        </div>
        {/* <DataGrid rows={rows}></DataGrid> */}
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        ></div>
        {renderElement}
        <Button variant="outlined" onClick={handleClick}>
          Switch to Chart
        </Button>
      </React.Fragment>
    );
  };

  console.log(jsonData);

  return (
    <div className="App">
      {!chart && Object.keys(jsonData).length > 0 ? (
        <Sunburst
          data={jsonData}
          keyId="Sunburst"
          width={800}
          size={900}
          handleClick={handleClick}
        />
      ) : (
        renderForm()
      )}
    </div>
  );
}

export default App;

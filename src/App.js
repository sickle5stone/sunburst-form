import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import Sunburst from "./SunburstChartInt";
import data3 from "./data3";
import datamap from "./datamap";
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import DataGrid from "./components/DataGrid";
import Drawer from "./components/Drawer";
import { default as MuiDrawer } from "@mui/material/Drawer";
import CollapsibleTable from "./components/CollapseTable";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { sortOnCategories } from "./utils";
import { Home, Mail, MarkunreadMailbox, Settings } from "@mui/icons-material";
import { json } from "d3";
import { styled as muiStyled } from "@mui/system";

const StyledAddButton = muiStyled(Button)({
  whitespace: "nowrap",
  minWidth: "fit-content",
  padding: "11.5px 24px",
  fontWeight: "bold",
});

function App() {
  const [chart, setChart] = React.useState(false);
  const [show, setShow] = React.useState(true);
  const [renderElement, setRenderElement] = React.useState([]);
  const [newAccountValue, setNewAccountValue] = useState("");
  const [newBalanceValue, setNewBalanceValue] = useState(0);
  const [newEntityValue, setNewEntityValue] = useState("");
  const [newEntityBalanceValue, setNewEntityBalanceValue] = useState(0);
  const [newOrgValue, setNewOrgValue] = useState("");
  const [newOrgBalanceValue, setNewOrgBalanceValue] = useState(0);
  const [entitySelected, setEntitySelected] = useState(0);
  const [entityChild, setEntityChild] = useState({});
  const [categoryFilter, setCategoryFilter] = useState("");
  const [storedValue, setStoredValue] = useState({});
  const [disableForm, setDisableForm] = useState(false);
  const [activeAccount, setActiveAccount] = useState(undefined);

  const [rows, setRows] = useState([]);
  // console.log(data3);
  const [jsonData, setJsonData] = useState(
    {
      name: "AcmeCorp",
      total: 0,
      children: [],
    }
    // JSON.parse(JSON.stringify(data3))
  );

  const [jsonChildrens, setJsonChildrens] = useState(
    datamap || {
      org: {
        name: "AcmeCorp",
        total: 100,
        entities: {},
      },
    }
  );

  const sortDataOnCategories = (focus) => {
    const newData = sortOnCategories(jsonChildrens);
    setStoredValue(jsonChildrens);
    setDisableForm(true);
    setCategoryFilter(focus);
    console.log(newData);
    setJsonChildrens(newData);
  };

  useEffect(() => {
    makeJson(rows);
  }, [rows]);

  useEffect(() => {
    const storedName = localStorage.getItem("org", orgName);

    setJsonChildrens((prevState) => ({
      org: {
        ...prevState.org,
        name: storedName,
      },
    }));
  }, []);

  const appendStateArray = (newItem, getAction, setAction) => {
    let newStateArray = [...newItem, ...getAction];
    setAction(newStateArray);
  };

  const appendEntity = (newFields = {}) => {
    if (Object.keys(newFields).length < 1) return;

    const { balance, entity } = newFields;

    setJsonChildrens((prevState) => {
      return {
        org: {
          ...prevState["org"],
          entities: {
            ...prevState["org"]["entities"],
            [entity]: {
              total: Number.parseInt(balance),
              accounts: {
                account1: {
                  total: Number.parseInt(balance),
                  categories: {
                    "General Purpose": Number.parseInt(balance),
                  },
                },
              },
            },
          },
        },
      };
    });

    setNewEntityValue("");
    setNewEntityBalanceValue(0);
  };

  // console.log(jsonChildrens);

  const appendRow = (newFields = {}) => {
    if (Object.keys(newFields).length < 1) return;

    // const newRow = [];
    const { entity, level, key, balance, account } = newFields;

    // const balance = Number.parseInt(balanceStr);

    let newObj = JSON.parse(JSON.stringify(jsonChildrens));
    newObj["org"]["total"] += Number.parseInt(balance);
    newObj["org"]["entities"][entitySelected]["total"] +=
      Number.parseInt(balance);
    newObj["org"]["entities"][entitySelected]["accounts"] = {
      ...newObj["org"]["entities"][entitySelected]["accounts"],
      [account]: {
        total: balance,
        categories: {
          "General Purpose": balance,
        },
      },
    };
    setJsonChildrens(newObj);

    // console.log(newJsonChildrens);
    // setJsonChildrens(newJsonChildrens);
    setNewAccountValue("");
    setNewBalanceValue(0);

    // console.log(jsonChildrens["org"]["entities"][entitySelected]);
    // setJsonChildrens();

    if (jsonChildrens[account] !== undefined) {
      return;
    }
  };

  const makeJson = (rows) => {
    if (rows.length < 1) return;
  };

  useEffect(() => {
    if (Object.keys(jsonChildrens).length < 1) {
      return;
    }
    let total = 0;

    console.log("update was called");

    if (jsonChildrens?.["org"]?.["entities"]) {
      setJsonData({
        name: jsonChildrens["org"]["name"],
        total: jsonChildrens["org"]["total"],
        children:
          [
            ...Object.entries(jsonChildrens["org"]["entities"]).map(
              ([key, value]) => {
                return {
                  name: key,
                  total: value.total,
                  children:
                    Object.entries(value?.accounts).map(([key, value]) => {
                      return {
                        name: key,
                        total: value.total,
                        children:
                          Object.entries(value?.categories).map(
                            ([key, value]) => {
                              // console.log(key, value);
                              return {
                                name: key,
                                total: value,
                                value,
                              };
                            }
                          ) || [],
                      };
                    }) || [],
                };
              }
            ),
          ] || [],
      });
    } else {
      const entityMap = {};
      jsonChildrens?.["org"]?.["categories"][categoryFilter].accounts.forEach(
        (acc) => {
          // console.log(acc);
          if (entityMap[acc.entity]) {
            entityMap[acc.entity] = {
              total: entityMap[acc.entity].total + acc.total,
              accounts: [
                ...entityMap[acc.entity].accounts,
                { name: acc.account, total: acc.total },
              ],
            };
          } else {
            entityMap[acc.entity] = {
              total: acc.total,
              accounts: [
                {
                  name: acc.account,
                  total: acc.total,
                },
              ],
            };
          }
        }
      );
      // console.log(jsonChildrens["org"]["categories"][categoryFilter]);

      setJsonData({
        name: categoryFilter,
        total: jsonChildrens?.["org"]?.["categories"][categoryFilter]["total"],
        children: Object.entries(entityMap).map(([key, value]) => {
          // console.log(value);
          return {
            name: key,
            total: value.total,
            children: Object.values(value.accounts).map((value) => {
              console.log(value);
              return {
                name: value.name,
                value: value.total,
              };
            }),
          };
        }),
      });
    }
  }, [jsonChildrens]);

  const handleSave = (saveData, entity, account) => {
    // const updatedChildren = jsonChildrens;

    let newObj = JSON.parse(JSON.stringify(jsonChildrens));
    newObj["org"]["entities"][entity]["accounts"][account]["categories"] =
      saveData;
    setJsonChildrens(newObj);
  };

  const renderForm = () => {
    // console.log(renderElement);
    // console.log(jsonData);
    return (
      <div className="form">
        <h1 style={{ color: "navy" }}>{jsonData.name}</h1>
        <h2>Account Overview</h2>
        <h3>
          Balance:{" "}
          <span
            style={{ paddingLeft: "10px", fontSize: "24px", color: "navy" }}
          >
            ${jsonData.total}
          </span>
        </h3>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Paper
            style={{
              minWidth: "80%",
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              margin: "0 0 20px 0",
            }}
          >
            <TextField
              style={{ width: "500px", margin: "10px" }}
              id="outlined-basic"
              label="Entity"
              variant="outlined"
              value={newEntityValue}
              onChange={(e) => setNewEntityValue(e.target.value)}
              disabled={disableForm}
            />

            <TextField
              style={{ width: "500px", margin: "10px" }}
              id="outlined-basic"
              label="Balance"
              variant="outlined"
              value={newEntityBalanceValue}
              onChange={(e) => setNewEntityBalanceValue(e.target.value)}
              disabled={newEntityValue === "" || disableForm}
            />
            <StyledAddButton
              onClick={() => {
                appendEntity({
                  entity: newEntityValue,
                  balance: newEntityBalanceValue,
                });
              }}
              variant="contained"
              disabled={
                newEntityValue === "" ||
                newEntityBalanceValue === 0 ||
                disableForm
              }
            >
              Add Entity
            </StyledAddButton>
          </Paper>

          <Paper
            style={{
              minWidth: "80%",
              display: "flex",
              flexDirection: "column",
              // alignItems: "center",
              padding: "10px 20px 40px",
              margin: "0 0 20px 0",
            }}
          >
            <h3>Entity</h3>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={entitySelected}
              label="Age"
              onChange={(e) => setEntitySelected(e.target.value)}
              disabled={disableForm}
            >
              <MenuItem value={0}>Please Select</MenuItem>
              {jsonChildrens?.["org"]?.["entities"] &&
                Object.entries(jsonChildrens["org"]["entities"]).map(
                  ([key, value]) => {
                    // console.log(key, value);
                    return <MenuItem value={key}>{key}</MenuItem>;
                  }
                )}
              {/* <MenuItem value={1}>Entity 1</MenuItem>
            <MenuItem value={2}>Entity 2</MenuItem>
            <MenuItem value={3}>Entity 3</MenuItem> */}
            </Select>
          </Paper>

          {entitySelected !== 0 && (
            <Paper
              style={{
                minWidth: "80%",
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                margin: "0 0 20px 0",
              }}
            >
              <TextField
                style={{ width: "500px", margin: "10px" }}
                id="outlined-basic"
                label="Account"
                variant="outlined"
                value={newAccountValue}
                onChange={(e) => setNewAccountValue(e.target.value)}
                disabled={disableForm}
              />

              <TextField
                style={{ width: "500px", margin: "10px" }}
                id="outlined-basic"
                label="Balance"
                variant="outlined"
                value={newBalanceValue}
                onChange={(e) => setNewBalanceValue(e.target.value)}
                disabled={newAccountValue === "" || disableForm}
              />
              <Button
                sx={{
                  whitespace: "nowrap",
                  minWidth: "fit-content",
                  padding: "11.5px 24px",
                  maxHeight: "4em",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  appendRow({
                    entity: entitySelected,
                    account: newAccountValue,
                    balance: newBalanceValue,
                  });
                }}
                variant="contained"
                disabled={
                  newAccountValue === "" || newBalanceValue === 0 || disableForm
                }
              >
                Add Account
              </Button>
            </Paper>
          )}
          {entitySelected !== 0 && (
            <Paper
              style={{
                minWidth: "80%",
                display: "flex",
                flexDirection: "column",
                // alignItems: "center",
                padding: "10px 20px 40px",
                margin: "0 0 20px 0",
              }}
            >
              <h1> Accounts: </h1>
              <div
                style={{
                  margin: "20px 0",
                  // justifyContent: "center",
                  // display: "flex",
                  minWidth: "80%",
                }}
              >
                <CollapsibleTable
                  style={{}}
                  entity={entitySelected}
                  onSave={handleSave}
                  data={jsonData}
                  activeAccount={activeAccount}
                ></CollapsibleTable>
              </div>
            </Paper>
          )}
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
          {/* <Button variant="contained" onClick={handleClick}>
            Switch to Chart
          </Button> */}
        </Box>
      </div>
    );
  };

  const handleUpdateSelections = (depth, data, parent) => {
    console.log(depth, data, parent);
    switch (depth) {
      case 1:
        // console.log(depth, data, parent);
        setEntitySelected(data);
        break;
      case 2:
        // console.log(depth, data, parent);
        // setAccount
        setEntitySelected(parent);
        setActiveAccount(data);
        break;
      default:
    }
  };

  const [jsonError, setJsonError] = React.useState(false);
  const [updateJsonChildrenValue, setUpdateJsonChildrenValue] = React.useState(
    JSON.stringify(jsonChildrens, null, 4)
  );

  const handleUpdateJsonChildren = (value) => {
    try {
      if (JSON.parse(value)) {
        setJsonError(false);
        setJsonChildrens(JSON.parse(value));
      }
    } catch (e) {
      console.error("incorrect json");
      setJsonError(true);
    }
    setUpdateJsonChildrenValue(value);
    // console.log(value);
  };

  const ref = React.useRef(null);

  // console.log(JSON.stringify(jsonData, null, 4));

  const [specialRoot, setSpecialRoot] = React.useState(undefined);
  const storeRoot = (name) => {
    setSpecialRoot(name);
  };

  const [activePage, setActivePage] = React.useState("Main");
  const [width, setWidth] = React.useState(
    localStorage.getItem("width") || 800
  );
  const [size, setSize] = React.useState(localStorage.getItem("size") || 800);
  const [orgName, setOrgName] = React.useState(
    localStorage.getItem("org") || "Acme"
  );

  React.useEffect(() => {
    setJsonChildrens((prevState) => ({
      org: {
        ...prevState.org,
        name: orgName,
      },
    }));
    localStorage.setItem("org", orgName);
  }, [orgName]);

  React.useEffect(() => {
    localStorage.setItem("width", width);
  }, [width]);

  React.useEffect(() => {
    localStorage.setItem("size", size);
  }, [size]);

  return (
    <div className="App">
      <header></header>
      <MuiDrawer
        open={true}
        variant="permanent"
        ModalProps={{
          keepMounted: false,
        }}
        PaperProps={{
          style: {
            background: "#f6f6f6",
            border: 0,
            paddingTop: "2.5vh",
            position: "fixed",
            zIndex: 1,
            minWidth: "180px",
          },
        }}
      >
        <List>
          {["Main", "Settings"].map((text, index) => (
            <ListItem
              key={text}
              onClick={() => setActivePage(text)}
              disablePadding
              class="listItem"
            >
              <ListItemButton>
                <ListItemIcon sx={{ color: "black", minWidth: "36px" }}>
                  {text === "Main" ? <Home></Home> : <Settings></Settings>}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </MuiDrawer>
      {activePage === "Main" && (
        <div className="body">
          {/* <TransitionGroup in={chart}> */}
          {/* {chart && renderForm()} */}
          {renderForm()}
          <CSSTransition
            in={!show}
            nodeRef={ref}
            timeout={500}
            classNames="alert"
          >
            {Object.keys(jsonData).length > 0 && (
              <Box
                ref={ref}
                style={{
                  top: "60px",
                  right: "20px",
                  position: "fixed",
                  margin: "0 0 0 80px",
                }}
              >
                <Sunburst
                  // key={Date.now()}
                  recalculate={sortDataOnCategories}
                  data={jsonData}
                  keyId={size}
                  width={width}
                  size={size}
                  update={show}
                  storeRoot={storeRoot}
                  specialRoot={specialRoot}
                  goBack={() => {
                    setJsonChildrens(storedValue);
                    setDisableForm(false);
                  }}
                  updateSelections={handleUpdateSelections}
                />
              </Box>
            )}
          </CSSTransition>
          {/* </TransitionGroup> */}
        </div>
      )}
      {activePage === "Settings" && (
        <div style={{ margin: "80px 200px" }}>
          <h3>Width</h3>
          <TextField
            style={{ width: "500px", margin: "10px" }}
            id="outlined-basic"
            label="Width"
            variant="outlined"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
          <h3>Size</h3>
          <TextField
            style={{ width: "500px", margin: "10px" }}
            id="outlined-basic"
            label="Size"
            variant="outlined"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
          <h3>Org Name</h3>
          <TextField
            style={{ width: "500px", margin: "10px" }}
            id="outlined-basic"
            label="Org Name"
            variant="outlined"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
          <h3>JSON Data</h3>
          <TextField
            style={{ width: "500px", margin: "10px" }}
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows={100}
            error={jsonError}
            onChange={(e) => handleUpdateJsonChildren(e.target.value)}
            value={updateJsonChildrenValue}
          />
          <Button
            variant="contained"
            onClick={() => setJsonChildrens(updateJsonChildrenValue)}
          >
            Force Save
          </Button>
        </div>
      )}
      <footer></footer>
    </div>
  );
}

export default App;

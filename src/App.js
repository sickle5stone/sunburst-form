import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import Sunburst from "./SunburstChartInt";
import data3 from "./data3";
import datamap from "./datamap";
import { Button, Divider, MenuItem, Select, TextField } from "@mui/material";
import DataGrid from "./components/DataGrid";
import Drawer from "./components/Drawer";
import CollapsibleTable from "./components/CollapseTable";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

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

  // React.useEffect(() => {
  //   setShow(!show);
  //   // setTimeout(() => {
  //   //   setShow(false);
  //   // }, [500]);
  //   console.log(jsonData);
  // }, [jsonData]);

  // const categories = new Set();
  // for (const entity of Object.values(jsonChildrens.org.entities)) {
  //   for (const account of Object.values(entity.accounts)) {
  //     for (const category of Object.keys(account.categories)) {
  //       categories.add(category);
  //     }
  //   }
  // }

  // console.log(categories);

  // const selectedCategory = "uncategorized";

  // const matchingAccounts = [];
  // for (const [entityKey, entity] of Object.entries(
  //   jsonChildrens.org.entities
  // )) {
  //   for (const [accountKey, account] of Object.entries(entity.accounts)) {
  //     if (account.categories[selectedCategory]) {
  //       matchingAccounts.push({
  //         entity: entityKey,
  //         account: accountKey,
  //         total: account.total,
  //       });
  //     }
  //   }
  // }

  // const newData = {
  //   org: {
  //     name: jsonChildrens.org.name,
  //     total: jsonChildrens.org.total,
  //     categories: {},
  //   },
  // };

  // for (const [entityKey, entity] of Object.entries(
  //   jsonChildrens.org.entities
  // )) {
  //   for (const [accountKey, account] of Object.entries(entity.accounts)) {
  //     for (const [category, amount] of Object.entries(account.categories)) {
  //       if (!newData.org.categories[category]) {
  //         newData.org.categories[category] = {
  //           total: 0,
  //           accounts: [],
  //         };
  //       }
  //       newData.org.categories[category].accounts.push({
  //         entity: entityKey,
  //         account: accountKey,
  //         total: amount,
  //       });
  //       newData.org.categories[category].total += amount;
  //     }
  //   }
  // }

  // console.log(newData);

  // console.log(matchingAccounts);

  // Step 4: Display the matching accounts
  // console.log(`Accounts with category "${selectedCategory}":`);
  // for (const account of matchingAccounts) {
  //   console.log(
  //     `${account.entity} - ${account.account} - total: ${account.total}`
  //   );
  // }

  // React.useEffect(() => {
  //   setChart(false);
  // }, [data3]);

  // React.useEffect(() => {
  //   setChart(true);
  // }, [jsonChildrens]);
  // React.useEffect(() => {
  //   setChart(false);
  // }, [jsonData]);

  // React.useEffect(() => {
  //   // setChart(!chart);
  //   setTimeout(() => {
  //     setChart(chart);
  //   }, 200);
  // }, [jsonData]);

  // const handleClick = () => {
  //   setChart(!chart);
  // };

  useEffect(() => {
    makeJson(rows);
  }, [rows]);

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
                    uncategorized: Number.parseInt(balance),
                  },
                },
              },
            },
          },
        },
      };
    });
    // jsonChildrens["org"].entities = {
    //   ...jsonChildrens["org"].entities,
    //   [account]: {
    //     total: balance,
    //     accounts: {},
    //   },
    // };

    setNewEntityValue("");
    setNewEntityBalanceValue(0);
  };

  // console.log(jsonChildrens);

  const appendRow = (newFields = {}) => {
    if (Object.keys(newFields).length < 1) return;

    // const newRow = [];
    const { entity, level, key, balance, account } = newFields;

    // let newJsonChildrens = jsonChildrens;

    // let newObj = {
    //   org: {
    //     ...jsonChildrens["org"],
    //     entities: {
    //       ...jsonChildrens["org"].entities,
    //       [entitySelected]: {
    //         ...jsonChildrens["org"].entities[entitySelected],
    //         accounts: {
    //           ...jsonChildrens["org"].entities[entitySelected]["accounts"],
    //           [account]: {
    //             total: balance,
    //             uncategorized: balance,
    //           },
    //         },
    //       },
    //     },
    //   },
    // };
    let newObj = JSON.parse(JSON.stringify(jsonChildrens));
    newObj["org"]["entities"][entitySelected]["accounts"] = {
      ...newObj["org"]["entities"][entitySelected]["accounts"],
      [account]: {
        total: balance,
        categories: {
          uncategorized: balance,
        },
      },
    };
    setJsonChildrens(newObj);
    // newJsonChildrens["org"]["entities"][entitySelected]["accounts"] = {
    //   ...newJsonChildrens["org"]["entities"][entitySelected]["accounts"],
    //   [account]: {
    //     total: balance,
    //     uncategorized: balance,
    //   },
    // };

    // console.log(newJsonChildrens);
    // setJsonChildrens(newJsonChildrens);
    setNewAccountValue("");
    setNewBalanceValue(0);

    // console.log(jsonChildrens["org"]["entities"][entitySelected]);
    // setJsonChildrens();

    if (jsonChildrens[account] !== undefined) {
      return;
    }

    // newRow.push({ id: Date.now(), account: account, balance: balance });
    // appendStateArray(newRow, rows, setRows);
    // console.log("here");
    // console.log(jsonChildrens);
    // setJsonChildrens({
    //   ...jsonChildrens,
    //   [account]: [{ name: "uncategorized", value: balance }],
    // });

    // setJsonChildrens((prevState) => {
    //   return {
    //     org: {
    //       ...prevState["org"],
    //       entities: {
    //         ...prevState["org"]["entities"],
    //         [account]: {
    //           total: balance,
    //           accounts: {},
    //         },
    //       },
    //     },
    //   };
    // });
  };

  // console.log(jsonChildrens);

  const makeJson = (rows) => {
    if (rows.length < 1) return;
  };

  const loadData = (data) => {
    if (!data && data === undefined && data?.children === undefined) return;

    const tempData = data;

    const newElements = [];

    const manipulateJSON = () => {
      // tempData.children
      // console.log(tempData);
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
    let total = 0;

    // console.log(Object.values(jsonChildrens["org"]["entities"]));

    // console.log({
    //   name: jsonChildrens["org"]["name"],
    //   total: jsonChildrens["org"]["total"],
    //   children: [
    //     ...jsonData.children,
    //     ...Object.entries(jsonChildrens["org"]["entities"]).map(
    //       ([key, value]) => {
    //         console.log(key, value);
    //         return {
    //           name: key,
    //           total: value.total,
    //           children: Object.values(value.accounts),
    //         };
    //       }
    //     ),
    //   ],
    // });
    console.log("update was called");

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
                              children: [
                                {
                                  name: value,
                                  value,
                                },
                              ],
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
  }, [jsonChildrens]);

  //   ]
  // })

  // Object.entries(jsonChildrens).forEach(([key, value]) => {
  //   total = value.reduce(
  //     (acc, next) => Number.parseInt(acc) + Number.parseInt(next.value),
  //     0
  //   );
  // });

  // setJsonData((jsonData) => {
  //   console.log(jsonData);
  //   return {
  //     ...jsonData,
  //     total: total,
  //     children: Object.entries(jsonChildrens).map(([key, value]) => {
  //       return {
  //         name: key,
  //         children: value,
  //       };
  //     }),
  //   };
  // });

  const handleSave = (saveData, entity, account) => {
    // const updatedChildren = jsonChildrens;

    let newObj = JSON.parse(JSON.stringify(jsonChildrens));
    newObj["org"]["entities"][entity]["accounts"][account]["categories"] =
      saveData;
    setJsonChildrens(newObj);

    // updatedChildren[saveData["name"]] = saveData["children"];
    // setJsonChildrens((jsonChildren) => ({
    //   ...jsonChildren,
    //   [saveData["name"]]: saveData["children"],
    // }));
  };

  // React.useEffect(() => {
  //   loadData(data);
  // }, []);

  const renderForm = () => {
    // console.log(renderElement);
    // console.log(jsonData);
    return (
      <div className="form">
        <h1>{jsonData.name}</h1>
        <h2>Account Overview</h2>
        <h3>Balance: {jsonData.total}</h3>
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
            style={{ minWidth: "80%", display: "flex", alignItems: "center" }}
          >
            <TextField
              style={{ width: "500px", margin: "10px" }}
              id="outlined-basic"
              label="Entity"
              variant="outlined"
              value={newEntityValue}
              onChange={(e) => setNewEntityValue(e.target.value)}
            />

            <TextField
              style={{ width: "500px", margin: "10px" }}
              id="outlined-basic"
              label="Balance"
              variant="outlined"
              value={newEntityBalanceValue}
              onChange={(e) => setNewEntityBalanceValue(e.target.value)}
            />
            <Button
              style={{ maxHeight: "3.5em" }}
              onClick={() => {
                appendEntity({
                  entity: newEntityValue,
                  balance: newEntityBalanceValue,
                });
              }}
              variant="contained"
            >
              Add Entity
            </Button>
          </Paper>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={entitySelected}
            label="Age"
            onChange={(e) => setEntitySelected(e.target.value)}
          >
            <MenuItem value={0}>Please Select</MenuItem>
            {Object.entries(jsonChildrens["org"]["entities"]).map(
              ([key, value]) => {
                // console.log(key, value);
                return <MenuItem value={key}>{key}</MenuItem>;
              }
            )}
            {/* <MenuItem value={1}>Entity 1</MenuItem>
            <MenuItem value={2}>Entity 2</MenuItem>
            <MenuItem value={3}>Entity 3</MenuItem> */}
          </Select>

          <Paper
            style={{ minWidth: "80%", display: "flex", alignItems: "center" }}
          >
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
              style={{ maxHeight: "3.5em" }}
              onClick={() => {
                appendRow({
                  account: newAccountValue,
                  balance: newBalanceValue,
                });
              }}
              variant="contained"
            >
              Add Account
            </Button>
          </Paper>
          <div
            style={{
              margin: "20px 0",
              // justifyContent: "center",
              // display: "flex",
              minWidth: "80%",
            }}
          >
            {entitySelected !== 0 && (
              <CollapsibleTable
                style={{}}
                entity={entitySelected}
                onSave={handleSave}
                data={jsonData}
              ></CollapsibleTable>
            )}
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
          {/* <Button variant="contained" onClick={handleClick}>
            Switch to Chart
          </Button> */}
        </Box>
      </div>
    );
  };
  const ref = React.useRef(null);

  // console.log(JSON.stringify(jsonData, null, 4));

  return (
    <div className="App">
      <header></header>
      <div className="body">
        {/* <TransitionGroup in={chart}> */}
        {/* {chart && renderForm()} */}
        {renderForm()}
        <CSSTransition
          in={!show}
          nodeRef={ref}
          timeout={300}
          classNames="alert"
        >
          {Object.keys(jsonData).length > 0 && (
            <Box
              ref={ref}
              style={{
                right: "20px",
                position: "fixed",
                margin: "0 0 0 80px",
              }}
            >
              <Sunburst
                // key={Date.now()}
                data={jsonData}
                keyId={Date.now()}
                width={800}
                size={800}
                update={show}
              />
            </Box>
          )}
        </CSSTransition>
        {/* </TransitionGroup> */}
      </div>
      <footer></footer>
    </div>
  );
}

export default App;

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";

export default function TemporaryDrawer(props) {
  const { open, setOpen, row, onSave, data } = props;
  // console.log(data);
  const { name: account, children, value: balance, total } = data;
  // const accountCategories = {};

  const [accountCategories, setAccountCategories] = React.useState({});
  const [totalBalance, setTotalBalance] = React.useState(0);

  React.useEffect(() => {
    let totalBalance = 0;
    const categories = {};
    children?.forEach((child) => {
      if (child.name === "General Purpose") {
        setTempValue(child.value);
      }
      totalBalance += Number.parseInt(child.total);
      categories[child.name] = Number.parseInt(child.total);
    });

    // console.log(categories);
    setTotalBalance(totalBalance);
    setAccountCategories(categories);
  }, [data, children]);

  const [addCategory, setAddCategory] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");
  const [newBalance, setNewBalance] = React.useState(0);
  const [saving, setSaving] = React.useState(true);
  const [tempValue, setTempValue] = React.useState(0);

  const handleAddCategories = () => {
    if (accountCategories[newCategory] !== undefined) {
      return;
    }

    setAccountCategories({
      ...accountCategories,
      "General Purpose": tempValue,
      [newCategory]: Number.parseInt(newBalance),
    });
    setNewCategory("");
    setNewBalance(0);
  };

  const handleSave = () => {
    // console.log(newCategory);
    // if (newCategory === "") {
    //   return;
    // }

    // const newAcctCategory = {
    //   ...accountCategories,
    //   [newCategory]: Number.parseInt(newBalance),
    // };

    // setAccountCategories(newAcctCategory);
    setNewCategory("");
    setNewBalance(0);

    // console.log(newAcctCategory);
    onSave(accountCategories);
    // setOpen(!open);
  };

  // React.useEffect(() => {
  //   if (newBalance === 0) return;
  //   if (newCategory === "") return;

  //   setAccountCategories({
  //     ...accountCategories,
  //     [newCategory]: Number.parseInt(newBalance),
  //   });
  // }, [newCategory, newBalance, accountCategories]);

  const handleSetNewBalance = (newBalance) => {
    const limit = accountCategories["General Purpose"];

    const maxAmount = Math.min(newBalance, limit);
    setTempValue(limit - maxAmount);
    setNewBalance(maxAmount);
  };

  return (
    // <Drawer anchor={"right"} open={open} onClose={() => setOpen(!open)}>
    <Box sx={{ padding: "20px" }} role="presentation">
      <h1>Account: {account}</h1>
      <TextField
        style={{ margin: "20px 0px" }}
        id="outlined-basic"
        label="Total Balance"
        variant="outlined"
        value={total}
        disabled
      />
      <Divider></Divider>
      <h1>Categorize Account Balances</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Object.entries(accountCategories).map(([key, value]) => {
          return (
            <Box>
              <TextField
                style={{ margin: "20px 0px", flex: 1 }}
                id="outlined-basic"
                label="Category"
                variant="outlined"
                value={key}
                disabled={key === "General Purpose"}
              />
              <TextField
                style={{ margin: "20px 0px 0px 20px", flex: 1 }}
                id="outlined-basic"
                label="Balance for Category"
                variant="outlined"
                value={key === "General Purpose" ? tempValue : value}
                disabled={key === "General Purpose"}
              />
              {/* {!addCategory && (
              <Button onClick={() => setAddCategory(true)}>+</Button>
            )} */}
            </Box>
          );
        })}
        {addCategory ? (
          <React.Fragment>
            <div style={{ display: "flex", flex: 1 }}>
              <TextField
                style={{ margin: "20px 0" }}
                id="outlined-basic"
                label="Category"
                variant="outlined"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <TextField
                style={{ margin: "20px 0 0 20px" }}
                id="outlined-basic"
                label="Balance for Category"
                variant="outlined"
                value={newBalance}
                onChange={(e) => handleSetNewBalance(e.target.value)}
                disabled={newCategory.length === 0}
              />
              <Button
                style={{ margin: "25px 0px 25px 15px" }}
                variant="contained"
                onClick={() => handleAddCategories()}
              >
                +
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <Button variant="contained" onClick={() => setAddCategory(true)}>
            +
          </Button>
        )}
      </div>
      <Divider />
      <Button
        variant="contained"
        style={{ margin: "20px 0px" }}
        onClick={() => handleSave()}
      >
        Save
      </Button>
    </Box>
    // </Drawer>
  );
}

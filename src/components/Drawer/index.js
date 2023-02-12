import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";

export default function TemporaryDrawer(props) {
  const { open, setOpen, row, onSave, data } = props;
  console.log(data);
  const { name: account, children, value: balance } = data;
  // const accountCategories = {};

  const [accountCategories, setAccountCategories] = React.useState({});
  const [totalBalance, setTotalBalance] = React.useState(0);

  React.useEffect(() => {
    let totalBalance = 0;
    const categories = {};
    children.forEach((child) => {
      totalBalance += Number.parseInt(child.value);
      categories[child.name] = child.value;
    });

    setTotalBalance(totalBalance);
    setAccountCategories(categories);
  }, [children]);

  const [addCategory, setAddCategory] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");
  const [newBalance, setNewBalance] = React.useState(0);

  const handleAddCategories = () => {
    if (accountCategories[newCategory] !== undefined) {
      return;
    }
    setAccountCategories({
      ...accountCategories,
      [newCategory]: Number.parseInt(newBalance),
    });
    setNewCategory("");
    setNewBalance(0);
  };

  const handleSave = () => {
    onSave(accountCategories);
    // setOpen(!open);
  };

  return (
    // <Drawer anchor={"right"} open={open} onClose={() => setOpen(!open)}>
    <Box sx={{ padding: "20px" }} role="presentation">
      <h1>Account: {account}</h1>
      <TextField
        style={{ width: "400px", margin: "20px 0px" }}
        id="outlined-basic"
        label="Total Balance"
        variant="outlined"
        value={totalBalance}
        disabled
      />
      <Divider></Divider>
      <h1>Categorize Account Balances</h1>
      <div style={{ display: "flex" }}></div>
      {Object.entries(accountCategories).map(([key, value]) => {
        return (
          <React.Fragment>
            <TextField
              style={{ width: "400px", margin: "20px 0px" }}
              id="outlined-basic"
              label="Category"
              variant="outlined"
              value={key}
            />
            <TextField
              style={{ width: "400px", margin: "20px 0px" }}
              id="outlined-basic"
              label="Balance for Category"
              variant="outlined"
              value={value}
            />
            {!addCategory && (
              <Button onClick={() => setAddCategory(true)}>+</Button>
            )}
          </React.Fragment>
        );
      })}
      {addCategory && (
        <React.Fragment>
          <div style={{ display: "flex" }}>
            <TextField
              style={{ width: "400px", margin: "10px" }}
              id="outlined-basic"
              label="Category"
              variant="outlined"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <TextField
              style={{ width: "400px", margin: "10px" }}
              id="outlined-basic"
              label="Balance for Category"
              variant="outlined"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
            />
            <Button onClick={() => handleAddCategories()}>+</Button>
          </div>
        </React.Fragment>
      )}
      <Divider />
      <Button
        style={{ margin: "20px 0px" }}
        variant="outlined"
        onClick={() => handleSave()}
      >
        Save
      </Button>
    </Box>
    // </Drawer>
  );
}

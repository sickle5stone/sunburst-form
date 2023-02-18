import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TemporaryDrawer from "../Drawer";

function createData(account, balance) {
  return {
    account,
    balance,
    history: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { row, onSave, data, entity } = props;
  const [open, setOpen] = React.useState(false);

  if (data === undefined || Object.keys(data).length < 0) {
    return;
  }

  const handleSave = (saveData) => {
    // console.log(saveData, entity, data.name);
    // const appendSaveData = {
    //   name: data.name,
    //   children: Object.entries(saveData).map(([key, value]) => ({
    //     name: key,
    //     value,
    //   })),
    // };

    onSave(saveData, entity, data.name);
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {data.name}
        </TableCell>
        <TableCell align="right">{data.total}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TemporaryDrawer
              data={data}
              open={open}
              setOpen={setOpen}
              onSave={(saveData) => {
                handleSave(saveData);
              }}
            ></TemporaryDrawer>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

// const rows = [createData("Frozen yoghurt", 159, 6.0, 24, 4.0, 3.99)];

export default function CollapsibleTable(props) {
  const { rows, onSave, data, entity } = props;

  if (data.children.length < 1) {
    return;
  }

  // console.log(data, entity);
  const filtered = data?.children.filter((child) => {
    return child?.name === entity;
  });
  // console.log(filtered[0]);
  let filteredData = filtered[0];

  // console.log(filteredData);

  // console.log(filteredData);

  return (
    <TableContainer component={Paper} style={{}}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Account</TableCell>
            <TableCell align="right">Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.children.map((child) => (
            <Row
              key={child.name}
              data={child}
              onSave={onSave}
              entity={entity}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

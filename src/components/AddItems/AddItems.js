import React from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

const textTheme = createTheme({
  typography: {
    fontFamily: ["Calibri"],
    fontSize: 24,
  },
});

const AddItems = ({
  item,
  itemsList,
  addItem,
  validateCategory,
  validateMeasurement,
  validateName,
  validateQuantity,
}) => {
  const navigate = useNavigate();

  const addItems = () => {
    itemsList(item);
  };

  const measurementUnits = [
    {
      label: "Pounds",
      value: "Pounds",
    },
    {
      label: "Litre",
      value: "Litre",
    },
    {
      label: "Numbered Quantity",
      value: "Numbered Quantity",
    },
  ];

  const categories = [
    { label: "Food", value: "Food" },
    { label: "Drink", value: "Drink" },
  ];

  return (
    <>
      <ThemeProvider theme={textTheme}>
        <Typography sx={{ fontSize: "36px" }}>Add Items</Typography>
      </ThemeProvider>
      <Grid xs={12} mt={3}>
        <TextField
          label="Category"
          value={item.category}
          select
          onChange={(e) => addItem("category", e.target.value)}
          onBlur={validateCategory}
          error={item.errors.categoryError !== "" ? true : false}
          helperText={item.errors.categoryError}
          sx={{ width: "70%" }}
          variant="outlined"
          align="left"
          autoComplete="false"
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid xs={12} mt={3}>
        <TextField
          type="text"
          label="Name"
          onChange={(e) => addItem("name", e.target.value)}
          onBlur={validateName}
          error={item.errors.nameError !== "" ? true : false}
          helperText={item.errors.nameError}
          sx={{ width: "70%" }}
          value={item.name}
          variant="outlined"
          autoComplete="false"
        />
      </Grid>
      <Grid xs={12} mt={3}>
        <TextField
          label="Unit Of Measurement"
          value={item.measurement}
          select
          onChange={(e) => addItem("measurement", e.target.value)}
          onBlur={validateMeasurement}
          error={item.errors.measurementError !== "" ? true : false}
          helperText={item.errors.measurementError}
          sx={{ width: "70%" }}
          align="left"
          autoComplete="false"
        >
          {measurementUnits.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid xs={12} mt={3}>
        <TextField
          type="number"
          label="Quantity"
          onChange={(e) => addItem("quantity", e.target.value)}
          onBlur={validateQuantity}
          error={item.errors.quantityError !== "" ? true : false}
          helperText={item.errors.quantityError}
          value={item.quantity !== 0 && item.quantity}
          sx={{ width: "70%" }}
          autoComplete="false"
        />
      </Grid>

      <Grid xs={12} mt={3} mb={3}>
        <Tooltip title="Add Selected Items" arrow={true}>
          <Button
            variant="contained"
            size="large"
            onClick={addItems}
            sx={{ marginRight: "2%" }}
          >
            ADD
          </Button>
        </Tooltip>
        <Tooltip title="Go to Home" arrow={true}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/home")}
          >
            BACK
          </Button>
        </Tooltip>
      </Grid>
    </>
  );
};

export default AddItems;

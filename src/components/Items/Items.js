import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AddItems from "../AddItems/AddItems";
import ViewItems from "../ViewItems/ViewItems";
import { Paper } from "@mui/material";
import { getNGO, upateNGORequirementList } from "../../store/actions/items";
import { ALPHABET_REGEX } from "../../store/constants";

const Items = () => {
  const [item, setItem] = useState({
    category: "",
    name: "",
    measurement: "",
    quantity: 0,
    errors: {
      categoryError: "",
      nameError: "",
      measurementError: "",
      quantityError: "",
    },
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    getNGO(localStorage.getItem("username")).then((response) => {
      response.data.donate === undefined
        ? setItems([])
        : setItems(response.data.donate);
    });
  }, []);

  const addItem = (name, value) => {
    if (name === "name") {
      if (ALPHABET_REGEX.test(value)) {
        setItem({
          ...item,
          [name]: value,
        });
      }
    } else {
      setItem({
        ...item,
        [name]: name === "quantity" ? parseInt(value) : value,
      });
    }
  };

  const validateCategory = () => {
    if (
      item.category === "" ||
      item.category === undefined ||
      item.category === null
    ) {
      setItem({
        ...item,
        errors: {
          ...item.errors,
          categoryError: "Please add appropriate value to the field!",
        },
      });
    } else {
      setItem({
        ...item,
        errors: {
          ...item.errors,
          categoryError: "",
        },
      });
    }
  };

  const validateName = () => {
    if (item.name === "" || item.name === undefined || item.name === null) {
      setItem({
        ...item,
        errors: {
          ...item.errors,
          nameError: "Please add appropriate value to the field!",
        },
      });
    } else {
      setItem({
        ...item,
        errors: {
          ...item.errors,
          nameError: "",
        },
      });
    }
  };

  const validateMeasurement = () => {
    if (
      item.measurement === "" ||
      item.measurement === undefined ||
      item.measurement === null
    ) {
      setItem({
        ...item,
        errors: {
          ...item.errors,
          measurementError: "Please add appropriate value to the field!",
        },
      });
    } else {
      setItem({
        ...item,
        errors: {
          ...item.errors,
          measurementError: "",
        },
      });
    }
  };

  const validateQuantity = () => {
    if (
      item.quantity <= 0 ||
      item.quantity === undefined ||
      item.quantity === null
    ) {
      setItem({
        ...item,
        errors: {
          ...item.errors,
          quantityError: "Please add appropriate value to the field!",
        },
      });
    } else {
      setItem({
        ...item,
        errors: {
          ...item.errors,
          quantityError: "",
        },
      });
    }
  };

  const isItemValid = () => {
    if (
      item.name !== "" &&
      item.errors.nameError === "" &&
      item.category !== "" &&
      item.errors.categoryError === "" &&
      item.measurement !== "" &&
      item.errors.measurementError === "" &&
      item.quantity > 0 &&
      item.errors.quantityError === ""
    ) {
      return true;
    }
    return false;
  };

  const resetForm = () => {
    setItem({
      category: "",
      name: "",
      measurement: "",
      quantity: 0,
      errors: {
        categoryError: "",
        nameError: "",
        measurementError: "",
        quantityError: "",
      },
    });
  };

  const itemsList = (addedItem) => {
    if (isItemValid()) {
      let isExisting = -1;
      // eslint-disable-next-line array-callback-return
      items.map((item, index) => {
        if (
          item.name === addedItem.name &&
          item.measurement === addedItem.measurement &&
          item.category === addedItem.category
        ) {
          isExisting = index;
        }
      });

      let updatedRequirementList;
      if (isExisting === -1) {
        updatedRequirementList = [...items, addedItem];
      } else {
        updatedRequirementList = [...items];
        updatedRequirementList[isExisting].quantity =
          updatedRequirementList[isExisting].quantity +
          parseInt(addedItem.quantity);
      }

      upateNGORequirementList(
        localStorage.getItem("username"),
        updatedRequirementList
      ).then((response) => {
        setItems(response.data.Item.Attributes.donate);
        toast.success("Item added successfully!", {
          position: "bottom-right",
          theme: "dark",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        resetForm();
      });
    } else {
      toast.error("Item not added! Please add all the fields correctly.", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const removeItem = (itemDetails) => {
    let updatedUserList = items.filter((item) => {
      return (
        (item.name !== itemDetails.name ||
          item.quantity !== itemDetails.quantity ||
          item.measurement !== itemDetails.measurement ||
          item.category !== itemDetails.category) &&
        item
      );
    });

    upateNGORequirementList(
      localStorage.getItem("username"),
      updatedUserList
    ).then((response) => {
      setItems(response.data.Item.Attributes.donate);
      toast.success("Item removed successfully!", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  };

  return (
    <>
      <Grid align="center" container>
        <Grid xs={4} mt={6}>
          <Paper
            elevation={20}
            sx={{ marginLeft: "4%", marginRight: "2%", padding: "10px" }}
          >
            <AddItems
              item={item}
              itemsList={itemsList}
              addItem={addItem}
              validateCategory={validateCategory}
              validateMeasurement={validateMeasurement}
              validateName={validateName}
              validateQuantity={validateQuantity}
            />
          </Paper>
        </Grid>
        <Grid xs={8} mt={6}>
          <Paper
            elevation={20}
            sx={{ marginLeft: "2%", marginRight: "4%", padding: "10px" }}
          >
            <ViewItems items={items} removeItem={removeItem} />
          </Paper>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  );
};

export default Items;

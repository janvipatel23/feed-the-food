import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getNGO, makeDonation } from "../../store/actions/items";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import {
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ListItems from "../ViewItems/ListItems";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Donate() {
  const { username } = useParams();
  const [ngo, setNgo] = useState({});
  const [error, setError] = useState({ message: "", error: false });
  const [loading, setLoading] = useState(false);
  const [itemBucket, setItemBucket] = useState([]);
  const [reqObject, setReqObject] = useState({});
  const [btnMessage, setBtnMessage] = useState("Sending request....");

  const onSelectChange = (event) => {
    let item = ngo.donate.find((i) => i.name === event.target.value);
    if (item) {
      setReqObject({
        ...reqObject,
        donate: [item],
      });
    }
  };

  const onQuantityChange = (event) => {
    let item = reqObject.donate[0];

    if (item.quantity < event.target.value) {
      setError({
        message: "Value should be in range of quantity",
        error: true,
      });
    } else {
      item = { ...item, donatedQuantity: parseInt(event.target.value) };
      setReqObject({
        ...reqObject,
        donate: [item],
      });
      setError({ message: "", error: false });
    }
  };

  const handleSentRequest = () => {
    const obj = {
      donorUsername: localStorage.getItem("username"),
      ngoUsername: ngo.username,
      donate: [...itemBucket],
    };

    makeDonation(obj).then((response) => {
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "bottom-right",
          theme: "dark",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Something went wrong!", {
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
    });
  };

  const handleFormSubmit = async (event) => {
    setLoading(true);

    let items = itemBucket.concat(reqObject.donate[0]);
    setItemBucket(items);
    setLoading(false);

    let addedItemIndex = ngo.donate.findIndex(
      (i) => i.name === reqObject.donate[0].name
    );
    let copy = [...ngo.donate];
    copy.splice(addedItemIndex, 1);
    if (copy.length < 1) {
      setBtnMessage("No more item ");
      setLoading(true);
    }
    setNgo({ ...ngo, donate: copy });
  };

  useEffect(() => {
    /** Passing the logged in NGO ID */
    getNGO(username).then((response) => {
      console.log("----- ", response);
      setReqObject({
        id: response.data.documentKey,
        name: response.data.name,
        username: response.data.username,
        donate: response.data.donate,
      });

      setNgo(response.data);
    });
  }, []);

  return ngo.documentKey ? (
    <>
      <Grid
        container
        spacing={0}
        direction="row"
        justifyContent="center"
        my={10}
      >
        <Grid item xs={10}>
          <Card
            sx={{
              minWidth: "80%",
              borderTop: "3px solid #1565c0",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          >
            <CardContent>
              <Typography
                variant="h2"
                component="div"
                style={{ textAlign: "center" }}
              >
                Donate To
              </Typography>
              <Grid display={"flex"} justifyContent={"space-evenly"} mx={3}>
                <Grid xs={4} item>
                  <Box>
                    <Box>
                      <Box>
                        <Box my={2}>
                          <TextField
                            id="name"
                            type={"text"}
                            variant="outlined"
                            fullWidth
                            required
                            value={ngo.name}
                            disabled
                          />
                        </Box>
                        <Box my={2}>
                          <FormControl fullWidth>
                            <InputLabel id="item-role-select-label">
                              Select an item to donate
                            </InputLabel>
                            <Select
                              labelId="item-select-label"
                              id="type"
                              fullWidth
                              label="Select an item to donate"
                              onChange={onSelectChange}
                              value={reqObject.donate[0].name}
                            >
                              {ngo?.donate?.map((item) => (
                                <MenuItem value={item.name} key={item.name}>
                                  {item.name} ({item.category},{" "}
                                  {item.measurement}, {item.quantity})
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Box my={2}>
                          <TextField
                            id="name"
                            type={"number"}
                            variant="outlined"
                            fullWidth
                            placeholder="Number of Piece/ Litre/ Pounds"
                            onChange={onQuantityChange}
                            error={error.error}
                            helperText={error.message}
                            required
                          />
                        </Box>
                        <Box width="90%" ml={5} mb={2}>
                          <LoadingButton
                            loading={loading}
                            loadingIndicator={btnMessage}
                            variant="outlined"
                            fullWidth
                            color="secondary"
                            style={{ borderRadius: "15px" }}
                            onClick={handleFormSubmit}
                          >
                            Add to card
                          </LoadingButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Divider orientation="vertical"></Divider>
                </Grid>
                <Grid item xs={6}>
                  <ListItems items={itemBucket}></ListItems>
                  <Box width="80%" ml={5} my={2}>
                    <LoadingButton
                      loading={false}
                      loadingIndicator="Sending request"
                      variant="outlined"
                      fullWidth
                      color="secondary"
                      onClick={handleSentRequest}
                      style={{ borderRadius: "15px" }}
                    >
                      Send Request
                    </LoadingButton>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  ) : (
    <Box></Box>
  );
}

export default Donate;

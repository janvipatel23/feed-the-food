import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, TableContainer, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { getNGO } from "../../store/actions/items";
import { useNavigate } from "react-router-dom";

const textTheme = createTheme({
  typography: {
    fontFamily: ["Calibri"],
    fontSize: 24,
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const NGODonationPage = () => {
  const navigate = useNavigate();

  const [ngoDonationItems, setNGODonationItems] = useState([]);
  useEffect(() => {
    getNGO(localStorage.getItem("username")).then((response) => {
      response.data.donatedItems === undefined
        ? setNGODonationItems([])
        : setNGODonationItems(response.data.donatedItems);
    });
  }, []);

  return (
    <>
      <ThemeProvider theme={textTheme}>
        <Typography
          sx={{
            fontSize: "36px",
            color: "green",
            fontWeight: "bolder",
            margin: "1rem",
          }}
        >
          Donations Recieved
        </Typography>
        <Grid align="center" ml={2} mr={2}>
          <Grid container xs={12} align="center" mt={3}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 800 }} aria-label="Items Table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell align="right">Name</StyledTableCell>
                    <StyledTableCell align="right">Unit</StyledTableCell>
                    <StyledTableCell align="right">Quantity</StyledTableCell>
                  </TableRow>
                </TableHead>
                {ngoDonationItems.length > 0 ? (
                  <>
                    <TableBody>
                      {ngoDonationItems.map((row) => (
                        <>
                          <StyledTableRow key={row.name}>
                            <StyledTableCell component="th" scope="row">
                              {row.category}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {row.name}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {row.measurement}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {row.quantity}
                            </StyledTableCell>
                          </StyledTableRow>
                        </>
                      ))}
                    </TableBody>
                  </>
                ) : (
                  <TableBody c align="center">
                    <TableRow>
                      <TableCell
                        sx={{ fontSize: "24px" }}
                        align="center"
                        colSpan={5}
                      >
                        No items found
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Grid>
          <Button
            variant="contained"
            sx={{ marginTop: "1%" }}
            onClick={() => navigate("/home")}
            size="small"
          >
            BACK
          </Button>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default NGODonationPage;

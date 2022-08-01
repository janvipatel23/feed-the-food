import React from "react";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { TableContainer } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const textTheme = createTheme({
  typography: {
    fontFamily: ["Calibri"],
    fontSize: 18,
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

const ListItems = ({ items }) => {
  return (
    <>
      <ThemeProvider theme={textTheme}>
        <Grid container align="center" mt={3}>
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
              {items?.length > 0 ? (
                <TableBody>
                  {items.map((row) => (
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
                        {row.donatedQuantity
                          ? row.donatedQuantity
                          : row.quantity}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody align="center">
                  <TableRow>
                    <TableCell
                      sx={{ fontSize: "18px" }}
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
      </ThemeProvider>
    </>
  );
};

export default ListItems;
